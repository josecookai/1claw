import { Test } from '@nestjs/testing';
import { CreditsService } from './credits.service';
import { PrismaService } from '../../prisma.service';

const mockCreditLedger = { aggregate: jest.fn(), create: jest.fn() };
const mockSubscription = { findFirst: jest.fn() };
const mockProcessedEvent = { create: jest.fn() };

const mockPrisma = {
  creditLedger: mockCreditLedger,
  subscription: mockSubscription,
  processedEvent: mockProcessedEvent,
  $transaction: jest.fn((callback: (tx: Record<string, unknown>) => Promise<unknown>) =>
    callback({
      creditLedger: mockCreditLedger,
      subscription: mockSubscription,
      processedEvent: mockProcessedEvent,
    }),
  ),
} as unknown as PrismaService;

describe('CreditsService', () => {
  let service: CreditsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockProcessedEvent.create.mockResolvedValue({});
    const module = await Test.createTestingModule({
      providers: [
        CreditsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get(CreditsService);
  });

  describe('computeMode', () => {
    it('balance > smartThreshold → STRONG', () => {
      expect(service.computeMode(1000, { smart: 800, light: 200 })).toEqual({
        mode: 'STRONG',
        queued: false,
      });
    });

    it('0 < balance <= smartThreshold → SMART', () => {
      expect(service.computeMode(800, { smart: 800, light: 200 })).toEqual({
        mode: 'SMART',
        queued: false,
      });
      expect(service.computeMode(400, { smart: 800, light: 200 })).toEqual({
        mode: 'SMART',
        queued: false,
      });
    });

    it('0 < balance <= lightThreshold → LIGHT', () => {
      expect(service.computeMode(200, { smart: 800, light: 200 })).toEqual({
        mode: 'LIGHT',
        queued: false,
      });
      expect(service.computeMode(100, { smart: 800, light: 200 })).toEqual({
        mode: 'LIGHT',
        queued: false,
      });
    });

    it('balance <= 0 → QUEUED', () => {
      expect(service.computeMode(0, { smart: 800, light: 200 })).toEqual({
        mode: 'QUEUED',
        queued: true,
      });
      expect(service.computeMode(-100, { smart: 800, light: 200 })).toEqual({
        mode: 'QUEUED',
        queued: true,
      });
    });
  });

  describe('grantMonthlyCredits', () => {
    it('grants 4000 for starter', async () => {
      mockProcessedEvent.create.mockResolvedValue({});
      mockCreditLedger.create.mockResolvedValue({});
      mockCreditLedger.aggregate.mockResolvedValue({ _sum: { deltaCredits: 4000 } });

      const res = await service.grantMonthlyCredits('u1', 'starter_20', 'inv_1');
      expect(res.granted).toBe(4000);
      expect(res.idempotent).toBe(false);
      expect(mockCreditLedger.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'u1',
          deltaCredits: 4000,
          reason: 'SUB_GRANT',
          refId: 'inv_1',
        }),
      });
    });

    it('grants 50000 for pro', async () => {
      mockProcessedEvent.create.mockResolvedValue({});
      mockCreditLedger.create.mockResolvedValue({});

      const res = await service.grantMonthlyCredits('u1', 'max_200', 'inv_2');
      expect(res.granted).toBe(50000);
      expect(res.idempotent).toBe(false);
    });

    it('idempotent: same refId returns 0 granted', async () => {
      mockProcessedEvent.create.mockRejectedValue({ code: 'P2002' });

      const res = await service.grantMonthlyCredits('u1', 'starter_20', 'inv_1');
      expect(res.granted).toBe(0);
      expect(res.idempotent).toBe(true);
      expect(mockCreditLedger.create).not.toHaveBeenCalled();
    });
  });

  describe('topupCredits', () => {
    it('grants 2000 for topup10', async () => {
      mockProcessedEvent.create.mockResolvedValue({});
      mockCreditLedger.create.mockResolvedValue({});

      const res = await service.topupCredits('u1', 'topup10', 'pi_1');
      expect(res.granted).toBe(2000);
      expect(res.idempotent).toBe(false);
    });

    it('idempotent: same refId returns 0 granted', async () => {
      mockProcessedEvent.create.mockRejectedValue({ code: 'P2002' });

      const res = await service.topupCredits('u1', 'topup10', 'pi_1');
      expect(res.granted).toBe(0);
      expect(res.idempotent).toBe(true);
      expect(mockCreditLedger.create).not.toHaveBeenCalled();
    });
  });

  describe('debitForChat', () => {
    it('returns ok: false when balance <= 0', async () => {
      mockProcessedEvent.create.mockResolvedValue({});
      mockCreditLedger.aggregate.mockResolvedValue({ _sum: { deltaCredits: 0 } });
      mockSubscription.findFirst.mockResolvedValue({ plan: 'starter_20' });

      const res = await service.debitForChat('u1', 'req_1', 100);
      expect(res.ok).toBe(false);
      expect(mockCreditLedger.create).not.toHaveBeenCalled();
    });

    it('creates CHAT_DEBIT when balance > 0', async () => {
      mockProcessedEvent.create.mockResolvedValue({});
      mockCreditLedger.aggregate.mockResolvedValue({ _sum: { deltaCredits: 1000 } });
      mockSubscription.findFirst.mockResolvedValue({ plan: 'starter_20' });
      mockCreditLedger.create.mockResolvedValue({});

      const res = await service.debitForChat('u1', 'req_1', 50);
      expect(res.ok).toBe(true);
      expect(mockCreditLedger.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'u1',
          deltaCredits: -50,
          reason: 'CHAT_DEBIT',
          refId: 'req_1',
        }),
      });
    });
  });
});

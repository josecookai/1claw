import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreditLedgerReason, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import type { PlanKey } from './dto/grant-monthly.dto';
import type { TopupPack } from './dto/topup.dto';

const PLAN_CREDITS: Record<string, number> = {
  starter_20: 4000,
  starter: 4000,
  pro_40: 50000,
  pro: 50000,
  max_200: 50000,
};

const PACK_CREDITS: Record<string, number> = {
  topup10: 2000,
  topup50: 12000,
  pack_10: 2000,
  pack_50: 12000,
};

const THRESHOLDS: Record<string, { smart: number; light: number }> = {
  starter_20: { smart: 800, light: 200 },
  starter: { smart: 800, light: 200 },
  pro_40: { smart: 5000, light: 1000 },
  pro: { smart: 5000, light: 1000 },
  max_200: { smart: 5000, light: 1000 },
};

export type Mode = 'STRONG' | 'SMART' | 'LIGHT' | 'QUEUED';

@Injectable()
export class CreditsService {
  private readonly logger = new Logger(CreditsService.name);

  constructor(private prisma: PrismaService) {}

  private async ensureEventNotProcessed(
    provider: string,
    eventId: string,
    type: string,
    tx: Prisma.TransactionClient,
  ): Promise<boolean> {
    try {
      await tx.processedEvent.create({
        data: { provider, eventId, type },
      });
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === 'P2002') {
        this.logger.log({ duplicate: true, provider, eventId, type });
        return false;
      }
      throw e;
    }
    return true;
  }

  async getBalance(userId: string): Promise<number> {
    const agg = await this.prisma.creditLedger.aggregate({
      where: { userId },
      _sum: { deltaCredits: true },
    });
    return agg._sum.deltaCredits ?? 0;
  }

  async getPlanAndMode(userId: string): Promise<{
    plan: string;
    mode: Mode;
    queued: boolean;
    balance: number;
    thresholds: { smart: number; light: number; queue: number };
  }> {
    const balance = await this.getBalance(userId);
    const sub = await this.prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { renewAt: 'desc' },
    });
    const plan = sub?.plan ?? 'starter';
    const thresholds = THRESHOLDS[plan] ?? THRESHOLDS.starter;
    const { mode, queued } = this.computeMode(balance, thresholds);
    return {
      plan,
      mode,
      queued,
      balance,
      thresholds: {
        smart: thresholds.smart,
        light: thresholds.light,
        queue: 0,
      },
    };
  }

  computeMode(balance: number, thresholds?: { smart: number; light: number }): { mode: Mode; queued: boolean } {
    const t = thresholds ?? THRESHOLDS.starter;
    if (balance > t.smart) return { mode: 'STRONG', queued: false };
    if (balance > t.light && balance <= t.smart) return { mode: 'SMART', queued: false };
    if (balance > 0 && balance <= t.light) return { mode: 'LIGHT', queued: false };
    return { mode: 'QUEUED', queued: true };
  }

  /** Grant monthly credits (called by Stripe webhook on invoice.paid) */
  async grantMonthlyCredits(
    userId: string,
    plan: string | PlanKey,
    refId: string,
    note?: string,
  ): Promise<{ granted: number; idempotent: boolean }> {
    const planKey = typeof plan === 'string' ? plan : plan;
    const credits = PLAN_CREDITS[planKey] ?? PLAN_CREDITS.starter;

    const result = await this.prisma.$transaction(async (tx) => {
      const ok = await this.ensureEventNotProcessed('stripe', refId, 'invoice.paid', tx);
      if (!ok) return { granted: 0, idempotent: true };

      await tx.creditLedger.create({
        data: {
          userId,
          deltaCredits: credits,
          reason: CreditLedgerReason.SUB_GRANT,
          refId,
          note: note ?? `Monthly grant for ${planKey}`,
        },
      });
      return { granted: credits, idempotent: false };
    });

    return result;
  }

  /** Topup credits (called by Stripe webhook on checkout.session.completed / payment_intent.succeeded) */
  async topupCredits(
    userId: string,
    pack: string | TopupPack,
    refId: string,
    note?: string,
  ): Promise<{ granted: number; idempotent: boolean }> {
    const packKey = typeof pack === 'string' ? pack : pack;
    const credits = PACK_CREDITS[packKey] ?? 0;
    if (credits <= 0) return { granted: 0, idempotent: true };

    const result = await this.prisma.$transaction(async (tx) => {
      const ok = await this.ensureEventNotProcessed('stripe', refId, 'payment_intent.succeeded', tx);
      if (!ok) return { granted: 0, idempotent: true };

      await tx.creditLedger.create({
        data: {
          userId,
          deltaCredits: credits,
          reason: CreditLedgerReason.TOPUP,
          refId,
          note: note ?? `Topup ${packKey}`,
        },
      });
      return { granted: credits, idempotent: false };
    });

    return result;
  }

  /** Debit for chat (called by Chat API before LLM call) */
  async debitForChat(
    userId: string,
    requestId: string,
    estimatedCredits: number,
    note?: string,
  ): Promise<{ ok: boolean; queued: boolean }> {
    if (estimatedCredits <= 0) throw new BadRequestException('estimatedCredits must be positive');

    const sub = await this.prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { renewAt: 'desc' },
    });
    const plan = sub?.plan ?? 'starter';
    const thresholds = THRESHOLDS[plan] ?? THRESHOLDS.starter;

    const result = await this.prisma.$transaction(async (tx) => {
      const ok = await this.ensureEventNotProcessed('internal', requestId, 'chat.debit', tx);
      if (!ok) {
        return { status: 'ignored' as const, debited: 0 };
      }

      const agg = await tx.creditLedger.aggregate({
        where: { userId },
        _sum: { deltaCredits: true },
      });
      const balance = agg._sum.deltaCredits ?? 0;

      const debit = Math.min(estimatedCredits, Math.max(balance, 0));
      if (debit === 0) {
        return { status: 'rejected' as const, debited: 0 };
      }

      await tx.creditLedger.create({
        data: {
          userId,
          deltaCredits: -debit,
          reason: CreditLedgerReason.CHAT_DEBIT,
          refId: requestId,
          note: note ?? 'Chat debit',
        },
      });
      return { status: 'applied' as const, debited: debit };
    });

    const { mode, queued } = this.computeMode(0, thresholds); // queued for display
    if (result.status === 'rejected') {
      return { ok: false, queued };
    }
    return { ok: result.status === 'applied', queued };
  }

  /** Usage today: credits debited from CreditLedger (CHAT_DEBIT) */
  async getUsageToday(userId: string): Promise<{ day: string; usedCredits: number; balance: number }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayStr = today.toISOString().slice(0, 10);

    const debitSum = await this.prisma.creditLedger.aggregate({
      where: {
        userId,
        reason: CreditLedgerReason.CHAT_DEBIT,
        createdAt: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      _sum: { deltaCredits: true },
    });
    const usedCredits = Math.abs(debitSum._sum.deltaCredits ?? 0);
    const balance = await this.getBalance(userId);

    return { day: dayStr, usedCredits, balance };
  }

  /** Usage history: CHAT_DEBIT per day */
  async getUsageHistory(userId: string, range: '7d' | '30d'): Promise<Array<{ day: string; usedCredits: number }>> {
    const days = range === '30d' ? 30 : 7;
    const result: Array<{ day: string; usedCredits: number }> = [];

    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);

      const debitSum = await this.prisma.creditLedger.aggregate({
        where: {
          userId,
          reason: CreditLedgerReason.CHAT_DEBIT,
          createdAt: {
            gte: d,
            lt: nextDay,
          },
        },
        _sum: { deltaCredits: true },
      });
      const usedCredits = Math.abs(debitSum._sum.deltaCredits ?? 0);
      result.push({ day: d.toISOString().slice(0, 10), usedCredits });
    }

    result.sort((a, b) => a.day.localeCompare(b.day));
    return result;
  }
}

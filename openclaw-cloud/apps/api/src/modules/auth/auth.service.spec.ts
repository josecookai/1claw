import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma.service';
import * as bcrypt from 'bcrypt';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1h' } }),
      ],
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  describe('register', () => {
    it('creates user and returns token', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        password: 'hashed',
      });
      const res = await service.register('a@b.com', 'password123');
      expect(res.userId).toBe('user-1');
      expect(res.token).toBeDefined();
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'a@b.com',
          password: expect.any(String),
        }),
      });
    });

    it('throws if email exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'x', email: 'a@b.com' });
      await expect(service.register('a@b.com', 'p')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('returns token for valid password', async () => {
      const hash = await bcrypt.hash('secret', 10);
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', password: hash });
      const res = await service.login('a@b.com', 'secret');
      expect(res.userId).toBe('u1');
      expect(res.token).toBeDefined();
    });

    it('throws for invalid password', async () => {
      const hash = await bcrypt.hash('secret', 10);
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', password: hash });
      await expect(service.login('a@b.com', 'wrong')).rejects.toThrow(UnauthorizedException);
    });

    it('throws for unknown user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login('x@y.com', 'p')).rejects.toThrow(UnauthorizedException);
    });
  });
});

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ChatAuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers.authorization;
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
    const internalSecret = req.headers['x-internal-secret'] as string | undefined;
    const body = req.body as { chatId?: string; userId?: string };

    // Path 1: JWT (Web/API direct)
    if (token) {
      try {
        const payload = this.jwt.verify(token);
        (req as Request & { userId?: string }).userId = payload.sub;
        return true;
      } catch {
        throw new UnauthorizedException('Invalid token');
      }
    }

    // Path 2: Internal Bot (chatId + secret; INTERNAL_API_SECRET must be set)
    const expectedSecret = process.env.INTERNAL_API_SECRET;
    if (
      expectedSecret &&
      internalSecret === expectedSecret &&
      body.chatId
    ) {
      const binding = await this.prisma.telegramBinding.findFirst({
        where: { chatId: body.chatId },
      });
      if (binding) {
        (req as Request & { userId?: string }).userId = binding.userId;
        return true;
      }
    }

    throw new UnauthorizedException('Auth required: JWT or X-Internal-Secret + chatId');
  }
}

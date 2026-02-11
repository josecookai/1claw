import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { routeWithFallback, RouterError, callOpenAI } from 'router-core';
import { ERROR_CODES } from 'shared';
import { randomUUID } from 'crypto';

const OPENAI_KEY = process.env.OPENAI_API_KEY;

const DAILY_LIMITS: Record<string, number> = {
  starter_20: 10_000,
  pro_40: 50_000,
  max_200: 200_000,
};

@Controller('v1')
export class ChatController {
  constructor(private prisma: PrismaService) {}

  @Post('chat')
  async chat(
    @Body() body: { userId?: string; chatId?: string; message: string; policy?: string },
  ) {
    const { message, policy = 'BEST' } = body;
    const requestId = randomUUID();

    let userId = body.userId;
    if (!userId && body.chatId) {
      const binding = await this.prisma.telegramBinding.findFirst({
        where: { chatId: body.chatId },
      });
      userId = binding?.userId;
    }
    if (!userId) {
      return { error: 'AUTH_REQUIRED', requestId };
    }

    const sub = await this.prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { renewAt: 'desc' },
    });
    if (!sub) {
      return {
        error: ERROR_CODES.BILLING_SUBSCRIPTION_INACTIVE,
        requestId,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const usage = await this.prisma.usageLedger.aggregate({
      where: { userId, day: today },
      _sum: { tokens: true },
    });
    const used = usage._sum.tokens ?? 0;
    const limit = DAILY_LIMITS[sub.plan] ?? 10_000;
    if (used >= limit) {
      return {
        error: ERROR_CODES.BILLING_QUOTA_EXCEEDED,
        requestId,
      };
    }

    try {
      const result = await routeWithFallback({
        userId,
        message,
        policy: policy as 'BEST' | 'CHEAP' | 'CN_OK',
      });

      let reply: string;
      let tokens = Math.ceil(message.length * 1.5);

      if (result.provider === 'openai' && OPENAI_KEY) {
        const openaiResult = await callOpenAI(OPENAI_KEY, message, result.model);
        reply = openaiResult.reply;
        tokens = openaiResult.tokens ?? tokens;
      } else {
        reply = `[Stub] You said: ${message}`;
      }

      await this.prisma.usageLedger.create({
        data: {
          userId,
          day: today,
          tokens,
          cost: 0,
          provider: result.provider,
        },
      });

      return {
        reply,
        providerUsed: result.provider,
        requestId,
      };
    } catch (e) {
      if (e instanceof RouterError) {
        return {
          error: e.code,
          message: e.message,
          retryable: e.retryable,
          requestId,
        };
      }
      throw e;
    }
  }
}

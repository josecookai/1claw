import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma.service';
import { CreditsService } from '../billing/credits.service';
import {
  getProviderOrder,
  callOpenAI,
  callKimi,
  PROVIDER_MODELS,
  type ProviderResult,
} from 'router-core';
import { ERROR_CODES } from 'shared';
import { randomUUID } from 'crypto';
import { ChatAuthGuard } from '../../common/guards/chat-auth.guard';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const MOONSHOT_KEY = process.env.MOONSHOT_API_KEY;

function fallbackTokenEstimate(message: string): number {
  return Math.ceil(message.length * 1.5);
}

/** Credits to debit per request (pre-call estimate; actual tokens may differ) */
function estimateCreditsForMessage(message: string): number {
  return Math.max(50, Math.ceil(message.length * 1.5));
}

async function callProvider(
  provider: string,
  message: string,
  model: string,
): Promise<ProviderResult> {
  if (provider === 'openai' && OPENAI_KEY) {
    return callOpenAI(OPENAI_KEY, message, model);
  }
  if (provider === 'kimi' && MOONSHOT_KEY) {
    return callKimi(MOONSHOT_KEY, message, model);
  }
  throw new Error(`Provider ${provider} not configured`);
}

@Controller('v1')
export class ChatController {
  constructor(
    private prisma: PrismaService,
    private creditsService: CreditsService,
  ) {}

  @Post('chat')
  @UseGuards(ChatAuthGuard, RateLimitGuard)
  async chat(
    @Req() req: Request & { userId?: string },
    @Body() body: { message: string; policy?: string },
  ) {
    const { message, policy = 'BEST' } = body;
    const requestId = randomUUID();
    const userId = req.userId;
    if (!userId) {
      return { error: 'AUTH_REQUIRED', requestId };
    }

    const { plan, mode, queued, balance } = await this.creditsService.getPlanAndMode(userId);
    if (queued || balance <= 0) {
      return {
        error: balance <= 0 ? ERROR_CODES.BILLING_QUOTA_EXCEEDED : 'BILLING_QUEUED',
        message: balance <= 0 ? 'Credits exhausted. Top-up to continue.' : 'Low credits. Queue mode.',
        requestId,
      };
    }

    const estimatedCredits = estimateCreditsForMessage(message);
    const { ok } = await this.creditsService.debitForChat(userId, requestId, estimatedCredits);
    if (!ok) {
      return {
        error: ERROR_CODES.BILLING_QUOTA_EXCEEDED,
        requestId,
      };
    }

    const providerOrder = getProviderOrder(policy as 'BEST' | 'CHEAP' | 'CN_OK');
    let lastError: Error | null = null;

    for (const provider of providerOrder) {
      const model = PROVIDER_MODELS[provider] ?? 'gpt-4o';
      try {
        const result = await callProvider(provider, message, model);
        const tokens = result.tokens ?? fallbackTokenEstimate(message);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
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
          reply: result.reply,
          providerUsed: result.provider,
          tier: mode,
          plan,
          requestId,
        };
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e));
      }
    }

    return {
      error: 'ROUTER_NO_PROVIDER',
      message: lastError?.message ?? 'All providers failed',
      retryable: true,
      requestId,
    };
  }
}

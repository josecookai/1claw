import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreditsService } from './credits.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('v1')
export class CreditsController {
  constructor(private credits: CreditsService) {}

  @Get('credits/balance')
  @UseGuards(JwtAuthGuard)
  async balance(@Req() req: Request & { userId?: string }) {
    const userId = req.userId;
    if (!userId) return { error: 'Unauthorized' };
    const data = await this.credits.getPlanAndMode(userId);
    return {
      balance: data.balance,
      plan: data.plan,
      mode: data.mode,
      thresholds: data.thresholds,
      queued: data.queued,
    };
  }

  @Get('usage/today')
  @UseGuards(JwtAuthGuard)
  async usageToday(@Req() req: Request & { userId?: string }) {
    const userId = req.userId;
    if (!userId) return { error: 'Unauthorized' };
    return this.credits.getUsageToday(userId);
  }

  @Get('usage/history')
  @UseGuards(JwtAuthGuard)
  async usageHistory(
    @Req() req: Request & { userId?: string },
    @Query('range') range: '7d' | '30d' = '7d',
  ) {
    const userId = req.userId;
    if (!userId) return { error: 'Unauthorized' };
    const validRange = range === '30d' ? '30d' : '7d';
    return this.credits.getUsageHistory(userId, validRange);
  }
}

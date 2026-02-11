import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Controller('v1')
export class UsageController {
  constructor(private prisma: PrismaService) {}

  @Get('usage')
  async getUsage(@Query('userId') userId: string) {
    if (!userId) {
      return { error: 'userId required' };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const usage = await this.prisma.usageLedger.aggregate({
      where: { userId, day: today },
      _sum: { tokens: true, cost: true },
    });
    const byDay = await this.prisma.usageLedger.groupBy({
      by: ['day'],
      where: { userId },
      _sum: { tokens: true, cost: true },
      orderBy: { day: 'desc' },
      take: 30,
    });
    return {
      today: { tokens: usage._sum.tokens ?? 0, cost: usage._sum.cost ?? 0 },
      recent: byDay.map((r) => ({ day: r.day, tokens: r._sum.tokens ?? 0, cost: r._sum.cost ?? 0 })),
    };
  }
}

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('v1/subscription')
export class SubscriptionController {
  constructor(private prisma: PrismaService) {}

  @Post('select')
  @UseGuards(JwtAuthGuard)
  async select(@Req() req: Request & { userId?: string }, @Body() body: { plan: string; policy?: string }) {
    const userId = req.userId;
    if (!userId) throw new Error('No userId');
    const { plan = 'pro_40', policy = 'BEST' } = body;
    const planKey = ['starter_20', 'pro_40', 'max_200'].includes(plan.toLowerCase()) ? plan.toLowerCase() : plan;
    const renewAt = new Date();
    renewAt.setMonth(renewAt.getMonth() + 1);
    const sub = await this.prisma.subscription.create({
      data: {
        userId,
        plan: planKey,
        status: 'ACTIVE',
        policy: policy ?? undefined,
        renewAt,
        provider: 'stripe',
      },
    });
    return { id: sub.id, plan: sub.plan, status: sub.status };
  }
}

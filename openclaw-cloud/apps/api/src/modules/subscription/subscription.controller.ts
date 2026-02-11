import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('v1/subscription')
export class SubscriptionController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async get(@Query('userId') userId: string) {
    if (!userId) return { error: 'userId required' };
    const sub = await this.prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { renewAt: 'desc' },
    });
    if (!sub) return { subscription: null };
    return {
      subscription: {
        id: sub.id,
        plan: sub.plan,
        status: sub.status,
        renewAt: sub.renewAt,
        policy: sub.policy,
      },
    };
  }

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

  @Post('from-stripe')
  async fromStripe(
    @Body() body: { userId: string; plan: string; stripeSessionId?: string },
    @Req() req: Request & { headers: { 'x-internal-secret'?: string } },
  ) {
    const secret = process.env.INTERNAL_API_SECRET;
    if (secret && req.headers['x-internal-secret'] !== secret) {
      return { error: 'Forbidden' };
    }
    const { userId, plan: planKey } = body;
    if (!userId || !planKey) {
      return { error: 'userId and plan required' };
    }
    const validPlan = ['starter_20', 'pro_40', 'max_200'].includes(planKey.toLowerCase())
      ? planKey.toLowerCase()
      : planKey;
    const renewAt = new Date();
    renewAt.setMonth(renewAt.getMonth() + 1);
    const sub = await this.prisma.subscription.create({
      data: {
        userId,
        plan: validPlan,
        status: 'ACTIVE',
        renewAt,
        provider: 'stripe',
      },
    });
    return { id: sub.id, plan: sub.plan, status: sub.status };
  }
}

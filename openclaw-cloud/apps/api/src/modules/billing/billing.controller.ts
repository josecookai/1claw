import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('v1/billing')
export class BillingController {
  constructor(private billing: BillingService) {}

  @Post('checkout/subscription')
  @UseGuards(JwtAuthGuard)
  async checkoutSubscription(
    @Req() req: Request & { userId?: string },
    @Body() body: { plan: 'starter' | 'pro' },
  ) {
    const userId = req.userId;
    if (!userId) throw new Error('No userId');
    const plan = body.plan === 'pro' ? 'pro' : 'starter';
    return this.billing.createSubscriptionCheckout(userId, plan);
  }

  @Post('checkout/topup')
  @UseGuards(JwtAuthGuard)
  async checkoutTopup(
    @Req() req: Request & { userId?: string },
    @Body() body: { pack: 'topup10' | 'topup50' },
  ) {
    const userId = req.userId;
    if (!userId) throw new Error('No userId');
    const pack = body.pack === 'topup50' ? 'topup50' : 'topup10';
    return this.billing.createTopupCheckout(userId, pack);
  }

  @Post('portal')
  @UseGuards(JwtAuthGuard)
  async portal(@Req() req: Request & { userId?: string }) {
    const userId = req.userId;
    if (!userId) throw new Error('No userId');
    return this.billing.createPortalSession(userId);
  }
}

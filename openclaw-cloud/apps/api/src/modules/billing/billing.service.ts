import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma.service';
import type { PlanId } from 'shared';

 type PlanKey = 'starter' | 'pro';
 type PackKey = 'topup10' | 'topup50';

const PLAN_TO_PRICE_ENV: Record<PlanKey, string> = {
  starter: 'STRIPE_PRICE_STARTER_MONTHLY',
  pro: 'STRIPE_PRICE_PRO_MONTHLY',
};

const PLAN_TO_PLAN_ID: Record<PlanKey, PlanId> = {
  starter: 'starter_20',
  pro: 'max_200',
};

const PACK_TO_PRICE_ENV: Record<PackKey, string> = {
  topup10: 'STRIPE_PRICE_TOPUP_10',
  topup50: 'STRIPE_PRICE_TOPUP_50',
};

const PACK_CREDITS: Record<PackKey, number> = {
  topup10: 2000,
  topup50: 12000,
};

const PACK_TO_ID: Record<PackKey, string> = {
  topup10: 'pack_10',
  topup50: 'pack_50',
};

@Injectable()
export class BillingService {
  private stripe: Stripe | null = null;

  constructor(private prisma: PrismaService) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key) this.stripe = new Stripe(key);
  }

  private getStripe(): Stripe {
    if (!this.stripe) throw new Error('Stripe not configured (STRIPE_SECRET_KEY)');
    return this.stripe;
  }

  private getBaseUrl(): string {
    return process.env.WEB_APP_URL ?? 'http://localhost:3002';
  }

  async getOrCreateStripeCustomer(userId: string): Promise<string> {
    const existing = await this.prisma.stripeCustomer.findUnique({
      where: { userId },
    });
    if (existing) return existing.customerId;

    const stripe = this.getStripe();
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId },
    });

    await this.prisma.stripeCustomer.create({
      data: { userId, customerId: customer.id },
    });
    return customer.id;
  }

  async createSubscriptionCheckout(userId: string, plan: PlanKey): Promise<{ url: string }> {
    const stripe = this.getStripe();
    const priceId = process.env[PLAN_TO_PRICE_ENV[plan]];
    if (!priceId) throw new Error(`Price not configured for plan: ${plan}`);

    const customerId = await this.getOrCreateStripeCustomer(userId);
    const planId = PLAN_TO_PLAN_ID[plan];
    const baseUrl = this.getBaseUrl();

    const credits = planId === 'max_200' ? 50000 : 4000;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/usage?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?checkout=cancelled&session_id={CHECKOUT_SESSION_ID}`,
      metadata: { userId, kind: 'sub', plan: planId, credits: String(credits) },
      subscription_data: {
        metadata: { userId, plan: planId },
      },
    });

    if (!session.url) throw new Error('Failed to create checkout session');
    return { url: session.url };
  }

  async createTopupCheckout(userId: string, pack: PackKey): Promise<{ url: string }> {
    const stripe = this.getStripe();
    const priceId = process.env[PACK_TO_PRICE_ENV[pack]];
    if (!priceId) throw new Error(`Price not configured for pack: ${pack}`);

    const customerId = await this.getOrCreateStripeCustomer(userId);
    const credits = PACK_CREDITS[pack];
    const packId = PACK_TO_ID[pack];
    const baseUrl = this.getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/usage?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/topup?cancelled=1&session_id={CHECKOUT_SESSION_ID}`,
      metadata: { userId, kind: 'topup', pack: packId, credits: String(credits) },
      payment_intent_data: {
        metadata: { userId, pack: packId, credits: String(credits) },
      },
    });

    if (!session.url) throw new Error('Failed to create checkout session');
    return { url: session.url };
  }

  async createPortalSession(userId: string): Promise<{ url: string }> {
    const stripe = this.getStripe();
    const customerId = await this.getOrCreateStripeCustomer(userId);
    const baseUrl = this.getBaseUrl();

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/settings`,
    });

    return { url: session.url };
  }
}

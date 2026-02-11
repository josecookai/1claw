import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma.service';
import { CreditsService } from '../billing/credits.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private stripe: Stripe | null = null;

  constructor(
    private prisma: PrismaService,
    private creditsService: CreditsService,
  ) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key) this.stripe = new Stripe(key);
  }

  private getStripe(): Stripe {
    if (!this.stripe) throw new Error('Stripe not configured');
    return this.stripe;
  }

  private async isProcessed(eventId: string): Promise<boolean> {
    const existing = await this.prisma.processedWebhookEvent.findUnique({
      where: { eventId },
    });
    return !!existing;
  }

  private async markProcessed(eventId: string, type: string): Promise<void> {
    await this.prisma.processedWebhookEvent.upsert({
      where: { eventId },
      create: { eventId, type },
      update: {},
    });
  }

  async handleStripe(rawBody: Buffer | string, signature: string): Promise<{ received: boolean } | { error: string }> {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) return { error: 'Webhook secret not configured' };

    let event: Stripe.Event;
    try {
      const payload = typeof rawBody === 'string' ? Buffer.from(rawBody) : rawBody;
      event = this.getStripe().webhooks.constructEvent(payload, signature, secret);
    } catch (err) {
      return { error: `Webhook signature verification failed: ${(err as Error).message}` };
    }

    if (await this.isProcessed(event.id)) {
      this.logger.log({ eventType: event.type, eventId: event.id, result: 'ignored', reason: 'duplicate' });
      return { received: true };
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, event.id);
          break;
        case 'invoice.paid':
          await this.handleInvoicePaid(event.data.object as Stripe.Invoice, event.id);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, event.id);
          break;
        default:
          // ignore other events
          break;
      }
      await this.markProcessed(event.id, event.type);
    } catch (err) {
      console.error(`Webhook ${event.id} (${event.type}) error:`, err);
      throw err; // let Stripe retry
    }

    return { received: true };
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, eventId: string): Promise<void> {
    const userId = session.metadata?.userId as string | undefined;
    if (!userId) {
      this.logger.log({ eventType: 'checkout.session.completed', eventId, result: 'ignored', reason: 'no userId' });
      return;
    }

    if (session.mode === 'subscription' && session.subscription) {
      const sub = await this.getStripe().subscriptions.retrieve(session.subscription as string);
      const plan = (session.metadata?.plan as string) ?? 'starter_20';
      const periodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await this.prisma.subscription.upsert({
        where: { stripeSubscriptionId: sub.id },
        create: {
          userId,
          plan,
          status: 'ACTIVE',
          renewAt: periodEnd,
          currentPeriodEnd: periodEnd,
          stripeSubscriptionId: sub.id,
          provider: 'stripe',
        },
        update: {
          status: 'ACTIVE',
          currentPeriodEnd: periodEnd,
          renewAt: periodEnd,
        },
      });
      this.logger.log({ eventType: 'checkout.session.completed', eventId, userId, kind: 'sub', plan: session.metadata?.plan, result: 'applied' });
    }

    if (session.mode === 'payment') {
      // Top-Up: 只校验，不入账。入账由 payment_intent.succeeded 处理
      this.logger.log({ eventType: 'checkout.session.completed', eventId, userId, kind: 'topup', result: 'ignored', reason: 'credits_in_payment_intent' });
    }
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice, eventId: string): Promise<void> {
    if (!invoice.subscription || !invoice.billing_reason) return;
    const isInitialOrRenewal =
      invoice.billing_reason === 'subscription_create' || invoice.billing_reason === 'subscription_cycle';

    if (!isInitialOrRenewal) return;

    const sub = await this.getStripe().subscriptions.retrieve(invoice.subscription as string);
    const userId = sub.metadata?.userId as string | undefined;
    if (!userId) return;

    const plan = (sub.metadata?.plan as string) ?? 'starter_20';
    const credits = plan === 'max_200' ? 50000 : 4000;
    const { granted, idempotent } = await this.creditsService.grantMonthlyCredits(userId, plan, invoice.id);
    this.logger.log({ eventType: 'invoice.paid', eventId, userId, plan, credits, result: idempotent ? 'ignored' : 'applied', refId: invoice.id });

    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data: { status: 'ACTIVE', currentPeriodEnd: new Date(sub.current_period_end! * 1000) },
    });
  }

  private async handleSubscriptionUpdated(sub: Stripe.Subscription): Promise<void> {
    const userId = sub.metadata?.userId as string | undefined;
    if (!userId) return;

    const periodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;
    const status = sub.cancel_at_period_end ? 'ACTIVE' : sub.status === 'active' ? 'ACTIVE' : sub.status.toUpperCase();

    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data: {
        status,
        currentPeriodEnd: periodEnd,
        renewAt: periodEnd ?? undefined,
      },
    });
  }

  private async handleSubscriptionDeleted(sub: Stripe.Subscription): Promise<void> {
    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data: { status: 'CANCELLED' },
    });
  }

  private async handlePaymentIntentSucceeded(payment: Stripe.PaymentIntent, eventId: string): Promise<void> {
    const userId = payment.metadata?.userId as string | undefined;
    const pack = payment.metadata?.pack as string | undefined;

    if (!userId || !pack) {
      this.logger.log({ eventType: 'payment_intent.succeeded', eventId, pi: payment.id, result: 'ignored', reason: 'no userId or pack' });
      return;
    }

    const { granted, idempotent } = await this.creditsService.topupCredits(userId, pack, payment.id);
    this.logger.log({ eventType: 'payment_intent.succeeded', eventId, pi: payment.id, userId, pack, result: idempotent ? 'ignored' : 'applied', granted });

    if (granted > 0) {
      await this.prisma.topupPurchase.upsert({
        where: { paymentIntentId: payment.id },
        create: { userId, paymentIntentId: payment.id, pack, credits: granted },
        update: {},
      });
    }
  }
}

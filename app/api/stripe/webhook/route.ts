import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const apiBase = process.env.OPENCLAW_API_URL ?? "http://localhost:3001/api";
  const internalSecret = process.env.INTERNAL_API_SECRET;

  if (!secret || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(secret, { apiVersion: "2025-02-24.acacia" });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id ?? session.metadata?.userId;
    const plan = (session.metadata?.plan ?? "pro_40") as string;

    if (!userId) {
      return NextResponse.json({
        received: true,
        skipped: "No userId in client_reference_id or metadata",
      });
    }

    const res = await fetch(`${apiBase}/v1/subscription/from-stripe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(internalSecret && {
          "X-Internal-Secret": internalSecret,
        }),
      },
      body: JSON.stringify({
        userId,
        plan,
        stripeSessionId: session.id,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: "Failed to create subscription", details: err },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PLAN_AMOUNTS: Record<string, number> = {
  starter_20: 2000,
  pro_40: 4000,
  max_200: 200000,
};

const PLAN_NAMES: Record<string, string> = {
  starter_20: "1Claw Starter ($20/mo)",
  pro_40: "1Claw Pro ($40/mo)",
  max_200: "1Claw Max ($200/mo)",
};

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const plan = (body.plan ?? "pro_40") as string;
  const userId = body.userId as string | undefined;
  const amount = PLAN_AMOUNTS[plan] ?? 4000;
  const name = PLAN_NAMES[plan] ?? "1Claw Pro";

  const origin = req.headers.get("origin") ?? req.nextUrl.origin;

  const stripe = new Stripe(secret, { apiVersion: "2025-02-24.acacia" });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "alipay", "wechat_pay"],
    payment_method_options: {
      wechat_pay: { client: "web" },
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name,
            description: "OpenClaw as a Service subscription",
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
    cancel_url: `${origin}/checkout?plan=${plan}&canceled=1`,
    metadata: { plan },
    client_reference_id: userId ?? undefined,
  });

  return NextResponse.json({ url: session.url });
}

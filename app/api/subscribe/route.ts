import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clientIpFromHeaders, rateLimit } from "@/lib/rate-limit";
import { saveWaitlistLead, sendWaitlistConfirmationEmail } from "@/lib/waitlist-store";

const payloadSchema = z.object({
  email: z.string().email(),
  lang: z.enum(["zh", "en"]).default("zh"),
  source: z.string().default("landing_waitlist"),
});

function withCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function POST(req: NextRequest) {
  const ip = clientIpFromHeaders(req.headers);
  const gate = rateLimit(`subscribe:${ip}`, 10, 60_000);
  if (!gate.ok) {
    return withCors(
      NextResponse.json(
        { ok: false, error: "RATE_LIMITED", retryAt: new Date(gate.resetAt).toISOString() },
        { status: 429 }
      )
    );
  }

  try {
    const json = await req.json();
    const parsed = payloadSchema.safeParse(json);
    if (!parsed.success) {
      return withCors(
        NextResponse.json({ ok: false, error: "INVALID_PAYLOAD", details: parsed.error.flatten() }, { status: 400 })
      );
    }

    const lead = {
      email: parsed.data.email,
      lang: parsed.data.lang,
      source: parsed.data.source,
      createdAt: new Date().toISOString(),
    };
    const stored = await saveWaitlistLead(lead);
    if (!stored.ok) {
      return withCors(NextResponse.json({ ok: false, error: "STORE_FAILED", details: stored.details }, { status: 502 }));
    }

    const mail = await sendWaitlistConfirmationEmail(lead.email, lead.lang);
    return withCors(
      NextResponse.json({ ok: true, message: "Subscribed", storage: stored.mode, email: mail.mode }, { status: 202 })
    );
  } catch {
    return withCors(NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 }));
  }
}

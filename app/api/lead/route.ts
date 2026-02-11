import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clientIpFromHeaders, rateLimit } from "@/lib/rate-limit";

const leadSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120).optional(),
  selection: z.object({
    models: z.array(z.string()),
    channels: z.array(z.string()),
    plan: z.string(),
    lang: z.string(),
  }),
  intent: z.enum(["waitlist", "sales"]),
});

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: NextRequest) {
  const ip = clientIpFromHeaders(req.headers);
  const gate = rateLimit(`lead:${ip}`, 20, 60_000);
  if (!gate.ok) {
    return NextResponse.json(
      { ok: false, error: "RATE_LIMITED", retryAt: new Date(gate.resetAt).toISOString() },
      { status: 429, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  try {
    const payload = await req.json();
    const parsed = leadSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const apiBase = process.env.OPENCLAW_API_URL;
    if (apiBase) {
      const res = await fetch(`${apiBase}/v1/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          source: (payload as { source?: string }).source ?? "landing_v1",
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json(
          { ok: false, error: "Failed to persist lead", details: err },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Lead accepted for MVP processing.",
      },
      { status: 202, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Request body must be JSON",
      },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }
}

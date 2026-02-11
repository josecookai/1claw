import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

export async function POST(req: NextRequest) {
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

    return NextResponse.json(
      {
        ok: true,
        message: "Lead accepted for MVP processing.",
      },
      { status: 202 },
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Request body must be JSON",
      },
      { status: 400 },
    );
  }
}

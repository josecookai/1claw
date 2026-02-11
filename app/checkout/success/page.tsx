"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const OPENCLAW_URL = process.env.NEXT_PUBLIC_OPENCLAW_URL ?? "http://localhost:3002";

function SuccessContent() {
  const params = useSearchParams();
  const plan = params.get("plan") ?? "pro_40";
  const sessionId = params.get("session_id");

  return (
    <main className="mx-auto max-w-md px-6 py-12 text-center">
      <div className="rounded-full bg-green-100 p-4 mx-auto w-16 h-16 flex items-center justify-center">
        <span className="text-3xl">✓</span>
      </div>
      <h1 className="mt-6 text-2xl font-semibold">Payment successful</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Thanks for subscribing to 1Claw {plan.replace("_", " ")}.
      </p>
      {sessionId && (
        <p className="mt-2 text-xs text-[var(--muted)] font-mono">
          Session: {sessionId.slice(0, 20)}...
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href={`${OPENCLAW_URL}/console`}
          className="inline-block rounded-lg bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white"
        >
          Open Console
        </a>
        <a
          href={`${OPENCLAW_URL}/login`}
          className="inline-block rounded-lg border border-[var(--line)] px-6 py-3 text-sm font-semibold"
        >
          Sign in
        </a>
        <Link
          href="/"
          className="inline-block rounded-lg border border-[var(--line)] px-6 py-3 text-sm font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <main className="mx-auto max-w-md px-6 py-12 text-center">
        <p className="text-sm text-[var(--muted)]">Loading...</p>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white"
      >
        Back to Home
      </Link>
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

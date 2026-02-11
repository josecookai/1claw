"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const OPENCLAW_URL = process.env.NEXT_PUBLIC_OPENCLAW_URL ?? "http://localhost:3002";

function CheckoutContent() {
  const params = useSearchParams();
  const plan = params.get("plan") ?? "pro_40";
  const userId = params.get("userId") ?? undefined;
  const canceled = params.get("canceled");
  const [error, setError] = useState("");

  useEffect(() => {
    if (canceled) return;
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, userId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError(data.error ?? "Checkout failed");
        }
      })
      .catch(() => {
        setError("Network error");
      });
  }, [plan, userId, canceled]);

  if (canceled) {
    return (
      <main className="mx-auto max-w-md px-6 py-12 text-center">
        <h1 className="text-xl font-semibold">Checkout canceled</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          You can try again when ready.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-[var(--ink)] px-6 py-2 text-sm font-medium text-white"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-md px-6 py-12 text-center">
        <h1 className="text-xl font-semibold">Checkout error</h1>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-[var(--ink)] px-6 py-2 text-sm font-medium text-white"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12 text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--ink)] border-t-transparent" />
      <p className="mt-4 text-sm text-[var(--muted)]">Redirecting to Stripe Checkout...</p>
      <p className="mt-4 text-xs text-[var(--muted)]">
        Have an account?{" "}
        <a
          href={`${OPENCLAW_URL}/login?returnUrl=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "/checkout")}`}
          className="underline hover:text-[var(--ink)]"
        >
          Log in to link payment
        </a>
      </p>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="mx-auto max-w-md px-6 py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--ink)] border-t-transparent" />
        <p className="mt-4 text-sm text-[var(--muted)]">Loading...</p>
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

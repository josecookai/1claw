"use client";

import { useState } from "react";
import { PAYMENT_METHODS, TOPUP_PACKS } from "@/lib/product-pages";

export default function TopupPage() {
  const [pack, setPack] = useState<(typeof TOPUP_PACKS)[number]["id"]>("pack_10");
  const [method, setMethod] = useState("Card");
  const [state, setState] = useState<"idle" | "success" | "failure">("idle");

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-8 sm:px-10">
      <h1 className="text-2xl font-semibold tracking-tight">Top-up</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Add credits instantly when usage grows.</p>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">Packs</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {TOPUP_PACKS.map((p) => (
            <button key={p.id} type="button" onClick={() => setPack(p.id)} className={`rounded-xl border p-4 text-left ${pack === p.id ? "border-[var(--ink)] bg-[var(--focus)]" : "border-[var(--line)] bg-white"}`}>
              <p className="font-semibold">{p.price}</p>
              <p className="text-xs text-[var(--muted)]">{p.credits.toLocaleString()} credits</p>
            </button>
          ))}
        </div>

        <h2 className="mt-6 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">Payment method</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button key={m} type="button" onClick={() => setMethod(m)} className={`rounded-full border px-3 py-1.5 text-xs ${method === m ? "border-[var(--ink)] bg-[var(--focus)]" : "border-[var(--line)] bg-white"}`}>
              {m}
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <button type="button" className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white" onClick={() => setState("success")}>Simulate success</button>
          <button type="button" className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em]" onClick={() => setState("failure")}>Simulate failure</button>
        </div>

        {state === "success" ? <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">Top-up successful. Credits will refresh in chat.</div> : null}
        {state === "failure" ? <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-900">Payment failed. Please retry or switch payment method.</div> : null}
      </section>
    </main>
  );
}

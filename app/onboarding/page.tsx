"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PREFERENCES, PreferenceKey, PRICING_PLANS, PlanId, saveSelection } from "@/lib/product-pages";

export default function OnboardingPage() {
  const router = useRouter();
  const queryPlan = typeof window !== "undefined" ? (new URLSearchParams(window.location.search).get("plan") as PlanId | null) : null;

  const [step, setStep] = useState<1 | 2>(1);
  const [plan, setPlan] = useState<PlanId>(queryPlan ?? "starter_20");
  const [preference, setPreference] = useState<PreferenceKey>("AUTO");

  const mappedPolicy = useMemo(() => PREFERENCES.find((p) => p.key === preference)?.policy ?? "BEST", [preference]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-8 sm:px-10">
      <Link href="/" className="text-sm text-[var(--muted)] hover:underline">← Back</Link>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Onboarding</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">2-step setup. No channel setup required.</p>

      <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.08em]">
        <span className={`rounded-full border px-3 py-1 ${step === 1 ? "border-[var(--ink)] bg-[var(--focus)]" : "border-[var(--line)] bg-white text-[var(--muted)]"}`}>Pick Plan</span>
        <span className={`rounded-full border px-3 py-1 ${step === 2 ? "border-[var(--ink)] bg-[var(--focus)]" : "border-[var(--line)] bg-white text-[var(--muted)]"}`}>Pick Preference</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          {step === 1 ? (
            <>
              <h2 className="text-lg font-semibold">Step 1: Select plan</h2>
              <div className="mt-4 grid gap-2">
                {PRICING_PLANS.map((p) => (
                  <button key={p.id} type="button" onClick={() => setPlan(p.id)} className={`rounded-xl border p-4 text-left ${plan === p.id ? "border-[var(--ink)] bg-[var(--focus)]" : "border-[var(--line)] bg-white"}`}>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{p.name}</p>
                      <p className="font-mono text-sm font-semibold">{p.price}</p>
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted)]">{p.credits.toLocaleString()} credits · Concurrency {p.concurrency}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">Step 2: Select preference</h2>
              <div className="mt-4 grid gap-2">
                {PREFERENCES.map((p) => (
                  <button key={p.key} type="button" onClick={() => setPreference(p.key)} className={`rounded-xl border p-4 text-left ${preference === p.key ? "border-[var(--ink)] bg-[var(--focus)]" : "border-[var(--line)] bg-white"}`}>
                    <p className="font-semibold">{p.title}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{p.desc}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="mt-6 flex gap-2">
            {step === 2 ? (
              <button type="button" onClick={() => setStep(1)} className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em]">Previous</button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (step === 1) {
                  setStep(2);
                } else {
                  saveSelection({ plan, preference: mappedPolicy });
                  router.push("/chat");
                }
              }}
              className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white"
            >
              {step === 1 ? "Next" : "Enter chat"}
            </button>
          </div>
        </section>

        <aside className="rounded-2xl border border-[var(--line)] bg-white p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">After setup</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>1. Enter chat instantly</li>
            <li>2. Send first message</li>
            <li>3. Check usage anytime</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}

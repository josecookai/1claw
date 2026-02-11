'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PlanId } from 'shared';
import { loadSelection, saveSelection } from '@/lib/product';
import { MiniChecklist } from '@/components/onboarding/MiniChecklist';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { PREFERENCES, PreferenceKey, PreferenceSelector } from '@/components/onboarding/PreferenceSelector';
import { PlanSelector } from '@/components/onboarding/PlanSelector';

export default function OnboardingPage() {
  const router = useRouter();

  const initial = loadSelection();
  const queryPlan =
    typeof window !== 'undefined'
      ? (new URLSearchParams(window.location.search).get('plan') as PlanId | null)
      : null;
  const [step, setStep] = useState<1 | 2>(1);
  const [plan, setPlan] = useState<PlanId>(queryPlan ?? initial.plan);
  const [preference, setPreference] = useState<PreferenceKey>('AUTO');

  const mappedPolicy = useMemo(() => PREFERENCES.find((p) => p.key === preference)?.policy ?? 'BEST', [preference]);

  const next = () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    saveSelection({ plan, preference: mappedPolicy });
    router.push('/chat');
  };

  const prev = () => {
    if (step === 2) setStep(1);
  };

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-8 sm:px-10">
      <Link href="/" className="text-sm text-[var(--ink-muted)] hover:underline">
        ← Back
      </Link>

      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Onboarding</h1>
      <p className="mt-2 text-sm text-[var(--ink-muted)]">2-step setup. No channel setup required.</p>

      <div className="mt-6">
        <OnboardingStepper step={step} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          {step === 1 ? (
            <div>
              <h2 className="text-lg font-semibold">Step 1: Select plan</h2>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">Pick starter or pro tier first.</p>
              <div className="mt-4">
                <PlanSelector selected={plan} onSelect={setPlan} />
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold">Step 2: Select preference</h2>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">This controls routing behavior, not model brand.</p>
              <div className="mt-4">
                <PreferenceSelector selected={preference} onSelect={setPreference} />
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-2">
            {step > 1 ? (
              <button type="button" onClick={prev} className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em]">
                Previous
              </button>
            ) : null}
            <button type="button" onClick={next} className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white">
              {step === 1 ? 'Next' : 'Enter chat'}
            </button>
          </div>
        </section>

        <MiniChecklist />
      </div>
    </main>
  );
}

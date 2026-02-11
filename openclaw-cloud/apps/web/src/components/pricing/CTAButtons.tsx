'use client';

import { useState } from 'react';
import { createSubscriptionCheckout, isLoggedIn } from '@/lib/billing';

export function CTAButtons() {
  const [loading, setLoading] = useState<'starter' | 'pro' | null>(null);
  const [error, setError] = useState('');

  async function handlePlan(plan: 'starter' | 'pro') {
    if (!isLoggedIn()) {
      window.location.href = plan === 'starter' ? '/onboarding?plan=starter_20' : '/onboarding?plan=max_200';
      return;
    }
    setError('');
    setLoading(plan);
    try {
      const { url } = await createSubscriptionCheckout(plan);
      window.location.href = url;
    } catch (e) {
      setError((e as Error).message);
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => handlePlan('starter')}
        disabled={!!loading}
        className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white disabled:opacity-50"
      >
        {loading === 'starter' ? '...' : 'Start $20'}
      </button>
      <button
        type="button"
        onClick={() => handlePlan('pro')}
        disabled={!!loading}
        className="rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] disabled:opacity-50"
      >
        {loading === 'pro' ? '...' : 'Go Pro $200'}
      </button>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </div>
  );
}

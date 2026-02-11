'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createPortalSession, isLoggedIn } from '@/lib/billing';
import { loadSelection } from '@/lib/product';

export default function SettingsPage() {
  const selection = loadSelection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleManageBilling() {
    if (!isLoggedIn()) {
      window.location.href = '/login?returnUrl=/settings';
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { url } = await createPortalSession();
      window.location.href = url;
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-8 sm:px-10">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-2 text-sm text-[var(--ink-muted)]">Manage plan and product preferences.</p>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="text-base font-semibold">Plan</h2>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">Current plan: {selection.plan === 'max_200' ? 'Pro' : 'Starter'}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/pricing"
            className="inline-block rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white"
          >
            Upgrade
          </Link>
          <button
            type="button"
            onClick={handleManageBilling}
            disabled={loading}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] disabled:opacity-50"
          >
            {loading ? '...' : 'Manage Billing'}
          </button>
        </div>
        {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="text-base font-semibold">Connectors</h2>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">Connector settings are managed separately.</p>
        <Link href="/settings/connectors" className="mt-3 inline-block text-sm text-[var(--accent)] underline">
          Open connectors
        </Link>
      </section>
    </main>
  );
}

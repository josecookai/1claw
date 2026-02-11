'use client';

import { useState } from 'react';
import { createTopupCheckout, isLoggedIn } from '@/lib/billing';
import { TOPUP_PACKS } from '@/lib/product';

export function TopupTeaser() {
  const [loading, setLoading] = useState<'topup10' | 'topup50' | null>(null);
  const [error, setError] = useState('');

  async function handleTopup(pack: 'topup10' | 'topup50') {
    if (!isLoggedIn()) {
      window.location.href = '/login?returnUrl=/topup';
      return;
    }
    setError('');
    setLoading(pack);
    try {
      const { url } = await createTopupCheckout(pack);
      window.location.href = url;
    } catch (e) {
      setError((e as Error).message);
      setLoading(null);
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--focus)] p-5">
      <h3 className="text-base font-semibold">Top-up when needed</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
        Credits running low will not freeze your workflow. You can top up instantly and continue from the same session.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {TOPUP_PACKS.map((p) => {
          const packKey = p.id === 'pack_10' ? 'topup10' : 'topup50';
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleTopup(packKey)}
              disabled={!!loading}
              className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] disabled:opacity-50"
            >
              {loading === packKey ? '...' : `${p.price} — ${p.credits.toLocaleString()} credits`}
            </button>
          );
        })}
      </div>
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
    </section>
  );
}

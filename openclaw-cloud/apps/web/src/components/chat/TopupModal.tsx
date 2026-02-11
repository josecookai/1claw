'use client';

import { useState } from 'react';
import { createTopupCheckout, isLoggedIn } from '@/lib/billing';
import { TOPUP_PACKS } from '@/lib/product';

type Props = {
  open: boolean;
  onClose: () => void;
  onApplied: (credits: number) => void;
};

export function TopupModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState<'topup10' | 'topup50' | null>(null);
  const [error, setError] = useState('');

  if (!open) return null;

  async function handlePack(pack: 'topup10' | 'topup50') {
    if (!isLoggedIn()) {
      window.location.href = '/login?returnUrl=/chat';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold">Top-up credits</h3>
        <p className="mt-1 text-xs text-[var(--ink-muted)]">Select a pack to proceed to Stripe Checkout.</p>

        <div className="mt-4 grid gap-2">
          {TOPUP_PACKS.map((p) => {
            const packKey = p.id === 'pack_10' ? 'topup10' : 'topup50';
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePack(packKey)}
                disabled={!!loading}
                className="rounded-xl border border-[var(--line)] px-3 py-2 text-left text-sm hover:border-[var(--accent)] disabled:opacity-50"
              >
                <p className="font-semibold">{p.price}</p>
                <p className="text-xs text-[var(--ink-muted)]">{p.credits.toLocaleString()} credits</p>
                {loading === packKey ? <span className="mt-1 block text-xs">Redirecting...</span> : null}
              </button>
            );
          })}
        </div>

        {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full border border-[var(--line)] px-4 py-2 text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

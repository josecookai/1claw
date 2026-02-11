'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createTopupCheckout, isLoggedIn } from '@/lib/billing';
import { TOPUP_PACKS } from '@/lib/product';

export default function TopupPage() {
  const router = useRouter();
  const [pack, setPack] = useState<'topup10' | 'topup50'>('topup10');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login?returnUrl=/topup');
    }
  }, [router]);

  async function handleCheckout() {
    setError('');
    setLoading(true);
    try {
      const { url } = await createTopupCheckout(pack);
      window.location.href = url;
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-8 sm:px-10">
      <h1 className="text-2xl font-semibold tracking-tight">Top-up</h1>
      <p className="mt-2 text-sm text-[var(--ink-muted)]">Add credits instantly when usage grows.</p>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Packs</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {TOPUP_PACKS.map((p) => {
            const packKey = p.id === 'pack_10' ? 'topup10' : 'topup50';
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPack(packKey)}
                className={`rounded-xl border p-4 text-left ${pack === packKey ? 'border-[var(--accent)] bg-[var(--focus)]' : 'border-[var(--line)] bg-white'}`}
              >
                <p className="font-semibold">{p.price}</p>
                <p className="text-xs text-[var(--ink-muted)]">{p.credits.toLocaleString()} credits</p>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="mt-6 w-full rounded-full bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white disabled:opacity-50"
        >
          {loading ? 'Redirecting...' : 'Proceed to Stripe Checkout'}
        </button>

        {error ? (
          <p className="mt-4 text-xs text-rose-600">{error}</p>
        ) : null}
      </section>
    </main>
  );
}

'use client';

import { loadSelection } from '@/lib/product';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

type BalanceData = { balance: number; plan: string; mode: string; queued?: boolean };
type UsageToday = { day: string; usedCredits: number; balance: number };
type UsageHistoryItem = { day: string; usedCredits: number };

function UsageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paid = searchParams.get('paid') === '1';
  const selection = loadSelection();
  const planLabel = selection.plan === 'max_200' ? 'Pro' : 'Starter';

  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [usageToday, setUsageToday] = useState<UsageToday | null>(null);
  const [history, setHistory] = useState<UsageHistoryItem[]>([]);
  const [creditsPending, setCreditsPending] = useState(paid);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const [balRes, todayRes, histRes] = await Promise.all([
        fetch(`${API_BASE}/v1/credits/balance`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/v1/usage/today`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/v1/usage/history?range=7d`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (balRes.ok) {
        const data = await balRes.json();
        setBalance(data);
        if (paid && data.balance > 0) setCreditsPending(false);
      }
      if (todayRes.ok) setUsageToday(await todayRes.json());
      if (histRes.ok) setHistory(await histRes.json());
    } catch {
      setCreditsPending(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!paid || !creditsPending || retryCount >= 3) return;
    const t = setTimeout(() => {
      setRetryCount((c) => c + 1);
      fetchData();
    }, 2000);
    return () => clearTimeout(t);
  }, [paid, creditsPending, retryCount]);

  useEffect(() => {
    if (retryCount >= 3) setCreditsPending(false);
  }, [retryCount]);

  const usedToday = usageToday?.usedCredits ?? 0;
  const bal = balance?.balance ?? usageToday?.balance ?? 0;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-8 sm:px-10">
      <h1 className="text-2xl font-semibold tracking-tight">Usage</h1>
      <p className="mt-2 text-sm text-[var(--ink-muted)]">Today and historical credits usage.</p>

      {paid && creditsPending && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          正在入账… {retryCount > 0 && `(重试 ${retryCount}/3)`}
        </div>
      )}

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--line)] bg-white p-4">
          <p className="text-xs text-[var(--ink-muted)]">Today</p>
          <p className="mt-1 text-2xl font-semibold">{typeof usedToday === 'number' ? usedToday : '—'}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white p-4">
          <p className="text-xs text-[var(--ink-muted)]">Balance</p>
          <p className="mt-1 text-2xl font-semibold">{typeof bal === 'number' ? bal : '—'}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white p-4">
          <p className="text-xs text-[var(--ink-muted)]">Plan / Mode</p>
          <p className="mt-1 text-2xl font-semibold">{balance?.plan ?? planLabel} / {balance?.mode ?? '—'}</p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="text-base font-semibold">Last 7 days</h2>
        <ul className="mt-3 grid gap-1 sm:grid-cols-2">
          {history.length > 0 ? (
            history.map((item) => (
              <li key={item.day} className="flex items-center justify-between rounded border border-[var(--line)] px-3 py-2 text-sm">
                <span>{item.day}</span>
                <span>{item.usedCredits} credits</span>
              </li>
            ))
          ) : (
            <li className="py-2 text-sm text-[var(--ink-muted)]">Loading…</li>
          )}
        </ul>
      </section>
    </main>
  );
}

export default function UsagePage() {
  return (
    <Suspense fallback={<main className="mx-auto min-h-screen max-w-5xl px-6 py-8"><p>Loading…</p></main>}>
      <UsageContent />
    </Suspense>
  );
}

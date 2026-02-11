'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export default function ConsolePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [usage, setUsage] = useState<{ today: { tokens: number }; recent: Array<{ day: string; tokens: number }> } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token) {
      router.replace('/login');
      return;
    }
    if (userId) {
      fetch(`${API_BASE}/v1/usage?userId=${userId}`)
        .then((r) => r.json())
        .then(setUsage)
        .catch(() => {});
    }
  }, [mounted, router]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-[var(--ink-muted)] hover:underline">
          ← 返回
        </Link>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            router.replace('/login');
          }}
          className="text-sm text-[var(--ink-muted)] hover:underline"
        >
          退出
        </button>
      </div>
      <h1 className="mt-6 text-2xl font-bold">Console</h1>
      <p className="mt-2 text-sm text-[var(--ink-muted)]">订阅与实例管理</p>

      <div className="mt-8 space-y-6">
        <section className="rounded-xl border border-[var(--line)] p-6">
          <h2 className="font-semibold">订阅状态</h2>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">占位：订阅信息将在此显示</p>
        </section>

        <section className="rounded-xl border border-[var(--line)] p-6">
          <h2 className="font-semibold">Usage 今日额度</h2>
          {usage ? (
            <p className="mt-2 text-sm">
              今日已用 <strong>{usage.today.tokens}</strong> tokens
            </p>
          ) : (
            <p className="mt-2 text-sm text-[var(--ink-muted)]">加载中...</p>
          )}
        </section>

        <section className="rounded-xl border border-[var(--line)] p-6">
          <h2 className="font-semibold">实例状态</h2>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">占位：实例列表将在此显示</p>
        </section>
      </div>
    </main>
  );
}

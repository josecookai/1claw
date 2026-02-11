'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export default function ConsolePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [usage, setUsage] = useState<{ today: { tokens: number }; recent: Array<{ day: string; tokens: number }> } | null>(null);
  const [subscription, setSubscription] = useState<{
    subscription: { id: string; plan: string; status: string; renewAt: string; policy?: string } | null;
  } | null>(null);
  const [instances, setInstances] = useState<{
    instances: Array<{ id: string; status: string; region: string; createdAt: string }>;
  } | null>(null);

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
      fetch(`${API_BASE}/v1/subscription?userId=${userId}`)
        .then((r) => r.json())
        .then(setSubscription)
        .catch(() => {});
      fetch(`${API_BASE}/v1/instances?userId=${userId}`)
        .then((r) => r.json())
        .then(setInstances)
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
          {subscription ? (
            subscription.subscription ? (
              <div className="mt-2 text-sm">
                <p>套餐: <strong>{subscription.subscription.plan}</strong></p>
                <p className="mt-1 text-[var(--ink-muted)]">状态: {subscription.subscription.status}</p>
                <p className="mt-1 text-[var(--ink-muted)]">续期: {new Date(subscription.subscription.renewAt).toLocaleDateString()}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-[var(--ink-muted)]">暂无活跃订阅</p>
            )
          ) : (
            <p className="mt-2 text-sm text-[var(--ink-muted)]">加载中...</p>
          )}
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
          {instances ? (
            instances.instances?.length > 0 ? (
              <ul className="mt-2 space-y-2 text-sm">
                {instances.instances.map((i) => (
                  <li key={i.id} className="flex items-center justify-between rounded border border-[var(--line)] px-3 py-2">
                    <span className="font-mono text-xs">{i.id.slice(0, 8)}...</span>
                    <span>{i.status}</span>
                    <span className="text-[var(--ink-muted)]">{i.region}</span>
                    {i.status !== 'STOPPED' && (
                      <button
                        type="button"
                        onClick={() => {
                          const uid = localStorage.getItem('userId');
                          fetch(`${API_BASE}/v1/instances/${i.id}/stop`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: uid }),
                          }).then(() => {
                            fetch(`${API_BASE}/v1/instances?userId=${uid}`)
                              .then((r) => r.json())
                              .then(setInstances);
                          });
                        }}
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        停止
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-[var(--ink-muted)]">暂无实例</p>
            )
          ) : (
            <p className="mt-2 text-sm text-[var(--ink-muted)]">加载中...</p>
          )}
        </section>
      </div>
    </main>
  );
}

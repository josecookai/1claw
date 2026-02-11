'use client';

import Link from 'next/link';

export default function ConsolePage() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← 返回
      </Link>
      <h1 className="mt-6 text-2xl font-bold">Console</h1>
      <p className="mt-2 text-muted-foreground">订阅与实例管理</p>

      <div className="mt-8 space-y-6">
        <section className="rounded-xl border p-6">
          <h2 className="font-semibold">订阅状态</h2>
          <p className="mt-2 text-sm text-muted-foreground">占位：订阅信息将在此显示</p>
        </section>

        <section className="rounded-xl border p-6">
          <h2 className="font-semibold">实例状态</h2>
          <p className="mt-2 text-sm text-muted-foreground">占位：实例列表将在此显示</p>
        </section>
      </div>
    </main>
  );
}

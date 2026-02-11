"use client";

import { loadSelection } from "@/lib/product-pages";

const WEEK = [
  { day: "Mon", credits: 420 },
  { day: "Tue", credits: 510 },
  { day: "Wed", credits: 390 },
  { day: "Thu", credits: 610 },
  { day: "Fri", credits: 740 },
  { day: "Sat", credits: 320 },
  { day: "Sun", credits: 450 },
];

const MONTH = [
  { label: "Week 1", credits: 2200 },
  { label: "Week 2", credits: 2800 },
  { label: "Week 3", credits: 2400 },
  { label: "Week 4", credits: 3100 },
];

export default function UsagePage() {
  const s = loadSelection();
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-8 sm:px-10">
      <h1 className="text-2xl font-semibold tracking-tight">Usage</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Today and historical credits usage.</p>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--line)] bg-white p-4"><p className="text-xs text-[var(--muted)]">Today</p><p className="mt-1 text-2xl font-semibold">640</p></div>
        <div className="rounded-xl border border-[var(--line)] bg-white p-4"><p className="text-xs text-[var(--muted)]">Current Plan</p><p className="mt-1 text-2xl font-semibold">{s.plan === "max_200" ? "Pro" : "Starter"}</p></div>
        <div className="rounded-xl border border-[var(--line)] bg-white p-4"><p className="text-xs text-[var(--muted)]">Mode</p><p className="mt-1 text-2xl font-semibold">{s.preference}</p></div>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="text-base font-semibold">Last 7 days</h2>
        <ul className="mt-3 grid gap-1 sm:grid-cols-2">{WEEK.map((x) => <li key={x.day} className="flex items-center justify-between rounded border border-[var(--line)] px-3 py-2 text-sm"><span>{x.day}</span><span>{x.credits} credits</span></li>)}</ul>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="text-base font-semibold">Last 30 days</h2>
        <ul className="mt-3 space-y-1">{MONTH.map((x) => <li key={x.label} className="flex items-center justify-between rounded border border-[var(--line)] px-3 py-2 text-sm"><span>{x.label}</span><span>{x.credits} credits</span></li>)}</ul>
      </section>
    </main>
  );
}

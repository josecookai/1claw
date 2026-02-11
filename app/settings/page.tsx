"use client";

import Link from "next/link";
import { loadSelection } from "@/lib/product-pages";

export default function SettingsPage() {
  const s = loadSelection();
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-8 sm:px-10">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Manage plan and product preferences.</p>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="text-base font-semibold">Plan</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Current plan: {s.plan === "max_200" ? "Pro" : "Starter"}</p>
        <Link href="/pricing" className="mt-3 inline-block rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white">Upgrade</Link>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="text-base font-semibold">Connectors</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Connector settings are managed separately.</p>
        <Link href="/settings/connectors" className="mt-3 inline-block text-sm text-[var(--ink)] underline">Open connectors</Link>
      </section>
    </main>
  );
}

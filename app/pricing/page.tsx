import Link from "next/link";
import { PAYMENT_METHODS, PRICING_PLANS } from "@/lib/product-pages";

const FAQS = [
  ["How do credits work?", "Credits are consumed by usage and route level."],
  ["What happens when credits run low?", "The system downgrades gracefully, then queues, then prompts top-up."],
  ["Can I top up anytime?", "Yes, top-up is available from chat and topup pages."],
  ["Will service freeze?", "No hard freeze by design. Fallback remains available."],
  ["What payment methods are supported?", "Card, Alipay, WeChat, and USDC."],
  ["Does availability vary by region?", "Routing and fallback adapt by availability."],
] as const;

export default function PricingPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 sm:px-10">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Pricing</p>
      <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
        Predictable plans. Never freeze under pressure.
      </h1>

      <section className="mt-10 grid gap-3 lg:grid-cols-2">
        {PRICING_PLANS.map((plan, i) => (
          <article key={plan.id} className={`rounded-2xl border p-5 ${i === 1 ? "border-[var(--ink)] bg-[var(--focus)]" : "border-[var(--line)] bg-white"}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="font-mono text-lg font-semibold">{plan.price}</p>
            </div>
            <ul className="mt-4 space-y-1.5 text-sm text-[var(--muted)]">
              <li>Credits: {plan.credits.toLocaleString()}</li>
              <li>Concurrency: {plan.concurrency}</li>
              <li>Context: {plan.context}</li>
              <li>{plan.fallback}</li>
              <li>{plan.priority}</li>
              {plan.forceMode ? <li>Force: {plan.forceMode}</li> : null}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-6 flex flex-wrap gap-2">
        <Link href="/onboarding?plan=starter_20" className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white">
          Start $20
        </Link>
        <Link href="/onboarding?plan=max_200" className="rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em]">
          Go Pro $200
        </Link>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-5">
        <h3 className="text-base font-semibold">Payment methods</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((m) => (
            <span key={m} className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-medium">{m}</span>
          ))}
        </div>
      </section>

      <section className="mt-8 space-y-2">
        {FAQS.map(([q, a]) => (
          <details key={q} className="rounded-xl border border-[var(--line)] bg-white px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium">{q}</summary>
            <p className="mt-2 text-sm text-[var(--muted)]">{a}</p>
          </details>
        ))}
      </section>
    </main>
  );
}

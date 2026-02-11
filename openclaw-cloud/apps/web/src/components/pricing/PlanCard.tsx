import type { CompactPlan } from '@/lib/product';

type Props = {
  plan: CompactPlan;
  highlighted?: boolean;
};

export function PlanCard({ plan, highlighted = false }: Props) {
  return (
    <article className={`rounded-2xl border p-5 ${highlighted ? 'border-[var(--accent)] bg-[var(--focus)]' : 'border-[var(--line)] bg-white'}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{plan.name}</h3>
        <p className="font-mono text-lg font-semibold">{plan.price}</p>
      </div>
      <ul className="mt-4 space-y-1.5 text-sm text-[var(--ink-muted)]">
        <li>Credits: {plan.credits.toLocaleString()}</li>
        <li>Concurrency: {plan.concurrency}</li>
        <li>Context: {plan.context}</li>
        <li>{plan.fallback}</li>
        <li>{plan.priority}</li>
        {plan.forceMode ? <li>Force: {plan.forceMode}</li> : null}
      </ul>
    </article>
  );
}

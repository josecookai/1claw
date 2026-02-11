import type { PlanId } from 'shared';
import { PRICING_PLANS } from '@/lib/product';

type Props = {
  selected: PlanId;
  onSelect: (plan: PlanId) => void;
};

export function PlanSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid gap-2">
      {PRICING_PLANS.map((plan) => (
        <button
          key={plan.id}
          type="button"
          onClick={() => onSelect(plan.id)}
          className={`rounded-xl border p-4 text-left ${selected === plan.id ? 'border-[var(--accent)] bg-[var(--focus)]' : 'border-[var(--line)] bg-white'}`}
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold">{plan.name}</p>
            <p className="font-mono text-sm font-semibold">{plan.price}</p>
          </div>
          <p className="mt-1 text-xs text-[var(--ink-muted)]">{plan.credits.toLocaleString()} credits · Concurrency {plan.concurrency}</p>
        </button>
      ))}
    </div>
  );
}

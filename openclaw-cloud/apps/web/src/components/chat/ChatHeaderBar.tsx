import type { PlanId } from 'shared';

type Props = {
  plan: PlanId;
  mode: string;
  credits: number;
  onTopup: () => void;
};

export function ChatHeaderBar({ plan, mode, credits, onTopup }: Props) {
  return (
    <header className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-xs">
      <span className="rounded-full border border-[var(--line)] px-2 py-1">Plan: {plan === 'max_200' ? 'Pro' : 'Starter'}</span>
      <span className="rounded-full border border-[var(--line)] px-2 py-1">Mode: {mode}</span>
      <span className="rounded-full border border-[var(--line)] px-2 py-1">Credits: {credits.toLocaleString()}</span>
      <button
        type="button"
        className="ml-auto rounded-full bg-[var(--accent)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white"
        onClick={onTopup}
      >
        Top-up
      </button>
    </header>
  );
}

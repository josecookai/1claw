type Props = {
  step: 1 | 2;
};

export function OnboardingStepper({ step }: Props) {
  const items = [
    { id: 1, label: 'Pick Plan' },
    { id: 2, label: 'Pick Preference' },
  ] as const;

  return (
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.08em]">
      {items.map((item) => (
        <div key={item.id} className={`rounded-full border px-3 py-1 ${step === item.id ? 'border-[var(--accent)] bg-[var(--focus)]' : 'border-[var(--line)] bg-white text-[var(--ink-muted)]'}`}>
          {item.label}
        </div>
      ))}
    </div>
  );
}

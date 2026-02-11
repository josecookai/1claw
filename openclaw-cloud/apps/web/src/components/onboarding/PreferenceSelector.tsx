import type { Policy } from 'shared';

export type PreferenceKey = 'AUTO' | 'SAVE' | 'MAX' | 'CN';

export const PREFERENCES: Array<{ key: PreferenceKey; title: string; desc: string; policy: Policy }> = [
  { key: 'AUTO', title: 'AUTO', desc: 'Balanced quality and cost', policy: 'BEST' },
  { key: 'SAVE', title: 'Save money', desc: 'Lower cost preference', policy: 'CHEAP' },
  { key: 'MAX', title: 'Max performance', desc: 'Best quality preference', policy: 'BEST' },
  { key: 'CN', title: 'CN-friendly', desc: 'Regional availability preference', policy: 'CN_OK' },
];

type Props = {
  selected: PreferenceKey;
  onSelect: (value: PreferenceKey) => void;
};

export function PreferenceSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid gap-2">
      {PREFERENCES.map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={() => onSelect(p.key)}
          className={`rounded-xl border p-4 text-left ${selected === p.key ? 'border-[var(--accent)] bg-[var(--focus)]' : 'border-[var(--line)] bg-white'}`}
        >
          <p className="font-semibold">{p.title}</p>
          <p className="mt-1 text-xs text-[var(--ink-muted)]">{p.desc}</p>
        </button>
      ))}
    </div>
  );
}

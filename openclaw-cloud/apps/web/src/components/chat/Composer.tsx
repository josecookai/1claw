type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export function Composer({ value, onChange, onSend, disabled }: Props) {
  return (
    <div className="mt-3 flex gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type message"
        className="flex-1 rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={onSend}
        className="rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white disabled:opacity-60"
      >
        Send
      </button>
    </div>
  );
}

export function MiniChecklist() {
  return (
    <aside className="rounded-2xl border border-[var(--line)] bg-white p-4">
      <p className="text-xs uppercase tracking-[0.1em] text-[var(--ink-muted)]">After setup</p>
      <ul className="mt-3 space-y-2 text-sm">
        <li>1. Enter chat instantly</li>
        <li>2. Send first message</li>
        <li>3. Check usage anytime</li>
      </ul>
    </aside>
  );
}

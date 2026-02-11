export default function ConnectorsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-8 sm:px-10">
      <h1 className="text-2xl font-semibold tracking-tight">Connectors</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Connector management is staged for a later release.</p>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Telegram</p>
            <p className="text-sm text-[var(--muted)]">Coming soon</p>
          </div>
          <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]">Planned</span>
        </div>
      </section>
    </main>
  );
}

export default function VisualPlaceholder() {
  return (
    <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="mb-3 text-sm font-semibold">Product Demo (15s placeholder)</div>
      <div className="relative overflow-hidden rounded-xl border border-black/10 bg-gradient-to-br from-[#f1efe9] to-[#e8e4d8] p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-black/10 bg-white p-3 text-xs">1. Open Web Chat</div>
          <div className="rounded-lg border border-black/10 bg-white p-3 text-xs">2. Ask a task</div>
          <div className="rounded-lg border border-black/10 bg-white p-3 text-xs">3. Auto routing + result</div>
        </div>
        <div className="mt-4 text-xs text-black/60">
          Replace this block with a 15-second real demo GIF before the public campaign.
        </div>
      </div>
    </div>
  );
}

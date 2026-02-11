export function DegradeBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
      Credits are low. Route downgraded automatically to keep replies available.
    </div>
  );
}

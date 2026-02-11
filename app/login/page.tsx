import Link from "next/link";

export default function LoginPlaceholderPage() {
  return (
    <main className="min-h-screen bg-[#f7f6f3] px-6 py-20 text-[#0b0b0b]">
      <div className="mx-auto max-w-xl rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-3 text-sm text-black/70">MVP login entry is ready. Continue to onboarding chat flow.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/onboarding" className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white">
            Continue
          </Link>
          <Link href="/" className="rounded-full border border-black/15 px-5 py-3 text-sm font-medium">
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}

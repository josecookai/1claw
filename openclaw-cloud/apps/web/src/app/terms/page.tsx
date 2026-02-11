import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Terms</h1>
      <p className="mt-4 text-sm text-[var(--ink-muted)]">
        Terms of service placeholder.
      </p>
      <Link href="/login" className="mt-6 inline-block text-sm underline">Back to Login</Link>
    </main>
  );
}

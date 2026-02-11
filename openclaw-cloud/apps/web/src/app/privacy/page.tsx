import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--ink-muted)]">
        OpenClaw Cloud collects account data (email, hashed password), subscription and usage metadata, and Telegram
        bindings. We use this to provide routing, billing, and instance management services.
      </p>
      <p className="mt-4 text-sm leading-7 text-[var(--ink-muted)]">
        Usage and token consumption are logged for billing and quota enforcement. We do not store chat message content
        beyond what is required for provider API calls.
      </p>
      <p className="mt-4 text-sm leading-7 text-[var(--ink-muted)]">
        Payment data is processed by external providers (e.g. Stripe). Please review each provider&apos;s privacy policy
        on their checkout page.
      </p>
      <Link href="/login" className="mt-6 inline-block text-sm underline">Back to Login</Link>
    </main>
  );
}

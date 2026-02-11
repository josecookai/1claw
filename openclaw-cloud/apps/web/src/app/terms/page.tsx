import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Terms of Service</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--ink-muted)]">
        OpenClaw Cloud (1Claw) provides AI agent hosting and routing services. This MVP is for product validation.
        Service availability, channel integrations (Telegram, WeChat, etc.), and model routing are subject to phased rollout.
      </p>
      <p className="mt-4 text-sm leading-7 text-[var(--ink-muted)]">
        By creating an account and using the service, you agree that selected models and channels represent preferences,
        not hard guarantees, and may vary by region and provider status. Refunds follow the payment provider&apos;s terms.
      </p>
      <p className="mt-4 text-sm leading-7 text-[var(--ink-muted)]">
        You are responsible for securing your account credentials and API access. Do not share your bind codes or tokens.
      </p>
      <Link href="/login" className="mt-6 inline-block text-sm underline">Back to Login</Link>
    </main>
  );
}

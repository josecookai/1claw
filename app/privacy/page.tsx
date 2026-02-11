import Link from "next/link";

export const metadata = {
  title: "Privacy | 1Claw",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-6 text-sm leading-7 text-[var(--ink-muted)]">
        1Claw collects only minimal preference metadata during MVP validation, such as selected plans, models,
        channels, and language choices attached to checkout or waitlist links.
      </p>
      <p className="mt-4 text-sm leading-7 text-[var(--ink-muted)]">
        Payment data is processed by external payment providers. Please review each provider&apos;s own privacy policy on
        their checkout page.
      </p>
      <Link href="/" className="mt-8 inline-block rounded-lg border border-[var(--line)] px-4 py-2 text-sm hover:border-[var(--line-strong)]">
        Back to Landing
      </Link>
    </main>
  );
}

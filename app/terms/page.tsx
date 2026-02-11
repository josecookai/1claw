import Link from "next/link";

export const metadata = {
  title: "Terms | 1Claw",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-6 text-sm leading-7 text-[var(--ink-muted)]">
        This MVP landing page is for product validation. Checkout links are external and may have independent provider
        terms. Service availability, channel integrations, and model routing are subject to phased rollout.
      </p>
      <p className="mt-4 text-sm leading-7 text-[var(--ink-muted)]">
        By proceeding to checkout or waitlist, you agree that selected models and channels represent preferences, not
        hard guarantees, and may vary by region and provider status.
      </p>
      <Link href="/" className="mt-8 inline-block rounded-lg border border-[var(--line)] px-4 py-2 text-sm hover:border-[var(--line-strong)]">
        Back to Landing
      </Link>
    </main>
  );
}

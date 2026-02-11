import { CTAButtons } from '@/components/pricing/CTAButtons';
import { FAQAccordion } from '@/components/pricing/FAQAccordion';
import { PaymentMethodsRow } from '@/components/pricing/PaymentMethodsRow';
import { PlanCard } from '@/components/pricing/PlanCard';
import { PlanCompareTable } from '@/components/pricing/PlanCompareTable';
import { PricingHero } from '@/components/pricing/PricingHero';
import { TopupTeaser } from '@/components/pricing/TopupTeaser';
import { PRICING_PLANS } from '@/lib/product';

export default function PricingPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 sm:px-10">
      <PricingHero />

      <section className="mt-10 grid gap-3 lg:grid-cols-2">
        <PlanCard plan={PRICING_PLANS[0]} />
        <PlanCard plan={PRICING_PLANS[1]} highlighted />
      </section>

      <section className="mt-6">
        <CTAButtons />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <PlanCompareTable />
        <TopupTeaser />
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">Payment methods</h2>
        <PaymentMethodsRow />
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold">FAQ</h2>
        <FAQAccordion />
      </section>
    </main>
  );
}

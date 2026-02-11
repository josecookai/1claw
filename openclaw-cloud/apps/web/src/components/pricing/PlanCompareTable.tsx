import { PRICING_PLANS } from '@/lib/product';

export function PlanCompareTable() {
  const [starter, pro] = PRICING_PLANS;

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
      <h3 className="text-base font-semibold">Plan comparison</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] text-[var(--ink-muted)]">
              <th className="py-2 pr-6 font-medium">Feature</th>
              <th className="py-2 pr-6 font-medium">{starter.name}</th>
              <th className="py-2 font-medium">{pro.name}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--line)]">
              <td className="py-2 pr-6">Credits</td>
              <td className="py-2 pr-6">4,000</td>
              <td className="py-2">50,000</td>
            </tr>
            <tr className="border-b border-[var(--line)]">
              <td className="py-2 pr-6">Concurrency</td>
              <td className="py-2 pr-6">1</td>
              <td className="py-2">5</td>
            </tr>
            <tr className="border-b border-[var(--line)]">
              <td className="py-2 pr-6">Context window</td>
              <td className="py-2 pr-6">16K</td>
              <td className="py-2">128K</td>
            </tr>
            <tr className="border-b border-[var(--line)]">
              <td className="py-2 pr-6">Degrade strategy</td>
              <td className="py-2 pr-6">Auto downgrade</td>
              <td className="py-2">Never freeze: downgrade + queue + top-up</td>
            </tr>
            <tr>
              <td className="py-2 pr-6">Performance lock</td>
              <td className="py-2 pr-6">-</td>
              <td className="py-2">Force “Max performance”</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

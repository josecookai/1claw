import { PAYMENT_METHODS } from '@/lib/product';

export function PaymentMethodsRow() {
  return (
    <section className="flex flex-wrap gap-2">
      {PAYMENT_METHODS.map((m) => (
        <span key={m} className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-medium">
          {m}
        </span>
      ))}
    </section>
  );
}

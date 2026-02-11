const FAQS = [
  {
    q: 'How do credits work?',
    a: 'Credits are consumed by usage. Different route quality levels consume at different speeds.',
  },
  {
    q: 'What happens when credits run low?',
    a: 'The system downgrades gracefully first, then queues, and finally prompts top-up without hard stop.',
  },
  {
    q: 'Can I top up anytime?',
    a: 'Yes. Top-up is available any time from chat and billing pages.',
  },
  {
    q: 'Is there forced downtime?',
    a: 'No forced freeze by design. There is always a fallback route with clear status.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'Card, Alipay, WeChat, and USDC are supported.',
  },
  {
    q: 'Does availability vary by region?',
    a: 'The platform handles route and fallback automatically to improve regional availability.',
  },
];

export function FAQAccordion() {
  return (
    <section className="space-y-2">
      {FAQS.map((f) => (
        <details key={f.q} className="rounded-xl border border-[var(--line)] bg-white px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium">{f.q}</summary>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">{f.a}</p>
        </details>
      ))}
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  BRAND_NAME,
  CHANNELS,
  FAQS,
  MODELS,
  OPENCLAW_URL,
  PAIN_POINTS,
  PAYMENT_LINKS,
  PAYMENT_METHODS,
  PLANS,
  SKILLS,
  UI_TEXT,
  VALUE_PROPS,
  WAITLIST_LINK,
  buildQuery,
  t,
  withQuery,
} from "@/lib/content";
import { trackEvent } from "@/lib/tracking";
import { ChannelId, Lang, ModelId, PaymentMethod, PlanId } from "@/lib/types";

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh-CN");
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("pro_40");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("stripe");
  const [selectedModels, setSelectedModels] = useState<ModelId[]>(["chatgpt", "kimi"]);
  const [selectedChannels, setSelectedChannels] = useState<ChannelId[]>(["telegram"]);

  const sharedQuery = useMemo(
    () =>
      buildQuery({
        plan: selectedPlan,
        models: selectedModels,
        channels: selectedChannels,
        lang,
      }),
    [lang, selectedChannels, selectedModels, selectedPlan],
  );

  const checkoutHref = withQuery(PAYMENT_LINKS[selectedPlan][selectedPaymentMethod], sharedQuery);
  const waitlistHref = withQuery(
    WAITLIST_LINK,
    buildQuery({
      plan: selectedPlan,
      models: selectedModels,
      channels: selectedChannels,
      lang,
      intent: "waitlist",
    }),
  );

  const toggleModel = (modelId: ModelId) => {
    setSelectedModels((previous) => {
      const next = previous.includes(modelId)
        ? previous.filter((id) => id !== modelId)
        : [...previous, modelId];
      trackEvent("select_model", { model: modelId, selected_count: next.length });
      return next;
    });
  };

  const toggleChannel = (channelId: ChannelId) => {
    setSelectedChannels((previous) => {
      const next = previous.includes(channelId)
        ? previous.filter((id) => id !== channelId)
        : [...previous, channelId];
      trackEvent("select_channel", { channel: channelId, selected_count: next.length });
      return next;
    });
  };

  const selectPlan = (planId: PlanId) => {
    setSelectedPlan(planId);
    trackEvent("select_plan", { plan: planId });
  };

  const buildPlanCheckoutHref = (planId: PlanId) => {
    const query = buildQuery({ plan: planId, models: selectedModels, channels: selectedChannels, lang });
    return withQuery(PAYMENT_LINKS[planId][selectedPaymentMethod], query);
  };

  const buildSalesHref = (planId: PlanId) => {
    const query = buildQuery({
      plan: planId,
      models: selectedModels,
      channels: selectedChannels,
      lang,
      intent: "sales",
    });
    return withQuery(WAITLIST_LINK, query);
  };

  return (
    <div className="relative bg-[var(--surface)] text-[var(--ink)]">
      <div className="pointer-events-none fixed inset-0 -z-20 bg-fade" />

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-5 sm:px-10 lg:px-14">
        <header className="sticky top-0 z-20 mb-14 flex items-center justify-between bg-[var(--surface)]/96 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <p className="font-display text-2xl font-semibold tracking-tight">{BRAND_NAME}</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">OpenClaw as a Service</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/pricing" className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-medium transition hover:border-[var(--ink)]">
              {lang === "zh-CN" ? "价格" : "Pricing"}
            </a>
            <a href="/onboarding" className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-medium transition hover:border-[var(--ink)]">
              {lang === "zh-CN" ? "开始" : "Start"}
            </a>
            <a
              href={`${OPENCLAW_URL}/login`}
              className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-medium transition hover:border-[var(--ink)]"
            >
              {lang === "zh-CN" ? "登录" : "Sign in"}
            </a>
            <button
              type="button"
              className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-medium transition hover:border-[var(--ink)]"
              onClick={() => setLang((current) => (current === "zh-CN" ? "en" : "zh-CN"))}
            >
              {lang === "zh-CN" ? "EN" : "中文"}
            </button>
          </div>
        </header>

        <section className="space-y-10">
          <div className="space-y-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">MVP Validation Landing</p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl">
              {t(UI_TEXT.heroTitle, lang)}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--muted)]">{t(UI_TEXT.heroSubtitle, lang)}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={checkoutHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[var(--ink)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white"
                onClick={() => trackEvent("click_pay", { plan: selectedPlan, payment_method: selectedPaymentMethod })}
              >
                {t(UI_TEXT.checkout, lang)}
              </a>
              <a
                href={waitlistHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--line)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em]"
                onClick={() => trackEvent("click_waitlist", { plan: selectedPlan, intent: "waitlist" })}
              >
                {t(UI_TEXT.waitlist, lang)}
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((item) => (
              <div key={item.en} className="rounded-xl bg-white px-4 py-3 text-xs font-medium text-[var(--ink)] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                {t(item, lang)}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <h2 className="font-display text-2xl font-semibold tracking-tight">{t(UI_TEXT.builderTitle, lang)}</h2>

            <div className="mt-7 space-y-8">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{t(UI_TEXT.modelTitle, lang)}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {MODELS.map((model) => {
                    const active = selectedModels.includes(model.id);
                    return (
                      <button
                        type="button"
                        key={model.id}
                        className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
                          active ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--line)] bg-white"
                        }`}
                        onClick={() => toggleModel(model.id)}
                      >
                        <p className="font-semibold">{model.name}</p>
                        <p className={`mt-0.5 ${active ? "text-white/70" : "text-[var(--muted)]"}`}>{t(model.hint, lang)}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{t(UI_TEXT.channelTitle, lang)}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CHANNELS.map((channel) => {
                    const active = selectedChannels.includes(channel.id);
                    return (
                      <button
                        type="button"
                        key={channel.id}
                        className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
                          active ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--line)] bg-white"
                        }`}
                        onClick={() => toggleChannel(channel.id)}
                      >
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{channel.name}</p>
                          <span className="rounded border border-current px-1 py-0 text-[9px] uppercase">{channel.badge}</span>
                        </div>
                        <p className={`mt-0.5 ${active ? "text-white/70" : "text-[var(--muted)]"}`}>{t(channel.hint, lang)}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Selection Snapshot</p>
              <div className="mt-4 space-y-2 text-xs">
                <p>
                  <span className="text-[var(--muted)]">Models:</span> {selectedModels.length > 0 ? selectedModels.join(", ") : "none"}
                </p>
                <p>
                  <span className="text-[var(--muted)]">Channels:</span> {selectedChannels.length > 0 ? selectedChannels.join(", ") : "none"}
                </p>
                <p>
                  <span className="text-[var(--muted)]">Plan:</span> {selectedPlan}
                </p>
                <p>
                  <span className="text-[var(--muted)]">Payment:</span> {selectedPaymentMethod}
                </p>
              </div>
            </div>

            <h2 className="mt-8 font-display text-2xl font-semibold tracking-tight">{t(UI_TEXT.planTitle, lang)}</h2>
            <div className="mt-3 space-y-2">
              {PLANS.map((plan) => {
                const active = selectedPlan === plan.id;
                return (
                  <article key={plan.id} className={`rounded-xl border p-4 ${active ? "border-[var(--ink)] bg-[var(--focus)]" : "border-[var(--line)] bg-white"}`}>
                    <div className="flex items-center justify-between">
                      <p className="font-display text-lg font-semibold">{t(plan.title, lang)}</p>
                      <p className="font-mono text-lg font-semibold">{plan.price}</p>
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted)]">{t(plan.subtitle, lang)}</p>
                    <ul className="mt-2 space-y-1 text-xs text-[var(--muted)]">
                      {plan.features.map((feature) => (
                        <li key={feature.en}>• {t(feature, lang)}</li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" className="rounded border border-[var(--line)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em]" onClick={() => selectPlan(plan.id)}>
                        {active ? (lang === "zh-CN" ? "当前已选" : "Selected") : lang === "zh-CN" ? "设为当前" : "Set Active"}
                      </button>
                      <a
                        href={buildPlanCheckoutHref(plan.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded bg-[var(--ink)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white"
                        onClick={() => trackEvent("click_pay", { plan: plan.id, payment_method: selectedPaymentMethod })}
                      >
                        Pay Now
                      </a>
                      <a
                        href={buildSalesHref(plan.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded border border-[var(--line)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
                        onClick={() => trackEvent("click_waitlist", { plan: plan.id, intent: "sales" })}
                      >
                        {t(UI_TEXT.talkSales, lang)}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </section>

        <section className="mt-20 grid gap-14 lg:grid-cols-2">
          <section>
            <h2 className="font-display text-2xl font-semibold tracking-tight">{t(UI_TEXT.paymentTitle, lang)}</h2>
            <p className="mt-2 text-xs text-[var(--muted)]">{t(UI_TEXT.paymentNote, lang)}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {PAYMENT_METHODS.map((method) => {
                const active = selectedPaymentMethod === method.id;
                return (
                  <button
                    type="button"
                    key={method.id}
                    className={`rounded-lg border p-3 text-left text-xs ${active ? "border-[var(--ink)] bg-[var(--focus)]" : "border-[var(--line)] bg-white"}`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <p className="font-semibold">{method.name}</p>
                    <p className="mt-1 text-[var(--muted)]">{t(method.subtitle, lang)}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold tracking-tight">{t(UI_TEXT.painTitle, lang)}</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {PAIN_POINTS.map((point) => (
                <div key={point.en} className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-xs text-[var(--muted)]">
                  {t(point, lang)}
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="mt-20 grid gap-14 lg:grid-cols-2">
          <section>
            <h2 className="font-display text-2xl font-semibold tracking-tight">{t(UI_TEXT.skillsTitle, lang)}</h2>
            <div className="mt-4 grid gap-1.5 sm:grid-cols-2">
              {SKILLS.map((skill) => (
                <div key={skill.en} className="rounded border border-[var(--line)] bg-white px-3 py-2 text-xs">
                  {t(skill, lang)}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold tracking-tight">{t(UI_TEXT.faqTitle, lang)}</h2>
            <div className="mt-4 space-y-2">
              {FAQS.map((faq) => (
                <details key={faq.question.en} className="rounded-lg border border-[var(--line)] bg-white px-3 py-2">
                  <summary className="cursor-pointer text-xs font-medium">{t(faq.question, lang)}</summary>
                  <p className="mt-2 text-xs leading-6 text-[var(--muted)]">{t(faq.answer, lang)}</p>
                </details>
              ))}
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">{t(UI_TEXT.compliance, lang)}</p>
          </section>
        </section>

        <section className="mt-20 rounded-2xl bg-[#111217] px-6 py-8 text-white">
          <h2 className="font-display text-3xl font-semibold tracking-tight">{t(UI_TEXT.finalTitle, lang)}</h2>
          <p className="mt-3 max-w-2xl text-xs leading-6 text-white/75">{t(UI_TEXT.finalSubtitle, lang)}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={checkoutHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#111217]"
              onClick={() => trackEvent("click_pay", { plan: selectedPlan, payment_method: selectedPaymentMethod })}
            >
              {t(UI_TEXT.checkout, lang)}
            </a>
            <a
              href={waitlistHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-white/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.08em]"
              onClick={() => trackEvent("click_waitlist", { plan: selectedPlan, intent: "waitlist" })}
            >
              {t(UI_TEXT.waitlist, lang)}
            </a>
          </div>
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] py-5 text-[11px] text-[var(--muted)]">
          <p>
            © {new Date().getFullYear()} {BRAND_NAME}. MVP Validation Build.
          </p>
          <div className="flex items-center gap-4">
            <a href="/terms" className="hover:text-[var(--ink)]">
              Terms
            </a>
            <a href="/privacy" className="hover:text-[var(--ink)]">
              Privacy
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  BRAND_NAME,
  CHANNELS,
  FAQS,
  MODELS,
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
  const [selectedModels, setSelectedModels] = useState<ModelId[]>(["gpt-5-2", "kimi"]);
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
      trackEvent("select_model", {
        model: modelId,
        selected_count: next.length,
      });
      return next;
    });
  };

  const toggleChannel = (channelId: ChannelId) => {
    setSelectedChannels((previous) => {
      const next = previous.includes(channelId)
        ? previous.filter((id) => id !== channelId)
        : [...previous, channelId];
      trackEvent("select_channel", {
        channel: channelId,
        selected_count: next.length,
      });
      return next;
    });
  };

  const selectPlan = (planId: PlanId) => {
    setSelectedPlan(planId);
    trackEvent("select_plan", { plan: planId });
  };

  const buildPlanCheckoutHref = (planId: PlanId) => {
    const query = buildQuery({
      plan: planId,
      models: selectedModels,
      channels: selectedChannels,
      lang,
    });
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
    <div className="bg-[var(--surface)] text-[var(--ink)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-60" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] bg-hero-glow" />

      <main className="mx-auto max-w-7xl px-5 pb-20 pt-6 sm:px-8 lg:px-12">
        <header className="animate-rise flex items-center justify-between border-b border-[var(--line)] pb-4">
          <div className="flex items-baseline gap-3">
            <p className="font-display text-2xl font-semibold tracking-tight">{BRAND_NAME}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">OpenClaw as a Service</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium transition hover:border-[var(--ink)]"
            onClick={() => setLang((current) => (current === "zh-CN" ? "en" : "zh-CN"))}
          >
            {lang === "zh-CN" ? "EN" : "中文"}
          </button>
        </header>

        <section className="animate-rise mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 inline-flex items-center rounded-full border border-[var(--line)] bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              MVP Validation Landing Page
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              {t(UI_TEXT.heroTitle, lang)}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              {t(UI_TEXT.heroSubtitle, lang)}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={checkoutHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() =>
                  trackEvent("click_pay", {
                    plan: selectedPlan,
                    payment_method: selectedPaymentMethod,
                  })
                }
              >
                {t(UI_TEXT.checkout, lang)}
              </a>
              <a
                href={waitlistHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--line)] bg-white px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-[var(--ink)]"
                onClick={() =>
                  trackEvent("click_waitlist", {
                    plan: selectedPlan,
                    intent: "waitlist",
                  })
                }
              >
                {t(UI_TEXT.waitlist, lang)}
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-white/90 p-5 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Selection Snapshot</p>
            <p className="mt-4 text-sm text-[var(--muted)]">Models</p>
            <p className="font-medium">{selectedModels.length > 0 ? selectedModels.join(", ") : "none"}</p>
            <p className="mt-3 text-sm text-[var(--muted)]">Channels</p>
            <p className="font-medium">{selectedChannels.length > 0 ? selectedChannels.join(", ") : "none"}</p>
            <p className="mt-3 text-sm text-[var(--muted)]">Plan</p>
            <p className="font-medium">{selectedPlan}</p>
            <p className="mt-3 text-sm text-[var(--muted)]">Payment</p>
            <p className="font-medium">{selectedPaymentMethod}</p>
          </div>
        </section>

        <section className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((item) => (
            <div key={item.en} className="rounded-xl border border-[var(--line)] bg-white px-4 py-4 text-sm font-medium">
              {t(item, lang)}
            </div>
          ))}
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{t(UI_TEXT.painTitle, lang)}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PAIN_POINTS.map((point) => (
              <div key={point.en} className="rounded-xl border border-[var(--line)] bg-white px-4 py-4 text-sm leading-6 text-[var(--muted)]">
                {t(point, lang)}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-[var(--line)] bg-white/90 p-5 shadow-sm sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{t(UI_TEXT.builderTitle, lang)}</h2>

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-base font-semibold">{t(UI_TEXT.modelTitle, lang)}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {MODELS.map((model) => {
                  const active = selectedModels.includes(model.id);
                  return (
                    <button
                      type="button"
                      key={model.id}
                      className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                        active
                          ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                          : "border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"
                      }`}
                      onClick={() => toggleModel(model.id)}
                    >
                      <p className="font-semibold">{model.name}</p>
                      <p className={`text-xs ${active ? "text-white/80" : "text-[var(--muted)]"}`}>{t(model.hint, lang)}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold">{t(UI_TEXT.channelTitle, lang)}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {CHANNELS.map((channel) => {
                  const active = selectedChannels.includes(channel.id);
                  return (
                    <button
                      type="button"
                      key={channel.id}
                      className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                        active
                          ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                          : "border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"
                      }`}
                      onClick={() => toggleChannel(channel.id)}
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{channel.name}</p>
                        <span className="rounded-full border border-current px-2 py-0.5 text-[10px] uppercase tracking-wide">
                          {channel.badge}
                        </span>
                      </div>
                      <p className={`text-xs ${active ? "text-white/80" : "text-[var(--muted)]"}`}>{t(channel.hint, lang)}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{t(UI_TEXT.planTitle, lang)}</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {PLANS.map((plan) => {
              const active = selectedPlan === plan.id;
              return (
                <article
                  key={plan.id}
                  className={`rounded-2xl border p-5 transition ${
                    active ? "border-[var(--ink)] bg-[var(--focus)]" : "border-[var(--line)] bg-white"
                  } ${plan.isPrimary ? "ring-2 ring-[var(--ink)]/10" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xl font-semibold">{t(plan.title, lang)}</p>
                    <p className="font-mono text-2xl font-semibold">{plan.price}</p>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{t(plan.subtitle, lang)}</p>
                  <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                    {plan.features.map((feature) => (
                      <li key={feature.en}>• {t(feature, lang)}</li>
                    ))}
                  </ul>
                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition hover:border-[var(--ink)]"
                      onClick={() => selectPlan(plan.id)}
                    >
                      {active ? (lang === "zh-CN" ? "当前已选" : "Selected") : lang === "zh-CN" ? "设为当前" : "Set Active"}
                    </button>
                    <a
                      href={buildPlanCheckoutHref(plan.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5"
                      onClick={() =>
                        trackEvent("click_pay", {
                          plan: plan.id,
                          payment_method: selectedPaymentMethod,
                        })
                      }
                    >
                      Pay Now
                    </a>
                    <a
                      href={buildSalesHref(plan.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition hover:border-[var(--ink)]"
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

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{t(UI_TEXT.paymentTitle, lang)}</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">{t(UI_TEXT.paymentNote, lang)}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PAYMENT_METHODS.map((method) => {
              const active = selectedPaymentMethod === method.id;
              return (
                <button
                  type="button"
                  key={method.id}
                  className={`rounded-xl border p-4 text-left transition ${
                    active ? "border-[var(--ink)] bg-[var(--focus)]" : "border-[var(--line)] bg-white hover:border-[var(--ink)]"
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <p className="font-semibold">{method.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{t(method.subtitle, lang)}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{t(UI_TEXT.skillsTitle, lang)}</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map((skill) => (
              <div key={skill.en} className="rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm">
                {t(skill, lang)}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{t(UI_TEXT.faqTitle, lang)}</h2>
          <div className="mt-5 space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.question.en} className="rounded-xl border border-[var(--line)] bg-white px-4 py-3">
                <summary className="cursor-pointer list-none font-medium">{t(faq.question, lang)}</summary>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{t(faq.answer, lang)}</p>
              </details>
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">{t(UI_TEXT.compliance, lang)}</p>
        </section>

        <section className="mt-14 rounded-2xl border border-[var(--line)] bg-[var(--ink)] px-6 py-8 text-white sm:px-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight">{t(UI_TEXT.finalTitle, lang)}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">{t(UI_TEXT.finalSubtitle, lang)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={checkoutHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5"
              onClick={() => trackEvent("click_pay", { plan: selectedPlan, payment_method: selectedPaymentMethod })}
            >
              {t(UI_TEXT.checkout, lang)}
            </a>
            <a
              href={waitlistHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
              onClick={() => trackEvent("click_waitlist", { plan: selectedPlan, intent: "waitlist" })}
            >
              {t(UI_TEXT.waitlist, lang)}
            </a>
          </div>
          <noscript>
            <p className="mt-4 text-xs text-white/70">
              JavaScript disabled: default checkout uses plan=pro_40 and source=landing_v1.
            </p>
          </noscript>
        </section>

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] py-5 text-xs text-[var(--muted)]">
          <p>
            © {new Date().getFullYear()} {BRAND_NAME}. MVP Validation Build.
          </p>
          <div className="flex items-center gap-4">
            <a href="/terms.html" className="hover:text-[var(--ink)]">
              Terms
            </a>
            <a href="/privacy.html" className="hover:text-[var(--ink)]">
              Privacy
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

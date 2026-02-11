"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { copy, Lang } from "@/lib/landingCopy";

export default function Pricing() {
  const sp = useSearchParams();
  const lang: Lang = sp.get("lang") === "en" ? "en" : "zh";
  const t = copy[lang].pricing;

  return (
    <div>
      <div className="text-2xl font-semibold">{t.title}</div>
      <div className="mt-2 text-sm text-black/70">{t.sub}</div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PlanCard
          name={t.starter.name}
          price={t.starter.price}
          credits={t.starter.credits}
          bullets={t.starter.bullets}
          cta={t.starter.cta}
          href="/login"
        />

        <PlanCard
          highlight
          badge={t.pro.badge}
          name={t.pro.name}
          price={t.pro.price}
          credits={t.pro.credits}
          bullets={t.pro.bullets}
          cta={t.pro.cta}
          href="/login"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-sm font-semibold">{t.topup.title}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {t.topup.packs.map((p) => (
            <div key={p} className="rounded-full bg-black/5 px-4 py-2 text-sm">
              {p}
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-black/50">{t.topup.note}</div>
      </div>
    </div>
  );
}

function PlanCard(props: {
  highlight?: boolean;
  badge?: string;
  name: string;
  price: string;
  credits: string;
  bullets: readonly string[];
  cta: string;
  href: string;
}) {
  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${props.highlight ? "border-black bg-black text-white" : "border-black/10 bg-white"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={`text-lg font-semibold ${props.highlight ? "text-white" : "text-black"}`}>{props.name}</div>
          {props.badge && (
            <div className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs ${props.highlight ? "bg-white/10 text-white/90" : "bg-black/5 text-black/70"}`}>
              {props.badge}
            </div>
          )}
        </div>
        <div className={`text-lg font-semibold ${props.highlight ? "text-white" : "text-black"}`}>{props.price}</div>
      </div>

      <div className={`mt-3 text-sm ${props.highlight ? "text-white/80" : "text-black/70"}`}>{props.credits}</div>

      <ul className="mt-5 space-y-2 text-sm">
        {props.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className={`mt-1 inline-block h-2 w-2 rounded-full ${props.highlight ? "bg-white" : "bg-black"}`} />
            <span className={props.highlight ? "text-white/90" : "text-black/80"}>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-3">
        <Link
          href={props.href}
          className={`rounded-full px-5 py-3 text-sm font-medium ${props.highlight ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"}`}
        >
          {props.cta}
        </Link>

        <a
          href="#"
          className={`rounded-full px-5 py-3 text-sm font-medium ${props.highlight ? "border border-white/20 text-white hover:bg-white/10" : "border border-black/15 hover:bg-black/5"}`}
          onClick={(e) => {
            e.preventDefault();
            alert("Sales placeholder");
          }}
        >
          Talk to sales
        </a>
      </div>
    </div>
  );
}

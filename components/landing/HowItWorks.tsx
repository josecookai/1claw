"use client";

import { useSearchParams } from "next/navigation";
import { copy, Lang } from "@/lib/landingCopy";

export default function HowItWorks() {
  const sp = useSearchParams();
  const lang: Lang = sp.get("lang") === "en" ? "en" : "zh";
  const t = copy[lang].how;

  return (
    <div>
      <div className="text-2xl font-semibold">{t.title}</div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {t.steps.map((s) => (
          <div key={s.h} className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-sm font-semibold">{s.h}</div>
            <div className="mt-2 text-sm text-black/70">{s.p}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

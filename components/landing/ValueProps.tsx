"use client";

import { useSearchParams } from "next/navigation";
import { copy, Lang } from "@/lib/landingCopy";

export default function ValueProps() {
  const sp = useSearchParams();
  const lang: Lang = sp.get("lang") === "en" ? "en" : "zh";
  const t = copy[lang].value;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="text-lg font-semibold">{t.title}</div>

      <div className="mt-5 space-y-4">
        {t.items.map((it) => (
          <div key={it.h} className="rounded-2xl border border-black/10 bg-[#f7f6f3] p-4">
            <div className="text-sm font-medium">{it.h}</div>
            <div className="mt-1 text-sm text-black/70">{it.p}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4">
        <div className="text-sm font-medium">Included</div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-black/70">
          {["OpenAI", "Anthropic", "Google", "DeepSeek", "xAI", "Kimi", "GLM", "Hunyuan", "Bailian", "..."].map(
            (x) => (
              <span key={x} className="rounded-full bg-black/5 px-3 py-1">
                {x}
              </span>
            )
          )}
        </div>
        <div className="mt-2 text-xs text-black/50">30+ models included. No selection needed.</div>
      </div>
    </div>
  );
}

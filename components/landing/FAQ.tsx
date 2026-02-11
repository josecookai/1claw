"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { copy, Lang } from "@/lib/landingCopy";

export default function FAQ() {
  const sp = useSearchParams();
  const lang: Lang = sp.get("lang") === "en" ? "en" : "zh";
  const t = copy[lang].faq;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <div className="text-2xl font-semibold">{t.title}</div>
      <div className="mt-6 space-y-3">
        {t.items.map((it, idx) => {
          const isOpen = open === idx;
          return (
            <button
              key={it.q}
              className="w-full rounded-2xl border border-black/10 bg-white p-5 text-left"
              onClick={() => setOpen(isOpen ? null : idx)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-semibold">{it.q}</div>
                <div className="text-sm text-black/40">{isOpen ? "-" : "+"}</div>
              </div>
              {isOpen && <div className="mt-3 text-sm text-black/70">{it.a}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

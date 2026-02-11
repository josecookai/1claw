"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { copy, Lang } from "@/lib/landingCopy";

export default function FinalCTA() {
  const sp = useSearchParams();
  const lang: Lang = sp.get("lang") === "en" ? "en" : "zh";
  const t = copy[lang].final;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-8">
      <div className="text-2xl font-semibold">{t.h}</div>
      <div className="mt-2 text-sm text-black/70">{t.p}</div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/login" className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-black/90">
          {t.primary}
        </Link>
        <a href="#pricing" className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-medium hover:bg-black/5">
          {t.secondary}
        </a>
      </div>
    </div>
  );
}

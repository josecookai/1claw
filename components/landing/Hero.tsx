"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { copy, Lang } from "@/lib/landingCopy";
import WaitlistForm from "@/components/landing/WaitlistForm";

export default function Hero() {
  const sp = useSearchParams();
  const lang: Lang = sp.get("lang") === "en" ? "en" : "zh";
  const t = copy[lang];

  return (
    <div className="flex flex-col gap-6">
      <div className="text-xs tracking-widest text-black/50">MVP VALIDATION LANDING</div>

      <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">{t.hero.h1}</h1>

      <p className="max-w-2xl text-base text-black/70 sm:text-lg">{t.hero.sub}</p>

      <div className="flex flex-wrap items-center gap-3">
        <Link href="/login" className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-black/90">
          {t.hero.primary}
        </Link>

        <a href="#pricing" className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-medium hover:bg-black/5">
          {t.hero.secondary}
        </a>

        <a href="#waitlist" className="text-sm text-black/60 hover:text-black">
          {t.hero.tertiary}
        </a>
      </div>

      <div id="waitlist">
        <WaitlistForm lang={lang} />
      </div>
    </div>
  );
}

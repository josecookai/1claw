"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { copy, Lang } from "@/lib/landingCopy";

export default function LandingNav() {
  const sp = useSearchParams();
  const router = useRouter();
  const lang: Lang = sp.get("lang") === "en" ? "en" : "zh";
  const t = copy[lang];

  const toggleLang = () => {
    const next = lang === "zh" ? "en" : "zh";
    router.push(`/?lang=${next}#pricing`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f7f6f3]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold">1Claw</div>
          <div className="text-xs tracking-widest text-black/50">OPENCLAW AS A SERVICE</div>
        </div>

        <nav className="flex items-center gap-2 text-sm">
          <a href="#pricing" className="rounded-full px-3 py-1 hover:bg-black/5">
            {t.nav.pricing}
          </a>
          <Link href="/login" className="rounded-full px-3 py-1 hover:bg-black/5">
            {t.nav.login}
          </Link>
          <button onClick={toggleLang} className="rounded-full px-3 py-1 hover:bg-black/5">
            {lang === "zh" ? "EN" : "中文"}
          </button>
        </nav>
      </div>
    </header>
  );
}

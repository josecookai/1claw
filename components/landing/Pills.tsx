"use client";

import { useSearchParams } from "next/navigation";
import { copy, Lang } from "@/lib/landingCopy";

export default function Pills() {
  const sp = useSearchParams();
  const lang: Lang = sp.get("lang") === "en" ? "en" : "zh";
  const pills = copy[lang].pills;

  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((p) => (
        <div key={p} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/80">
          {p}
        </div>
      ))}
    </div>
  );
}

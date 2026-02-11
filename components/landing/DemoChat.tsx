"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { copy, Lang } from "@/lib/landingCopy";

export default function DemoChat() {
  const sp = useSearchParams();
  const lang: Lang = sp.get("lang") === "en" ? "en" : "zh";
  const t = copy[lang].demo;

  const meta = useMemo(
    () => [
      { k: t.meta.mode, v: `${t.meta.strong} -> ${t.meta.smart}` },
      { k: t.meta.routing, v: t.meta.auto },
      { k: t.meta.credits, v: "-25" },
    ],
    [t]
  );

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium">{t.title}</div>
          <div className="mt-1 text-xs text-black/60">{t.hint}</div>
        </div>

        <div className="flex items-center gap-2">
          {meta.map((m) => (
            <div key={m.k} className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/70">
              <span className="text-black/50">{m.k}:</span> {m.v}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <Bubble role="user" text={t.user} />
        <Bubble role="assistant" title={t.assistantTitle} text={t.assistant} />
      </div>

      <div className="mt-4 rounded-xl border border-black/10 bg-[#f7f6f3] p-3 text-xs text-black/70">{t.degraded}</div>
    </div>
  );
}

function Bubble(props: { role: "user" | "assistant"; text: string; title?: string }) {
  const isUser = props.role === "user";
  return (
    <div className="flex justify-start">
      <div
        className={`max-w-full rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser ? "bg-black text-white" : "bg-black/5 text-black"
        }`}
      >
        {props.title && <div className="mb-2 text-xs font-medium text-black/60">{props.title}</div>}
        <pre className="whitespace-pre-wrap font-sans">{props.text}</pre>
      </div>
    </div>
  );
}

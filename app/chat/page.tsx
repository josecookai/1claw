"use client";

import { useMemo, useState } from "react";
import { loadSelection, TOPUP_PACKS, PlanId } from "@/lib/product-pages";

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

const DAILY_LIMIT_BY_PLAN: Record<PlanId, number> = {
  starter_20: 4000,
  max_200: 50000,
};

export default function ChatPage() {
  const saved = loadSelection();
  const [credits, setCredits] = useState(DAILY_LIMIT_BY_PLAN[saved.plan]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [taskStage, setTaskStage] = useState<string>("");
  const [topupOpen, setTopupOpen] = useState(false);

  const degrade = credits < 600;

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const requestId = `req_${Date.now()}`;
    setInput("");
    setSending(true);
    setTaskStage("Reading your request");
    setMessages((prev) => [...prev, { id: `${requestId}_u`, role: "user", text }]);
    await new Promise((r) => setTimeout(r, 350));
    setTaskStage("Routing to best provider");
    await new Promise((r) => setTimeout(r, 350));
    setTaskStage("Executing action");
    await new Promise((r) => setTimeout(r, 350));
    setCredits((c) => Math.max(0, c - 100));
    setMessages((prev) => [...prev, { id: `${requestId}_a`, role: "assistant", text: `Received: ${text}` }]);
    setTaskStage("");
    setSending(false);
  };

  const statusText = useMemo(() => {
    if (credits <= 0) return "Credits exhausted. Top-up recommended.";
    if (degrade) return "Low credits. Auto downgrade active.";
    return "Service healthy.";
  }, [credits, degrade]);

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-8 sm:px-10">
      <h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">{statusText}</p>

      <header className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-xs">
        <span className="rounded-full border border-[var(--line)] px-2 py-1">Plan: {saved.plan === "max_200" ? "Pro" : "Starter"}</span>
        <span className="rounded-full border border-[var(--line)] px-2 py-1">Mode: {saved.preference}</span>
        <span className="rounded-full border border-[var(--line)] px-2 py-1">Credits: {credits.toLocaleString()}</span>
        <button type="button" className="ml-auto rounded-full bg-[var(--ink)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white" onClick={() => setTopupOpen(true)}>
          Top-up
        </button>
      </header>

      {degrade ? (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Credits are low. Route downgraded automatically to keep replies available.
        </div>
      ) : null}

      {sending && taskStage ? (
        <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
          Agent executing: {taskStage}...
        </div>
      ) : null}

      <div className="mt-3 space-y-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
        {messages.length === 0 ? <p className="text-sm text-[var(--muted)]">Start with your first message.</p> : null}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.role === "user" ? "bg-[var(--ink)] text-white" : "border border-[var(--line)] bg-white text-[var(--ink)]"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type message" className="flex-1 rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--ink)]" />
        <button type="button" disabled={sending} onClick={send} className="rounded-xl bg-[var(--ink)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white disabled:opacity-60">
          Send
        </button>
      </div>

      {topupOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold">Top-up credits</h3>
            <div className="mt-4 grid gap-2">
              {TOPUP_PACKS.map((pack) => (
                <button key={pack.id} type="button" onClick={() => { setCredits((c) => c + pack.credits); setTopupOpen(false); }} className="rounded-xl border border-[var(--line)] px-3 py-2 text-left text-sm hover:border-[var(--ink)]">
                  <p className="font-semibold">{pack.price}</p>
                  <p className="text-xs text-[var(--muted)]">{pack.credits.toLocaleString()} credits</p>
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={() => setTopupOpen(false)} className="rounded-full border border-[var(--line)] px-4 py-2 text-xs">Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

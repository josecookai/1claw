'use client';

import { useMemo, useState } from 'react';
import type { PlanId } from 'shared';
import { ChatHeaderBar } from '@/components/chat/ChatHeaderBar';
import { Composer } from '@/components/chat/Composer';
import { DegradeBanner } from '@/components/chat/DegradeBanner';
import { MessageList } from '@/components/chat/MessageList';
import type { ChatMessage } from '@/components/chat/MessageBubble';
import { TopupModal } from '@/components/chat/TopupModal';
import { loadSelection } from '@/lib/product';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

const DAILY_LIMIT_BY_PLAN: Record<PlanId, number> = {
  starter_20: 4000,
  pro_40: 15000,
  max_200: 50000,
};

export default function ChatPage() {
  const saved = loadSelection();
  const [plan] = useState<PlanId>(saved.plan);
  const [mode] = useState(saved.preference);
  const [credits, setCredits] = useState(DAILY_LIMIT_BY_PLAN[saved.plan]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [topupOpen, setTopupOpen] = useState(false);

  const degrade = credits < 600;

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') ?? 'dev-user' : 'dev-user';
    const chatId = typeof window !== 'undefined' ? localStorage.getItem('chatId') ?? 'web-chat' : 'web-chat';
    const requestId = `req_${Date.now()}`;

    setInput('');
    setSending(true);
    setMessages((prev) => [...prev, { id: `${requestId}_u`, role: 'user', text }]);

    try {
      const res = await fetch(`${API_BASE}/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, chatId, message: text, policy: mode }),
      });
      const data = await res.json();
      const reply = data?.reply ?? `Received: ${text}`;
      const used = Number(data?.usage?.tokens ?? 120);
      setCredits((c) => Math.max(0, c - used));
      setMessages((prev) => [...prev, { id: `${requestId}_a`, role: 'assistant', text: reply }]);
    } catch {
      setCredits((c) => Math.max(0, c - 80));
      setMessages((prev) => [...prev, { id: `${requestId}_a`, role: 'assistant', text: `Fallback reply: ${text}` }]);
    } finally {
      setSending(false);
    }
  };

  const statusText = useMemo(() => {
    if (credits <= 0) return 'Credits exhausted. Top-up recommended.';
    if (degrade) return 'Low credits. Auto downgrade active.';
    return 'Service healthy.';
  }, [credits, degrade]);

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-8 sm:px-10">
      <h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
      <p className="mt-1 text-sm text-[var(--ink-muted)]">{statusText}</p>

      <div className="mt-4">
        <ChatHeaderBar plan={plan} mode={mode} credits={credits} onTopup={() => setTopupOpen(true)} />
      </div>

      <div className="mt-3">
        <DegradeBanner show={degrade} />
      </div>

      <div className="mt-3">
        <MessageList messages={messages} />
        <Composer value={input} onChange={setInput} onSend={send} disabled={sending} />
      </div>

      <TopupModal
        open={topupOpen}
        onClose={() => setTopupOpen(false)}
        onApplied={(added) => {
          setCredits((c) => c + added);
          setTopupOpen(false);
        }}
      />
    </main>
  );
}

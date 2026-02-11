import { ChatMessage, MessageBubble } from './MessageBubble';

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="space-y-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
      {messages.length === 0 ? (
        <p className="text-sm text-[var(--ink-muted)]">Start with your first message.</p>
      ) : (
        messages.map((m) => <MessageBubble key={m.id} msg={m} />)
      )}
    </div>
  );
}

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${isUser ? 'bg-[var(--accent)] text-white' : 'border border-[var(--line)] bg-white text-[var(--ink)]'}`}>
        {msg.text}
      </div>
    </div>
  );
}

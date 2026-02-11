import type { ProviderResult } from './types';

const KIMI_API = 'https://api.moonshot.ai/v1/chat/completions';

export async function callKimi(
  apiKey: string,
  prompt: string,
  model: string = 'moonshot-v1-8k',
): Promise<ProviderResult> {
  const start = Date.now();
  const res = await fetch(KIMI_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    }),
  });

  const latencyMs = Date.now() - start;

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Kimi API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  };

  const reply = data.choices?.[0]?.message?.content ?? '';
  const tokens =
    data.usage?.total_tokens ??
    (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0);

  return {
    reply,
    provider: 'kimi',
    model,
    tokens,
    latencyMs,
  };
}

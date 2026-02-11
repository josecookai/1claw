import type { ProviderResult } from './types';

const OPENAI_API = 'https://api.openai.com/v1/chat/completions';

export async function callOpenAI(
  apiKey: string,
  prompt: string,
  model: string = 'gpt-4o-mini',
): Promise<ProviderResult> {
  const start = Date.now();
  const res = await fetch(OPENAI_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const latencyMs = Date.now() - start;

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { total_tokens?: number };
  };

  const reply = data.choices?.[0]?.message?.content ?? '';
  const tokens = data.usage?.total_tokens ?? 0;

  return {
    reply,
    provider: 'openai',
    model,
    tokens,
    latencyMs,
  };
}

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { callOpenAI } from './openai';

describe('callOpenAI', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns reply and tokens from API response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: 'Hi there!' } }],
        usage: { total_tokens: 10 },
      }),
    }));

    const result = await callOpenAI('sk-test', 'hello');
    expect(result.reply).toBe('Hi there!');
    expect(result.tokens).toBe(10);
    expect(result.provider).toBe('openai');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('throws on API error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve('Invalid API key'),
    }));

    await expect(callOpenAI('bad-key', 'hello')).rejects.toThrow('OpenAI API error');
  });
});

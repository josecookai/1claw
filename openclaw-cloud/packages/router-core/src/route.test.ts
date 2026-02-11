import { describe, it, expect } from 'vitest';
import { route, routeWithFallback, RouterError } from './index';

describe('route', () => {
  it('returns provider and model for BEST policy', () => {
    const r = route({
      userId: 'u1',
      message: 'hi',
      policy: 'BEST',
    });
    expect(r.provider).toBe('openai');
    expect(r.model).toBe('gpt-4o');
  });

  it('CN_OK returns kimi (domestic) first', () => {
    const r = route({
      userId: 'u1',
      message: 'hi',
      policy: 'CN_OK',
    });
    expect(r.provider).toBe('kimi');
    expect(r.model).toBe('moonshot-v1');
  });

  it('CHEAP returns kimi first', () => {
    const r = route({
      userId: 'u1',
      message: 'hi',
      policy: 'CHEAP',
    });
    expect(r.provider).toBe('kimi');
  });
});

describe('routeWithFallback', () => {
  it('falls back to B when A fails', async () => {
    const r = await routeWithFallback(
      { userId: 'u1', message: 'hi', policy: 'BEST' },
      { forceFail: { openai: true } },
    );
    expect(r.provider).toBe('kimi');
    expect(r.model).toBe('moonshot-v1');
  });

  it('throws when all providers fail', async () => {
    await expect(
      routeWithFallback(
        { userId: 'u1', message: 'hi', policy: 'BEST' },
        { forceFail: { openai: true, kimi: true } },
      ),
    ).rejects.toThrow(RouterError);
  });
});

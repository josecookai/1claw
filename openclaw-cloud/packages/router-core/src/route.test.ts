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
  it('returns first provider for BEST policy', async () => {
    const r = await routeWithFallback({ userId: 'u1', message: 'hi', policy: 'BEST' });
    expect(r.provider).toBe('openai');
    expect(r.model).toBe('gpt-4o');
  });

  it('returns kimi first for CN_OK policy', async () => {
    const r = await routeWithFallback({ userId: 'u1', message: 'hi', policy: 'CN_OK' });
    expect(r.provider).toBe('kimi');
    expect(r.model).toBe('moonshot-v1-8k');
  });
});

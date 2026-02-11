import { describe, it, expect } from 'vitest';
import { ClawRouter, stubCheap, stubStrong, stubSmart, HealthRegistry } from '../src';

describe('ClawRouter', () => {
  const router = new ClawRouter({
    providers: [stubStrong, stubSmart, stubCheap],
  });

  describe('CN_OK excludes global-only provider', () => {
    it('CN_OK does not select stub_strong (global-only)', () => {
      const decision = router.route({
        prompt: 'hi',
        policy: 'CN_OK',
        userPlan: 'pro',
      });
      expect(decision.providerKey).not.toBe('stub_strong');
      expect(['stub_smart', 'stub_cheap']).toContain(decision.providerKey);
    });

    it('CN_OK prefers CN or BOTH region providers', () => {
      const decision = router.route({
        prompt: 'hello',
        policy: 'CN_OK',
        userPlan: 'starter',
      });
      expect(decision.providerKey).not.toBe('stub_strong');
    });
  });

  describe('provider A 429 → fallback B', () => {
    it('falls back to next provider when first returns 429', async () => {
      const health = new HealthRegistry();
      const r = new ClawRouter({ providers: [stubStrong, stubCheap] });

      let callCount = 0;
      const result = await r.routeWithFallback(
        {
          prompt: 'hi',
          policy: 'MAX',
          userPlan: 'pro',
        },
        {
          healthRegistry: health,
          execute: async (d) => {
            callCount++;
            if (d.providerKey === 'stub_strong' && callCount === 1) {
              const err = new Error('429 Too Many Requests') as Error & { code?: string };
              err.code = 'ROUTER_RATE_LIMITED';
              throw err;
            }
            return { ok: true, provider: d.providerKey };
          },
        },
      );

      expect(result.fallbackCount).toBe(1);
      expect(result.decision.providerKey).toBe('stub_cheap');
      expect(callCount).toBe(2);
    });
  });

  describe('plan=starter MAX policy downgraded', () => {
    it('starter + MAX does not select STRONG tier (costly)', () => {
      const decision = router.route({
        prompt: 'hi',
        policy: 'MAX',
        userPlan: 'starter',
      });
      expect(decision.providerKey).not.toBe('stub_strong');
    });

    it('pro + MAX can select STRONG tier', () => {
      const decision = router.route({
        prompt: 'hi',
        policy: 'MAX',
        userPlan: 'pro',
      });
      expect(decision.providerKey).toBe('stub_strong');
    });
  });

  describe('explain disabled by default', () => {
    it('no explain when enableExplain is false', () => {
      const decision = router.route({
        prompt: 'hi',
        policy: 'AUTO',
        userPlan: 'pro',
      });
      expect(decision.explain).toBeUndefined();
    });

    it('explain present when enableExplain is true', () => {
      const decision = router.route(
        {
          prompt: 'hi',
          policy: 'AUTO',
          userPlan: 'pro',
        },
        { enableExplain: true },
      );
      expect(decision.explain).toBeDefined();
      expect(decision.explain?.reason).toBeDefined();
    });
  });
});

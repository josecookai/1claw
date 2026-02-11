/**
 * Stub strong provider - STRONG tier, GLOBAL only.
 * Used for testing (CN_OK must exclude this).
 */

import type { ProviderAdapter } from './ProviderAdapter';

export const stubStrong: ProviderAdapter = {
  providerKey: 'stub_strong',
  modelKey: 'stub-strong-v1',
  tier: 'STRONG',
  regionSupport: 'GLOBAL',
  costScore: 0.9,
  latencyScore: 0.2,
  isAllowedForPolicy(policy: string): boolean {
    return policy !== 'CN_OK'; // global-only, excluded when CN_OK
  },
};

/**
 * Stub cheap provider - LIGHT tier, CN region.
 * Used for testing and as placeholder.
 */

import type { ProviderAdapter } from './ProviderAdapter';

export const stubCheap: ProviderAdapter = {
  providerKey: 'stub_cheap',
  modelKey: 'stub-light-v1',
  tier: 'LIGHT',
  regionSupport: 'CN',
  costScore: 0.2,
  latencyScore: 0.3,
  isAllowedForPolicy(policy: string): boolean {
    return true; // CN region, allowed for CN_OK
  },
};

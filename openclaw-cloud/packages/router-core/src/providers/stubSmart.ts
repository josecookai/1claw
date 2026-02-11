/**
 * Stub smart provider - SMART tier, BOTH regions.
 */

import type { ProviderAdapter } from './ProviderAdapter';

export const stubSmart: ProviderAdapter = {
  providerKey: 'stub_smart',
  modelKey: 'stub-smart-v1',
  tier: 'SMART',
  regionSupport: 'BOTH',
  costScore: 0.5,
  latencyScore: 0.4,
  isAllowedForPolicy(_policy: string): boolean {
    return true;
  },
};

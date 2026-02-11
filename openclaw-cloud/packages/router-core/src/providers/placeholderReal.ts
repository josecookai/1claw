/**
 * Placeholder for real provider - CN region, SMART tier.
 * Maps to internal key; actual API call uses kimi/openai via separate layer.
 */

import type { ProviderAdapter } from './ProviderAdapter';

export const placeholderReal: ProviderAdapter = {
  providerKey: 'provider_cn_1',
  modelKey: 'smart-cn-v1',
  tier: 'SMART',
  regionSupport: 'CN',
  costScore: 0.4,
  latencyScore: 0.35,
  isAllowedForPolicy(policy: string): boolean {
    return true;
  },
};

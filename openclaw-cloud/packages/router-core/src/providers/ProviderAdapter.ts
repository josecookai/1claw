/**
 * Unified provider interface - abstracts provider implementations.
 * Internal keys only; no brand exposure.
 */

import type { ProviderHealth, RegionSupport } from '../types';

export interface ProviderAdapter {
  readonly providerKey: string;
  readonly modelKey: string;
  readonly tier: 'STRONG' | 'SMART' | 'LIGHT';
  readonly regionSupport: RegionSupport;
  readonly costScore: number; // 0-1, lower = cheaper
  readonly latencyScore: number; // 0-1, lower = faster
  /** Check if this provider is allowed for given policy (e.g. CN_OK excludes global-only) */
  isAllowedForPolicy(policy: string): boolean;
}

export interface ProviderHealthSnapshot {
  latencyP50Ms: number;
  errorRate: number;
  last429At?: number;
  regionSupport: RegionSupport;
}

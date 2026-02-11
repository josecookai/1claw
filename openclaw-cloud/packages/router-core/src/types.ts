/**
 * Router-core types - internal only, no brand exposure.
 */

export type Policy = 'AUTO' | 'SAVE' | 'MAX' | 'CN_OK';

export type UserPlan = 'starter' | 'pro';

export type Tier = 'STRONG' | 'SMART' | 'LIGHT';

export type RegionSupport = 'CN' | 'GLOBAL' | 'BOTH';

/** Input to route() */
export interface RouteRequest {
  prompt: string;
  contextTokens?: number;
  policy: Policy;
  userPlan: UserPlan;
}

/** Internal routing decision for API consumption */
export interface RouteDecision {
  providerKey: string;
  modelKey: string;
  tier: Tier;
  degraded: boolean;
  queued: boolean;
  explain?: RouteExplain;
}

/** Debug-only, not exposed by default */
export interface RouteExplain {
  scores?: Record<string, number>;
  reason?: string;
  fallbackAttempt?: number;
}

/** Context passed to route() */
export interface RouteContext {
  enableExplain?: boolean;
  healthRegistry?: ProviderHealthRegistry;
  /** Exclude these providers (e.g. after fallback from 429) */
  excludeProviders?: Set<string>;
}

export interface ProviderHealthRegistry {
  getHealth(providerKey: string): ProviderHealth | undefined;
  record429?(providerKey: string): void;
  recordError?(providerKey: string): void;
}

export interface ProviderHealth {
  latencyP50Ms: number;
  errorRate: number;
  last429At?: number;
  regionSupport: RegionSupport;
}

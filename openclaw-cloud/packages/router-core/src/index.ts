export { ClawRouter } from './ClawRouter';
export { RouterError } from './errors';
export { HealthRegistry } from './health/HealthRegistry';
export { stubCheap } from './providers/stubCheap';
export { stubStrong } from './providers/stubStrong';
export { stubSmart } from './providers/stubSmart';
export { placeholderReal } from './providers/placeholderReal';

export type {
  RouteRequest,
  RouteDecision,
  RouteContext,
  Policy,
  UserPlan,
  Tier,
  ProviderHealth,
  ProviderHealthRegistry,
} from './types';
export type { ProviderAdapter } from './providers/ProviderAdapter';

// Legacy exports for backward compatibility
export { route } from './route';
export { routeWithFallback, getProviderOrder, POLICY_ORDER, PROVIDER_MODELS } from './routeWithFallback';
export type { RouteResult } from './route';
export type { ProviderResult } from './providers/types';
export { callOpenAI } from './providers/openai';
export { callKimi } from './providers/kimi';

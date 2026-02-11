/**
 * 8 scoring dimensions for routing decisions.
 * - prompt length bucket
 * - context length bucket
 * - plan (starter/pro weights)
 * - policy (AUTO/SAVE/MAX/CN_OK)
 * - provider health score
 * - cost score
 * - latency score
 * - confidence (low → SMART tier)
 */

import type { Policy, UserPlan } from './types';
import type { ProviderAdapter } from './providers/ProviderAdapter';
import type { ProviderHealth } from './types';

const PROMPT_BUCKETS = [0, 100, 500, 2000, 8000, 32000] as const;
const CONTEXT_BUCKETS = [0, 4096, 16384, 65536, 131072] as const;

function bucketize(value: number, buckets: readonly number[]): number {
  for (let i = buckets.length - 1; i >= 0; i--) {
    if (value >= buckets[i]) return i;
  }
  return 0;
}

export function promptLengthBucket(promptLength: number): number {
  return bucketize(promptLength, PROMPT_BUCKETS);
}

export function contextLengthBucket(contextTokens: number): number {
  return bucketize(contextTokens, CONTEXT_BUCKETS);
}

/** Plan weight: starter penalizes expensive routes, pro allows */
export function planScore(plan: UserPlan, costScore: number): number {
  if (plan === 'pro') return 1;
  return 1 - costScore * 0.8; // starter: cannot burn unlimited credits
}

export function policyScore(
  policy: Policy,
  provider: ProviderAdapter,
  plan?: UserPlan,
): number {
  switch (policy) {
    case 'AUTO':
      return 0.5;
    case 'SAVE':
      return 1 - provider.costScore;
    case 'MAX':
      if (plan === 'starter') {
        return provider.tier === 'STRONG' ? 0.2 : provider.tier === 'SMART' ? 0.6 : 0.8;
      }
      return provider.tier === 'STRONG' ? 1 : provider.tier === 'SMART' ? 0.7 : 0.4;
    case 'CN_OK':
      return provider.regionSupport === 'CN' || provider.regionSupport === 'BOTH' ? 1 : 0;
    default:
      return 0.5;
  }
}

export function providerHealthScore(health?: ProviderHealth): number {
  if (!health) return 0.8;
  const latencyNorm = Math.max(0, 1 - health.latencyP50Ms / 5000);
  const errorPenalty = 1 - health.errorRate;
  const recent429 = health.last429At ? (Date.now() - health.last429At) < 60000 : false;
  const rateLimitPenalty = recent429 ? 0.3 : 1;
  return (latencyNorm * 0.4 + errorPenalty * 0.4 + rateLimitPenalty * 0.2);
}

export function costScore(provider: ProviderAdapter): number {
  return 1 - provider.costScore;
}

export function latencyScore(provider: ProviderAdapter, health?: ProviderHealth): number {
  const base = 1 - provider.latencyScore;
  if (!health) return base;
  const latencyNorm = Math.max(0, 1 - health.latencyP50Ms / 5000);
  return (base + latencyNorm) / 2;
}

/** Low confidence (e.g. edge cases) → prefer SMART tier */
export function confidenceScore(
  promptBucket: number,
  contextBucket: number,
  tier: string,
): number {
  const isEdge = promptBucket >= 4 || contextBucket >= 3;
  if (isEdge && tier === 'SMART') return 1;
  if (isEdge && tier === 'STRONG') return 0.5;
  if (isEdge && tier === 'LIGHT') return 0.6;
  return 1;
}

export function computeTotalScore(
  request: { prompt: string; contextTokens?: number; policy: Policy; userPlan: UserPlan },
  provider: ProviderAdapter,
  health?: ProviderHealth,
  scores?: Record<string, number>,
): number {
  const promptBucket = promptLengthBucket(request.prompt.length);
  const contextBucket = contextLengthBucket(request.contextTokens ?? 0);

  const s1 = promptLengthBucket(request.prompt.length) / (PROMPT_BUCKETS.length - 1);
  const s2 = contextLengthBucket(request.contextTokens ?? 0) / (CONTEXT_BUCKETS.length - 1);
  const s3 = planScore(request.userPlan, provider.costScore);
  const s4 = policyScore(request.policy, provider, request.userPlan);
  const s5 = providerHealthScore(health);
  const s6 = costScore(provider);
  const s7 = latencyScore(provider, health);
  const s8 = confidenceScore(promptBucket, contextBucket, provider.tier);

  if (scores) {
    scores.promptBucket = s1;
    scores.contextBucket = s2;
    scores.plan = s3;
    scores.policy = s4;
    scores.health = s5;
    scores.cost = s6;
    scores.latency = s7;
    scores.confidence = s8;
  }

  return (s1 * 0.05 + s2 * 0.05 + s3 * 0.2 + s4 * 0.25 + s5 * 0.15 + s6 * 0.1 + s7 * 0.1 + s8 * 0.1);
}

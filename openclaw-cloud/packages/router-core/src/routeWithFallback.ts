import type { Policy } from 'shared';
import { RouterError } from './errors';
import { route } from './route';

export interface RouteRequest {
  userId: string;
  message: string;
  policy: Policy;
}

export interface RouteResult {
  provider: string;
  model: string;
  headers?: Record<string, string>;
  latencyMs?: number;
}

export const POLICY_ORDER: Record<Policy, string[]> = {
  BEST: ['openai', 'kimi'],
  CHEAP: ['kimi', 'openai'],
  CN_OK: ['kimi', 'openai'],
};

export const PROVIDER_MODELS: Record<string, string> = {
  kimi: 'moonshot-v1-8k',
  openai: 'gpt-4o',
};

export function getProviderOrder(policy: Policy): string[] {
  return POLICY_ORDER[policy] ?? ['openai', 'kimi'];
}

/** Returns the first provider in policy order (routing decision only; actual LLM call in controller). */
export async function routeWithFallback(
  request: RouteRequest,
  _options?: { forceFail?: Record<string, boolean> },
): Promise<RouteResult> {
  const order = getProviderOrder(request.policy);
  const provider = order[0];
  if (!provider || !PROVIDER_MODELS[provider]) {
    throw new RouterError('ROUTER_NO_PROVIDER', 'No provider configured', true);
  }
  return {
    provider,
    model: PROVIDER_MODELS[provider],
    headers: {},
  };
}

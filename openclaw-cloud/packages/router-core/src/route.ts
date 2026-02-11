import type { Policy } from 'shared';
import { RouterError } from './errors';

export interface RouteRequest {
  userId: string;
  message: string;
  policy: Policy;
}

export interface RouteResult {
  provider: string;
  model: string;
  headers?: Record<string, string>;
}

const PROVIDERS = {
  kimi: { model: 'moonshot-v1', cnOk: true },
  openai: { model: 'gpt-4o', cnOk: false },
} as const;

const POLICY_ORDER: Record<Policy, string[]> = {
  BEST: ['openai', 'kimi'],
  CHEAP: ['kimi', 'openai'],
  CN_OK: ['kimi', 'openai'],
};

export function route(request: RouteRequest): RouteResult {
  const order = POLICY_ORDER[request.policy];
  for (const p of order) {
    const cfg = PROVIDERS[p as keyof typeof PROVIDERS];
    if (cfg) {
      return { provider: p, model: cfg.model, headers: {} };
    }
  }
  throw new RouterError('ROUTER_NO_PROVIDER', 'No available provider', false);
}

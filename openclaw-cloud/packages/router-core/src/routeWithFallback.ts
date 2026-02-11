import type { Policy } from 'shared';
import { RouterError } from './errors';
import { route } from './route';
import { stubCall } from './providers/stub';

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

const POLICY_ORDER: Record<Policy, string[]> = {
  BEST: ['openai', 'kimi'],
  CHEAP: ['kimi', 'openai'],
  CN_OK: ['kimi', 'openai'],
};

export async function routeWithFallback(
  request: RouteRequest,
  options?: { forceFail?: Record<string, boolean> },
): Promise<RouteResult> {
  const order = POLICY_ORDER[request.policy];
  let lastError: Error | null = null;

  const PROVIDERS: Record<string, { model: string }> = {
    kimi: { model: 'moonshot-v1' },
    openai: { model: 'gpt-4o' },
  };

  for (const provider of order) {
    try {
      const { success, latencyMs } = await stubCall(
        provider,
        request.message,
        options?.forceFail?.[provider] ? { forceFail: true } : undefined,
      );
      if (success && PROVIDERS[provider]) {
        return {
          provider,
          model: PROVIDERS[provider].model,
          headers: {},
          latencyMs,
        };
      }
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }

  throw new RouterError(
    'ROUTER_NO_PROVIDER',
    lastError?.message ?? 'All providers failed',
    true,
  );
}

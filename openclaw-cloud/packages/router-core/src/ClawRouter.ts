/**
 * ClawRouter - route(request, ctx) -> decision
 * Internal providerKey/modelKey output; no brand exposure.
 */

import type { RouteRequest, RouteDecision, RouteContext } from './types';
import type { ProviderAdapter } from './providers/ProviderAdapter';
import { computeTotalScore } from './scoring';
import { RouterError } from './errors';

const MAX_FALLBACK_ATTEMPTS = 2;

export interface ClawRouterConfig {
  providers: ProviderAdapter[];
}

export class ClawRouter {
  constructor(private config: ClawRouterConfig) {}

  /**
   * Single routing decision - no fallback execution.
   * Fallback is handled by routeWithFallback().
   */
  route(request: RouteRequest, ctx?: RouteContext): RouteDecision {
    const exclude = ctx?.excludeProviders;
    const candidates = this.config.providers.filter((p) =>
      p.isAllowedForPolicy(request.policy) && !exclude?.has(p.providerKey),
    );

    if (candidates.length === 0) {
      throw new RouterError(
        'ROUTER_NO_PROVIDER',
        `No provider allowed for policy ${request.policy}`,
        false,
      );
    }

    const scores: Record<string, number> = {};
    const healthRegistry = ctx?.healthRegistry;
    const enableExplain = ctx?.enableExplain ?? false;

    let best: ProviderAdapter | null = null;
    let bestScore = -1;

    for (const p of candidates) {
      const health = healthRegistry?.getHealth(p.providerKey);
      const score = computeTotalScore(request, p, health, scores);
      if (score > bestScore) {
        bestScore = score;
        best = p;
      }
    }

    if (!best) {
      throw new RouterError('ROUTER_NO_PROVIDER', 'No viable provider', false);
    }

    const degraded = bestScore < 0.5;
    const queued = request.userPlan === 'starter' && request.policy === 'MAX' && bestScore < 0.6;

    const decision: RouteDecision = {
      providerKey: best.providerKey,
      modelKey: best.modelKey,
      tier: best.tier,
      degraded,
      queued,
    };

    if (enableExplain) {
      decision.explain = {
        scores: { total: bestScore },
        reason: `selected ${best.providerKey} (tier=${best.tier})`,
      };
    }

    return decision;
  }

  /**
   * Route with fallback - executes call, retries on timeout/429/region_not_supported.
   * Max 2 fallback attempts.
   */
  async routeWithFallback<T>(
    request: RouteRequest,
    ctx: RouteContext & { execute: (decision: RouteDecision) => Promise<T> },
  ): Promise<{ result: T; decision: RouteDecision; fallbackCount: number }> {
    let lastError: Error | null = null;
    let attempt = 0;
    const excludeProviders = new Set<string>();

    while (attempt <= MAX_FALLBACK_ATTEMPTS) {
      const routeCtx: RouteContext = {
        ...ctx,
        excludeProviders: excludeProviders.size > 0 ? excludeProviders : undefined,
      };
      const decision = this.route(request, routeCtx);

      try {
        const result = await ctx.execute(decision);
        return { result, decision, fallbackCount: attempt };
      } catch (err) {
        lastError = err as Error;
        const shouldFallback = this.shouldFallback(err);
        if (!shouldFallback || attempt >= MAX_FALLBACK_ATTEMPTS) {
          throw err;
        }
        ctx.healthRegistry?.record429?.(decision.providerKey);
        ctx.healthRegistry?.recordError?.(decision.providerKey);
        excludeProviders.add(decision.providerKey);
        attempt++;
      }
    }

    throw lastError ?? new RouterError('ROUTER_NO_PROVIDER', 'All providers failed', true);
  }

  private shouldFallback(err: unknown): boolean {
    const msg = err instanceof Error ? err.message : String(err);
    const code = (err as { code?: string })?.code;
    return (
      msg.includes('timeout') ||
      msg.includes('Timeout') ||
      code === 'ROUTER_RATE_LIMITED' ||
      code === '429' ||
      msg.includes('region_not_supported') ||
      msg.includes('ECONNREFUSED')
    );
  }

}

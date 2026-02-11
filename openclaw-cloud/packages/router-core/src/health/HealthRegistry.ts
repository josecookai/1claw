/**
 * Provider health registry - rolling metrics.
 * Metrics: latency p50, error rate, last 429, regionSupport.
 */

import type { ProviderHealth, RegionSupport } from '../types';

export interface HealthMetrics {
  latencyP50Ms: number;
  errorRate: number;
  last429At?: number;
  regionSupport: RegionSupport;
}

/** Default metrics when no data */
const DEFAULT: HealthMetrics = {
  latencyP50Ms: 500,
  errorRate: 0,
  regionSupport: 'GLOBAL',
};

export class HealthRegistry {
  private metrics = new Map<string, HealthMetrics>();

  set(providerKey: string, metrics: Partial<HealthMetrics>): void {
    const existing = this.metrics.get(providerKey) ?? { ...DEFAULT };
    this.metrics.set(providerKey, { ...existing, ...metrics });
  }

  get(providerKey: string): ProviderHealth | undefined {
    return this.getHealth(providerKey);
  }

  getHealth(providerKey: string): ProviderHealth | undefined {
    const m = this.metrics.get(providerKey);
    if (!m) return undefined;
    return {
      latencyP50Ms: m.latencyP50Ms,
      errorRate: m.errorRate,
      last429At: m.last429At,
      regionSupport: m.regionSupport,
    };
  }

  record429(providerKey: string): void {
    const existing = this.metrics.get(providerKey) ?? { ...DEFAULT };
    this.metrics.set(providerKey, {
      ...existing,
      last429At: Date.now(),
    });
  }

  recordLatency(providerKey: string, ms: number): void {
    const existing = this.metrics.get(providerKey) ?? { ...DEFAULT };
    const alpha = 0.2;
    const newP50 = existing.latencyP50Ms * (1 - alpha) + ms * alpha;
    this.metrics.set(providerKey, {
      ...existing,
      latencyP50Ms: Math.round(newP50),
    });
  }

  recordError(providerKey: string): void {
    const existing = this.metrics.get(providerKey) ?? { ...DEFAULT };
    const alpha = 0.1;
    const newRate = existing.errorRate * (1 - alpha) + alpha;
    this.metrics.set(providerKey, {
      ...existing,
      errorRate: Math.min(1, newRate),
    });
  }
}

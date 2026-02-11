/**
 * Stub providers - no real API calls.
 * Used for testing routing and fallback logic.
 */
export const STUB_PROVIDERS = ['kimi', 'openai'] as const;

export function stubCall(
  provider: string,
  _message: string,
  options?: { forceFail?: boolean; forceTimeout?: boolean },
): Promise<{ success: boolean; latencyMs: number }> {
  if (options?.forceFail) {
    return Promise.resolve({ success: false, latencyMs: 50 });
  }
  if (options?.forceTimeout) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 10),
    );
  }
  return Promise.resolve({ success: true, latencyMs: 42 });
}

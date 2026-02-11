export interface ProviderResult {
  reply: string;
  provider: string;
  model: string;
  tokens?: number;
  latencyMs: number;
}

export interface ProviderCallOptions {
  prompt: string;
  policy?: string;
}

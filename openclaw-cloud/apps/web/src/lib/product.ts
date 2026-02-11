import type { PlanId, Policy } from 'shared';

export type CompactPlan = {
  id: PlanId;
  name: string;
  price: string;
  credits: number;
  concurrency: number;
  context: string;
  priority: string;
  fallback: string;
  forceMode?: string;
  cta: string;
};

export const PRICING_PLANS: CompactPlan[] = [
  {
    id: 'starter_20',
    name: 'Starter',
    price: '$20 / month',
    credits: 4000,
    concurrency: 1,
    context: '16K',
    priority: 'Standard queue',
    fallback: 'Auto downgrade',
    cta: 'Start $20',
  },
  {
    id: 'max_200',
    name: 'Pro',
    price: '$200 / month',
    credits: 50000,
    concurrency: 5,
    context: '128K',
    priority: 'Priority queue',
    fallback: 'Never freeze: downgrade + queue + top-up',
    forceMode: 'Max performance',
    cta: 'Go Pro $200',
  },
];

export const PAYMENT_METHODS = ['Card', 'Alipay', 'WeChat', 'USDC'];

export const TOPUP_PACKS = [
  { id: 'pack_10', price: '$10', credits: 2000 },
  { id: 'pack_50', price: '$50', credits: 12000 },
] as const;

export const PREFERENCE_OPTIONS: Array<{ id: Policy; title: string; desc: string }> = [
  { id: 'BEST', title: 'AUTO', desc: 'Balanced quality, latency, and availability.' },
  { id: 'CHEAP', title: 'Save money', desc: 'Prefer low-cost routes with graceful downgrade.' },
  { id: 'BEST', title: 'Max performance', desc: 'Prefer strongest route and higher quality output.' },
  { id: 'CN_OK', title: 'CN-friendly', desc: 'Prefer paths optimized for China network stability.' },
];

export type OnboardingSelection = {
  plan: PlanId;
  preference: Policy;
};

const STORAGE_KEY = 'openclaw_onboarding_v2';

export function loadSelection(): OnboardingSelection {
  if (typeof window === 'undefined') {
    return { plan: 'starter_20', preference: 'BEST' };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { plan: 'starter_20', preference: 'BEST' };
    const parsed = JSON.parse(raw) as OnboardingSelection;
    if (!parsed.plan || !parsed.preference) return { plan: 'starter_20', preference: 'BEST' };
    return parsed;
  } catch {
    return { plan: 'starter_20', preference: 'BEST' };
  }
}

export function saveSelection(next: OnboardingSelection) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export type PlanId = "starter_20" | "max_200";
export type Policy = "BEST" | "CHEAP" | "CN_OK";

export const PRICING_PLANS = [
  {
    id: "starter_20" as const,
    name: "Starter",
    price: "$20 / month",
    credits: 4000,
    concurrency: 1,
    context: "16K",
    priority: "Standard queue",
    fallback: "Auto downgrade",
  },
  {
    id: "max_200" as const,
    name: "Pro",
    price: "$200 / month",
    credits: 50000,
    concurrency: 5,
    context: "128K",
    priority: "Priority queue",
    fallback: "Never freeze: downgrade + queue + top-up",
    forceMode: "Max performance",
  },
];

export const PAYMENT_METHODS = ["Card", "Alipay", "WeChat", "USDC"];

export const TOPUP_PACKS = [
  { id: "pack_10", price: "$10", credits: 2000 },
  { id: "pack_50", price: "$50", credits: 12000 },
] as const;

export type PreferenceKey = "AUTO" | "SAVE" | "MAX" | "CN";

export const PREFERENCES: Array<{ key: PreferenceKey; title: string; desc: string; policy: Policy }> = [
  { key: "AUTO", title: "AUTO", desc: "Balanced quality and cost", policy: "BEST" },
  { key: "SAVE", title: "Save money", desc: "Lower cost preference", policy: "CHEAP" },
  { key: "MAX", title: "Max performance", desc: "Best quality preference", policy: "BEST" },
  { key: "CN", title: "CN-friendly", desc: "Regional availability preference", policy: "CN_OK" },
];

const STORAGE_KEY = "openclaw_unified_selection";

export type Selection = {
  plan: PlanId;
  preference: Policy;
};

export function loadSelection(): Selection {
  if (typeof window === "undefined") {
    return { plan: "starter_20", preference: "BEST" };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { plan: "starter_20", preference: "BEST" };
    const parsed = JSON.parse(raw) as Selection;
    if (!parsed.plan || !parsed.preference) return { plan: "starter_20", preference: "BEST" };
    return parsed;
  } catch {
    return { plan: "starter_20", preference: "BEST" };
  }
}

export function saveSelection(next: Selection) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

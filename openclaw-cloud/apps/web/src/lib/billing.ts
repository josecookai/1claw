const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createSubscriptionCheckout(plan: 'starter' | 'pro'): Promise<{ url: string }> {
  const res = await fetch(`${API_BASE}/v1/billing/checkout/subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Failed to create checkout');
  }
  return res.json();
}

export async function createTopupCheckout(pack: 'topup10' | 'topup50'): Promise<{ url: string }> {
  const res = await fetch(`${API_BASE}/v1/billing/checkout/topup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ pack }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Failed to create checkout');
  }
  return res.json();
}

export async function createPortalSession(): Promise<{ url: string }> {
  const res = await fetch(`${API_BASE}/v1/billing/portal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Failed to open billing portal');
  }
  return res.json();
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}

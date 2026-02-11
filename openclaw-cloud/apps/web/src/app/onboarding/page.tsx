'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { PLANS, POLICIES, type PlanId, type Policy } from 'shared';

const STORAGE_KEY = 'openclaw_onboarding';
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

interface OnboardingState {
  step: number;
  plan: PlanId;
  policy: Policy;
  bindCode?: string;
}

function loadState(): OnboardingState {
  if (typeof window === 'undefined') {
    return { step: 1, plan: 'pro_40', policy: 'BEST' };
  }
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s) as OnboardingState;
  } catch {}
  return { step: 1, plan: 'pro_40', policy: 'BEST' };
}

function saveState(state: OnboardingState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export default function OnboardingPage() {
  const [state, setState] = useState<OnboardingState>(loadState);

  const update = useCallback((patch: Partial<OnboardingState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      saveState(next);
      return next;
    });
  }, []);

  const nextStep = useCallback(async () => {
    if (state.step < 3) {
      if (state.step === 2) {
        try {
          const res = await fetch(`${API_BASE}/v1/onboarding/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan: state.plan, policy: state.policy }),
          });
          const data = await res.json();
          if (data.bindCode) {
            update({ step: 3, bindCode: data.bindCode });
          }
        } catch {
          update({ step: 3, bindCode: 'OC-ERR' });
        }
      } else {
        update({ step: state.step + 1 });
      }
    }
  }, [state.step, state.plan, state.policy, update]);

  const prevStep = useCallback(() => {
    if (state.step > 1) update({ step: state.step - 1 });
  }, [state.step, update]);

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← 返回
      </Link>
      <h1 className="mt-6 text-2xl font-bold">三步上手</h1>
      <p className="mt-2 text-muted-foreground">
        选套餐 → 选档位 → 绑定 Telegram，全程无需配置云厂商
      </p>

      <div className="mt-8">
        {/* Step 1: 选套餐 */}
        {state.step === 1 && (
          <section>
            <h2 className="text-lg font-semibold">步骤 1：选择套餐</h2>
            <div className="mt-4 grid gap-3">
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => update({ plan: p.id })}
                  className={`rounded-xl border p-4 text-left transition ${
                    state.plan === p.id
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold">{p.label}</p>
                  <p className="text-lg font-bold text-primary">{p.price}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Step 2: 选档位 */}
        {state.step === 2 && (
          <section>
            <h2 className="text-lg font-semibold">步骤 2：选择能力档位</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              不选具体模型品牌，由系统自动路由
            </p>
            <div className="mt-4 grid gap-3">
              {POLICIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => update({ policy: p.id })}
                  className={`rounded-xl border p-4 text-left transition ${
                    state.policy === p.id
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold">{p.label}</p>
                  <p className="text-sm text-muted-foreground">{p.hint}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Step 3: bindCode */}
        {state.step === 3 && (
          <section>
            <h2 className="text-lg font-semibold">步骤 3：绑定 Telegram</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              复制下方绑定码，在 Telegram 中发送给 Bot
            </p>
            <div className="mt-6 rounded-xl border bg-muted/30 p-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                绑定码
              </p>
              <p className="mt-2 font-mono text-2xl font-bold">
                {state.bindCode ?? '-'}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                在 Telegram 中打开 Bot，发送：<code className="bg-muted px-1 rounded">/bind {state.bindCode}</code>
              </p>
              <a
                href="https://t.me/OpenClawBot"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-lg bg-[#0088cc] px-4 py-2 text-sm font-medium text-white"
              >
                打开 Telegram Bot
              </a>
            </div>
          </section>
        )}

        <div className="mt-8 flex gap-4">
          {state.step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="rounded-lg border px-4 py-2 text-sm font-medium"
            >
              上一步
            </button>
          )}
          {state.step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              下一步
            </button>
          ) : (
            <Link
              href="/console"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              进入 Console
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

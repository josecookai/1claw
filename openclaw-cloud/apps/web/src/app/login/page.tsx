'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

function ClawIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-4"
    >
      <path
        d="M24 8c-2 4-4 10-4 16s2 12 4 16M16 14c-2 2-4 6-4 10s2 8 4 10M32 14c2 2 4 6 4 10s-2 8-4 10M20 20l-4 12M28 20l4 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </svg>
  );
}

function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm font-medium text-[var(--ink)] transition hover:border-[#d4d4d4]"
    >
      {icon}
      {label}
    </button>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? 'Login failed');
        return;
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        if (returnUrl) {
          const sep = returnUrl.includes('?') ? '&' : '?';
          window.location.href = `${returnUrl}${sep}userId=${encodeURIComponent(data.userId)}`;
          return;
        }
        router.push('/console');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = email.trim() && password.length >= 6 && !loading;

  return (
    <div className="min-h-screen bg-[var(--surface)] bg-dots flex items-center justify-center px-4 py-12">
      <main className="w-full max-w-md">
        <ClawIcon />
        <h1 className="text-center text-2xl font-bold text-[var(--ink)]">
          Sign in or sign up
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--ink-muted)]">
          Start creating with 1Claw
        </p>

        <div className="mt-8 space-y-3">
          <SocialButton
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.59c1.52-1.4 2.39-3.46 2.39-5.91z" />
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2c-.72.48-1.64.77-2.7.77-2.08 0-3.85-1.4-4.48-3.42H1.83v2.07C3.17 15.99 5.9 17 8.98 17z" />
                <path fill="#FBBC05" d="M4.5 10.42c-.17-.48-.27-1-.27-1.52s.1-1.04.27-1.52V5.41H1.83A8.989 8.989 0 000 9c0 1.45.35 2.82.97 4.04l2.53-2.04z" />
                <path fill="#EA4335" d="M8.98 3.58c1.17 0 2.23.4 3.06 1.2l2.3-2.3C12.94 1.09 11.14 0 8.98 0 5.9 0 3.17 1.01 1.83 2.96L4.36 5A5.43 5.43 0 018.98 3.58z" />
              </svg>
            }
            label="Continue with Google"
            onClick={() => { window.location.href = `${API_BASE}/v1/auth/google`; }}
          />
          <SocialButton
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            }
            label="Continue with GitHub"
            onClick={() => {
              window.location.href = `${API_BASE}/v1/auth/github`;
            }}
          />
          <SocialButton
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            }
            label="Continue with Apple"
            onClick={() => console.info('Apple OAuth coming soon')}
          />
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--line)]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[var(--surface)] px-3 text-sm text-[var(--ink-muted)]">Or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              {loading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
              ) : (
                <span className="inline-block h-4 w-4 rounded-full border-2 border-green-500 border-t-transparent" />
              )}
              <span className="text-sm text-[var(--ink)]">
                {loading ? 'Verifying...' : 'Verification'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[var(--ink-muted)]">
              <Link href="/privacy" className="hover:text-[var(--ink)]">Privacy</Link>
              <Link href="/terms" className="hover:text-[var(--ink)]">Terms</Link>
              <span className="flex items-center gap-1">
                <span className="text-orange-500 font-semibold">Cloudflare</span>
              </span>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#404040]"
          >
            {loading ? '...' : 'Continue'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--ink-muted)]">
          No account? <Link href={returnUrl ? `/register?returnUrl=${encodeURIComponent(returnUrl)}` : '/register'} className="underline hover:text-[var(--ink)]">Register</Link>
        </p>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--surface)] flex items-center justify-center"><span className="animate-spin">...</span></div>}>
      <LoginForm />
    </Suspense>
  );
}

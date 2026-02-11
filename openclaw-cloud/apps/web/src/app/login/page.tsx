'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function LoginPage() {
  const router = useRouter();
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
            onClick={() => console.info('Google OAuth coming soon')}
          />
          <SocialButton
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#f25022" d="M1 1h7v7H1z" />
                <path fill="#00a4ef" d="M10 1h7v7h-7z" />
                <path fill="#7fba00" d="M1 10h7v7H1z" />
                <path fill="#ffb900" d="M10 10h7v7h-7z" />
              </svg>
            }
            label="Continue with Microsoft"
            onClick={() => console.info('Microsoft OAuth coming soon')}
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
          No account? <Link href="/register" className="underline hover:text-[var(--ink)]">Register</Link>
        </p>
      </main>
    </div>
  );
}

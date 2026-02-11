'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function AuthCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    const token = params.get('token');
    const userId = params.get('userId');
    const error = params.get('error');

    if (error) {
      setStatus('error');
      return;
    }

    if (token && userId) {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      setStatus('done');
      router.replace('/console');
    } else {
      setStatus('error');
    }
  }, [params, router]);

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">OAuth sign-in failed. Missing token or userId.</p>
          <a href="/login" className="mt-4 inline-block text-sm underline">Back to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--ink)] border-t-transparent" />
        <p className="mt-4 text-sm text-[var(--ink-muted)]">Signing you in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--ink)] border-t-transparent" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

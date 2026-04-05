'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';
import { cn } from '@/src/shared/lib/cn';
import { useAuthStore } from '@/src/shared/lib/supabase';
import type { Provider } from '@supabase/supabase-js';

export default function LoginPage() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const authLoading = useAuthStore((state) => state.loading);

  useEffect(() => {
    if (session) {
      router.replace('/feed');
    }
  }, [session, router]);

  const supabase = createClient();

  const signInWithProvider = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });

    if (error) {
      console.error('OAuth error:', error);
    }
  };

  type ProviderInfo = {
    provider: Provider;
    label: string;
    color: string;
  };

  const providers: ProviderInfo[] = [
    { provider: 'kakao' as Provider, label: '카카오톡', color: 'amber' },
    { provider: 'x' as Provider, label: 'X (트위터)', color: 'blue' },
    { provider: 'custom:line' as Provider, label: '라인', color: 'green' },
  ];

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            소셜 계정으로 간편하게 로그인하세요.
          </p>
        </div>
        <div className="space-y-3">
          {providers.map(({ provider, label, color }) => (
            <button
              key={label}
              type="button"
              onClick={() => signInWithProvider(provider)}
              className={cn(
                'group relative flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none',
                `${color}-500 focus:ring-${color}-500`,
              )}
            >
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

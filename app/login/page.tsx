'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import Link from 'next/link';

import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/src/shared/store/auth-store';
import type { Provider } from '@supabase/supabase-js';

type ProviderInfo = {
  provider: Provider;
  label: string;
  icon: React.ReactNode;
  className: string;
};

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.582 2 11c0 2.823 1.666 5.308 4.208 6.858-.18.672-.654 2.436-.75 2.814-.12.463.17.457.357.332.147-.097 2.342-1.594 3.29-2.24.614.088 1.244.136 1.895.136 5.523 0 10-3.582 10-8S17.523 3 12 3z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

const providers: ProviderInfo[] = [
  {
    provider: 'kakao' as Provider,
    label: '카카오로 계속하기',
    icon: <KakaoIcon />,
    className:
      'bg-[#FEE500] text-[#191919] hover:bg-[#f0d800] active:bg-[#e0c900]',
  },
  {
    provider: 'x' as Provider,
    label: 'X로 계속하기',
    icon: <XIcon />,
    className: 'bg-black text-white hover:bg-zinc-800 active:bg-zinc-900',
  },
  {
    provider: 'custom:line' as Provider,
    label: '라인으로 계속하기',
    icon: <LineIcon />,
    className:
      'bg-[#06C755] text-white hover:bg-[#05b34c] active:bg-[#049e43]',
  },
];

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
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      console.error('OAuth error:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ab2c5d] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-white px-6 pb-10 pt-24">
      {/* 브랜드 영역 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#ab2c5d] shadow-lg shadow-[#ab2c5d]/30">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            환영합니다
          </h1>
          <p className="text-[15px] leading-relaxed text-gray-500">
            소셜 계정으로 빠르게 시작하세요
          </p>
        </div>
      </div>

      {/* 로그인 버튼 영역 */}
      <div className="w-full max-w-sm space-y-3">
        {providers.map(({ provider, label, icon, className }) => (
          <button
            key={provider}
            type="button"
            onClick={() => signInWithProvider(provider)}
            className={`flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-[15px] font-semibold transition-all duration-150 active:scale-[0.98] ${className}`}
          >
            <span className="flex-shrink-0">{icon}</span>
            <span>{label}</span>
          </button>
        ))}

        <p className="pt-2 text-center text-xs text-gray-400">
          로그인 시{' '}
          <Link href="/terms" className="underline underline-offset-2 hover:text-gray-600">
            서비스 이용약관
          </Link>{' '}
          및{' '}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-gray-600">
            개인정보 처리방침
          </Link>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}

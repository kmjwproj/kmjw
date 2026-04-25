'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';
import { useMutation } from '@tanstack/react-query';
import { useFunnel } from '@use-funnel/browser';

import BasicInfoStep from './BasicInfoStep';
import CompleteStep from './CompleteStep';
import InterestsStep from './InterestsStep';
import MbtiStep from './MbtiStep';
import NicknameStep from './NicknameStep';
import PhotoStep from './PhotoStep';
import type { OnboardFunnel } from './types';

const supabase = createClient();

type OnboardPayload = Omit<OnboardFunnel['Complete'], 'onboarded'>;

const submitOnboard = async (payload: OnboardPayload): Promise<void> => {
  const res = await fetch('/api/onboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  await supabase.auth.refreshSession();
};

export default function OnboardPage() {
  const router = useRouter();

  const funnel = useFunnel<OnboardFunnel>({
    id: 'onboard',
    initial: { step: 'Nickname', context: {} },
  });

  const onboardMutation = useMutation({
    mutationFn: submitOnboard,
    onSuccess: () => router.replace('/feed'),
  });

  useEffect(() => {
    if (funnel.step !== 'Complete') return;
    const { nickname, profile_image, gender, age_range, interests, mbti } =
      funnel.context as OnboardFunnel['Complete'];
    onboardMutation.mutate({
      nickname,
      profile_image,
      gender,
      age_range,
      interests,
      mbti,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funnel.step]);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">환영합니다!</h1>
          <p className="text-muted-foreground">프로필을 완성해주세요.</p>
          {funnel.step !== 'Complete' && (
            <>
              <div className="bg-muted mt-4 h-2 w-full rounded-full">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${((funnel.index + 1) / 5) * 100}%` }}
                />
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                {funnel.index + 1}/5
              </p>
            </>
          )}
        </div>

        {onboardMutation.isError && (
          <p className="text-destructive mb-4 text-center text-sm">
            저장 실패: {onboardMutation.error?.message}
          </p>
        )}

        <funnel.Render
          Nickname={({ context, history }) => (
            <NicknameStep context={context} history={history} />
          )}
          Photo={({ context, history }) => (
            <PhotoStep context={context} history={history} />
          )}
          BasicInfo={({ context, history }) => (
            <BasicInfoStep context={context} history={history} />
          )}
          Interests={({ context, history }) => (
            <InterestsStep context={context} history={history} />
          )}
          Mbti={({ context, history }) => (
            <MbtiStep context={context} history={history} />
          )}
          Complete={() => <CompleteStep />}
        />
      </div>
    </div>
  );
}

'use client'

import { useEffect } from 'react'

import { useFunnel } from '@use-funnel/browser'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

import BasicInfoStep from './BasicInfoStep'
import CompleteStep from './CompleteStep'
import InterestsStep from './InterestsStep'
import NicknameStep from './NicknameStep'
import PhotoStep from './PhotoStep'
import type { OnboardFunnel } from './types'

const supabase = createClient()

type OnboardPayload = Omit<OnboardFunnel['Complete'], 'onboarded'>

const submitOnboard = async (payload: OnboardPayload): Promise<void> => {
  const res = await fetch('/api/onboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }
  await supabase.auth.refreshSession()
}

export default function OnboardPage() {
  const router = useRouter()

  const funnel = useFunnel<OnboardFunnel>({
    id: 'onboard',
    initial: { step: 'Nickname', context: {} }
  })

  const onboardMutation = useMutation({
    mutationFn: submitOnboard,
    onSuccess: () => router.replace('/feed'),
  })

  useEffect(() => {
    if (funnel.step !== 'Complete') return
    const { nickname, profile_image, gender, age_range, interests } = funnel.context as OnboardFunnel['Complete']
    onboardMutation.mutate({ nickname, profile_image, gender, age_range, interests })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funnel.step])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">환영합니다!</h1>
          <p className="text-muted-foreground">프로필을 완성해주세요.</p>
          <div className="w-full bg-muted h-2 rounded-full mt-4">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(funnel.index / 4) * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{funnel.index + 1}/4</p>
        </div>

        {onboardMutation.isError && (
          <p className="text-destructive mb-4 text-sm text-center">
            저장 실패: {onboardMutation.error?.message}
          </p>
        )}

        <funnel.Render
          Nickname={({ context, history }) => <NicknameStep context={context} history={history} />}
          Photo={({ context, history }) => <PhotoStep context={context} history={history} />}
          BasicInfo={({ context, history }) => <BasicInfoStep context={context} history={history} />}
          Interests={({ context, history }) => <InterestsStep context={context} history={history} />}
          Complete={() => <CompleteStep />}
        />
      </div>
    </div>
  )
}

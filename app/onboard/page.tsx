'use client'

import { useFunnel } from '@use-funnel/browser'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient, useAuthStore } from '@/src/shared/lib/supabase'
const supabase = createBrowserClient()

// 타입 정의
type OnboardFunnel = {
  Nickname: { nickname?: string }
  Photo: { nickname: string; profile_image?: string }
  BasicInfo: { nickname: string; profile_image: string; gender?: string; age_range?: string; bio?: string }
  Interests: { nickname: string; profile_image: string; gender: string; age_range: string; interests: string[] }
  Complete: { nickname: string; profile_image: string; gender: string; age_range: string; interests: string[]; onboarded: true }
}

export default function OnboardPage() {
  const router = useRouter()
  const { fetchSession } = useAuthStore()

  const funnel = useFunnel<OnboardFunnel>({
    id: 'onboard',
    initial: { step: 'Nickname', context: {} }
  })

  // Complete 시 Supabase 업데이트 후 리다이렉트
  useEffect(() => {
    if (funnel.step === 'Complete') {
      const { nickname, profile_image, gender, age_range, interests } = funnel.context as OnboardFunnel['Complete']
      supabase.auth.updateUser({
        data: {
          nickname,
          profile_image,
          gender,
          age_range,
          interests,
          onboarded: true
        }
      }).then(({ data, error }) => {
        if (!error) {
          router.replace('/feed')
        }
      })
    }
  }, [funnel.step, funnel.context, router])

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

        <funnel.Render
          Nickname={({ history }) => (
            <div>
              <h2 className="text-2xl font-semibold mb-4">닉네임을 입력해주세요</h2>
              <input 
                type="text" 
                placeholder="닉네임"
                className="w-full p-3 border rounded-lg mb-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    history.push('Photo', { nickname: e.currentTarget.value })
                  }
                }}
              />
              <button 
                className="w-full bg-primary text-primary-foreground p-3 rounded-lg"
                onClick={() => history.push('Photo', (prev) => ({ ...prev, nickname: '테스트닉네임' }))}
              >
                다음
              </button>
            </div>
          )}
          Photo={({ context, history }) => (
            <div>
              <h2 className="text-2xl font-semibold mb-4">프로필 사진을 선택해주세요</h2>
              <div className="w-24 h-24 bg-muted rounded-full mb-4 flex items-center justify-center mx-auto">
                📷
              </div>
              <p className="text-muted-foreground mb-4 text-center">카메라 또는 갤러리에서 선택</p>
              <button 
                className="w-full bg-primary text-primary-foreground p-3 rounded-lg mb-2"
                onClick={() => history.push('BasicInfo', (prev) => ({ ...prev, profile_image: 'storage/placeholder.jpg' }))}
              >
                다음
              </button>
              <button 
                className="w-full border p-3 rounded-lg"
                onClick={() => history.back()}
              >
                이전
              </button>
            </div>
          )}
          BasicInfo={({ context, history }) => (
            <div>
              <h2 className="text-2xl font-semibold mb-4">기본 정보를 입력해주세요</h2>
              <select className="w-full p-3 border rounded-lg mb-2">
                <option>성별 선택</option>
                <option>남성</option>
                <option>여성</option>
              </select>
              <select className="w-full p-3 border rounded-lg mb-4">
                <option>연령대 선택</option>
                <option>10대</option>
                <option>20대</option>
              </select>
              <button 
                className="w-full bg-primary text-primary-foreground p-3 rounded-lg mb-2"
                onClick={() => history.push('Interests', (prev) => ({ ...prev, gender: 'male', age_range: '20s' }))}
              >
                다음
              </button>
              <button 
                className="w-full border p-3 rounded-lg"
                onClick={() => history.back()}
              >
                이전
              </button>
            </div>
          )}
          Interests={({ context, history }) => (
            <div>
              <h2 className="text-2xl font-semibold mb-4">관심사를 선택해주세요</h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <label className="flex items-center p-2 border rounded">
                  <input type="checkbox" className="mr-2" />
                  스포츠
                </label>
                <label className="flex items-center p-2 border rounded">
                  <input type="checkbox" className="mr-2" />
                  여행
                </label>
              </div>
              <button 
                className="w-full bg-primary text-primary-foreground p-3 rounded-lg mb-2"
                onClick={() => history.push('Complete', (prev) => ({ ...prev, interests: ['스포츠', '여행'] }))}
              >
                완료
              </button>
              <button 
                className="w-full border p-3 rounded-lg"
                onClick={() => history.back()}
              >
                이전
              </button>
            </div>
          )}
          Complete={() => (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">완료되었습니다!</h2>
              <p>프로필이 저장되고 메인 피드로 이동합니다.</p>
            </div>
          )}
        />
      </div>
    </div>
  )
}
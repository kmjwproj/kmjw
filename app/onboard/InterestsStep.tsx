'use client'

import { useRef } from 'react'
import type { OnboardFunnel, StepHistory } from './types'

type CurrentContext = OnboardFunnel['Interests']

interface Props {
  context: CurrentContext
  history: StepHistory<CurrentContext>
}

export default function InterestsStep({ context, history }: Props) {
  const sportsRef = useRef<HTMLInputElement>(null)
  const travelRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">관심사를 선택해주세요</h2>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <label className="flex items-center p-2 border rounded">
          <input ref={sportsRef} type="checkbox" className="mr-2" />
          스포츠
        </label>
        <label className="flex items-center p-2 border rounded">
          <input ref={travelRef} type="checkbox" className="mr-2" />
          여행
        </label>
      </div>
      <button
        className="w-full bg-primary text-primary-foreground p-3 rounded-lg mb-2"
        onClick={() => {
          const interests: string[] = []
          if (sportsRef.current?.checked) interests.push('스포츠')
          if (travelRef.current?.checked) interests.push('여행')
          history.push('Complete', (prev) => ({ ...prev, interests, onboarded: true }))
        }}
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
  )
}

'use client'

import { useRef } from 'react'
import type { OnboardFunnel, StepHistory } from './types'

type CurrentContext = OnboardFunnel['Nickname']

interface Props {
  context: CurrentContext
  history: StepHistory<CurrentContext>
}

export default function NicknameStep({ context, history }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">닉네임을 입력해주세요</h2>
      <input
        ref={inputRef}
        type="text"
        placeholder="닉네임"
        className="w-full p-3 border rounded-lg mb-4"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            history.push('Photo', () => ({ nickname: e.currentTarget.value }))
          }
        }}
      />
      <button
        className="w-full bg-primary text-primary-foreground p-3 rounded-lg"
        onClick={() => history.push('Photo', () => ({ nickname: inputRef.current?.value ?? '' }))}
      >
        다음
      </button>
    </div>
  )
}

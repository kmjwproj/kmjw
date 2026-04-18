'use client'

import { useRef } from 'react'
import type { StepProps } from './types'

export default function BasicInfoStep({ context: _context, history }: StepProps<'BasicInfo'>) {
  const genderRef = useRef<HTMLSelectElement>(null)
  const ageRangeRef = useRef<HTMLSelectElement>(null)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">기본 정보를 입력해주세요</h2>
      <select ref={genderRef} className="w-full p-3 border rounded-lg mb-2">
        <option value="">성별 선택</option>
        <option value="male">남성</option>
        <option value="female">여성</option>
      </select>
      <select ref={ageRangeRef} className="w-full p-3 border rounded-lg mb-4">
        <option value="">연령대 선택</option>
        <option value="10s">10대</option>
        <option value="20s">20대</option>
      </select>
      <button
        className="w-full bg-primary text-primary-foreground p-3 rounded-lg mb-2"
        onClick={() => history.push('Interests', (prev: StepProps<'BasicInfo'>['context']) => ({
          ...prev,
          gender: genderRef.current?.value ?? '',
          age_range: ageRangeRef.current?.value ?? '',
          interests: [],
        }))}
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
  )
}

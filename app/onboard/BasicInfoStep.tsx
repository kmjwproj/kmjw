'use client';

import { useRef, useState } from 'react';

import type { StepProps } from './types';

export default function BasicInfoStep({
  context,
  history,
}: StepProps<'BasicInfo'>) {
  const genderRef = useRef<HTMLSelectElement>(null);
  const ageRangeRef = useRef<HTMLSelectElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    const gender = genderRef.current?.value;
    const ageRange = ageRangeRef.current?.value;

    if (!gender) {
      setError('성별을 선택해주세요.');
      return;
    }
    if (!ageRange) {
      setError('연령대를 선택해주세요.');
      return;
    }

    setError(null);
    history.push('Interests', (prev: StepProps<'BasicInfo'>['context']) => ({
      ...prev,
      gender,
      age_range: ageRange,
    }));
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">기본 정보를 입력해주세요</h2>
      <select
        ref={genderRef}
        className="mb-2 w-full rounded-lg border p-3"
        defaultValue={context.gender ?? ''}
        onChange={() => setError(null)}
      >
        <option value="">성별 선택</option>
        <option value="male">남성</option>
        <option value="female">여성</option>
      </select>
      <select
        ref={ageRangeRef}
        className="mb-4 w-full rounded-lg border p-3"
        defaultValue={context.age_range ?? ''}
        onChange={() => setError(null)}
      >
        <option value="">연령대 선택</option>
        <option value="10s">10대</option>
        <option value="20s">20대</option>
        <option value="30s">30대</option>
      </select>
      {error && <p className="text-destructive mb-4 text-sm">{error}</p>}
      <button
        className="bg-primary text-primary-foreground mb-2 w-full rounded-lg p-3"
        onClick={handleNext}
      >
        다음
      </button>
      <button
        className="w-full rounded-lg border p-3"
        onClick={() => history.back()}
      >
        이전
      </button>
    </div>
  );
}

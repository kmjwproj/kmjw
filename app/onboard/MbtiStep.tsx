'use client';

import { useState } from 'react';

import type { StepProps } from './types';

const MBTI_TYPES = [
  'INTJ',
  'INTP',
  'ENTJ',
  'ENTP',
  'INFJ',
  'INFP',
  'ENFJ',
  'ENFP',
  'ISTJ',
  'ISFJ',
  'ESTJ',
  'ESFJ',
  'ISTP',
  'ISFP',
  'ESTP',
  'ESFP',
];

export default function MbtiStep({ context, history }: StepProps<'Mbti'>) {
  const [selected, setSelected] = useState<string>(context.mbti ?? '');

  return (
    <div>
      <h2 className="mb-1 text-2xl font-semibold">MBTI를 선택해주세요</h2>
      <p className="text-muted-foreground mb-5 text-sm">
        모르면 넘어가도 괜찮아요
      </p>

      <div className="mb-6 grid grid-cols-4 gap-2">
        {MBTI_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelected((prev) => (prev === type ? '' : type))}
            className={[
              'rounded-lg border py-2.5 text-sm font-semibold transition-all',
              selected === type
                ? 'border-primary bg-primary text-primary-foreground scale-105'
                : 'border-border bg-background text-foreground active:scale-95',
            ].join(' ')}
          >
            {type}
          </button>
        ))}
      </div>

      <button
        className="bg-primary text-primary-foreground mb-2 w-full rounded-lg p-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!selected}
        onClick={() =>
          history.push('Complete', (prev: StepProps<'Mbti'>['context']) => ({
            ...prev,
            mbti: selected,
            onboarded: true as const,
          }))
        }
      >
        완료
      </button>
      <button
        className="mb-2 w-full rounded-lg border p-3"
        onClick={() =>
          history.push('Complete', (prev: StepProps<'Mbti'>['context']) => ({
            ...prev,
            mbti: '',
            onboarded: true as const,
          }))
        }
      >
        모르겠어요 (건너뛰기)
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

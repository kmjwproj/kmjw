'use client';

import { useState } from 'react';

import type { StepProps } from './types';

const INTERESTS = [
  { emoji: '☕', label: '카페투어' },
  { emoji: '✈️', label: '여행' },
  { emoji: '🍜', label: '맛집탐방' },
  { emoji: '🎵', label: '음악' },
  { emoji: '🎬', label: '영화/드라마' },
  { emoji: '📸', label: '사진' },
  { emoji: '👗', label: '패션' },
  { emoji: '🏃', label: '운동' },
  { emoji: '🎮', label: '게임' },
  { emoji: '📚', label: '독서' },
  { emoji: '🍳', label: '요리' },
  { emoji: '🌿', label: '아웃도어' },
  { emoji: '🎨', label: '전시/공연' },
  { emoji: '🚗', label: '드라이브' },
  { emoji: '💄', label: '뷰티' },
  { emoji: '🐾', label: '반려동물' },
];

const MIN = 1;
const MAX = 5;

export default function InterestsStep({
  context,
  history,
}: StepProps<'Interests'>) {
  const [selected, setSelected] = useState<string[]>(context.interests ?? []);

  const toggle = (label: string) => {
    setSelected((prev) => {
      if (prev.includes(label)) return prev.filter((i) => i !== label);
      if (prev.length >= MAX) return prev;
      return [...prev, label];
    });
  };

  const canProceed = selected.length >= MIN;

  return (
    <div>
      <h2 className="mb-1 text-2xl font-semibold">관심사를 선택해주세요</h2>
      <p className="text-muted-foreground mb-5 text-sm">
        최대 {MAX}개 선택 &middot; 현재 {selected.length}개
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {INTERESTS.map(({ emoji, label }) => {
          const isSelected = selected.includes(label);
          const isDisabled = !isSelected && selected.length >= MAX;
          return (
            <button
              key={label}
              onClick={() => toggle(label)}
              disabled={isDisabled}
              className={[
                'flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground scale-105'
                  : isDisabled
                    ? 'border-muted bg-muted/30 text-muted-foreground cursor-not-allowed opacity-50'
                    : 'border-border bg-background text-foreground active:scale-95',
              ].join(' ')}
            >
              <span>{emoji}</span>
              {label}
            </button>
          );
        })}
      </div>

      <button
        disabled={!canProceed}
        className="bg-primary text-primary-foreground mb-2 w-full rounded-lg p-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() =>
          history.push('Mbti', (prev: StepProps<'Interests'>['context']) => ({
            ...prev,
            interests: selected,
          }))
        }
      >
        완료
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

'use client';

import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

import type { StepProps } from './types';

const supabase = createClient();

export default function NicknameStep({
  context,
  history,
}: StepProps<'Nickname'>) {
  const [nickname, setNickname] = useState(context.nickname ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleNext = async () => {
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', nickname.trim())
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setError('이미 사용 중인 닉네임입니다.');
        return;
      }

      history.push('Photo', () => ({ nickname: nickname.trim() }));
    } catch (err) {
      console.error(err);
      setError('닉네임 확인 중 오류가 발생했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">닉네임을 입력해주세요</h2>
      <input
        type="text"
        placeholder="닉네임"
        className="mb-2 w-full rounded-lg border p-3"
        value={nickname}
        onChange={(e) => {
          setNickname(e.target.value);
          setError(null);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleNext();
        }}
      />
      {error && <p className="text-destructive mb-4 text-sm">{error}</p>}
      <button
        className="bg-primary text-primary-foreground w-full rounded-lg p-3 disabled:opacity-50"
        onClick={handleNext}
        disabled={isChecking}
      >
        {isChecking ? '확인 중...' : '다음'}
      </button>
    </div>
  );
}

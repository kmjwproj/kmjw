'use client';

import { useEffect, useRef } from 'react';

import Image from 'next/image';

import { getImageUrl } from '@/src/entities/user/api/profile';
import confetti from 'canvas-confetti';

import type { Profile } from '../model/use-chat-room';

type MatchCardMode = 'request-received' | 'request-sent' | 'matched';

type Props = {
  myProfile: Profile;
  otherProfile: Profile;
  mode: MatchCardMode;
  onDismiss: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  accepting?: boolean;
  declining?: boolean;
};

export function MatchCard({
  myProfile,
  otherProfile,
  mode,
  onDismiss,
  onAccept,
  onReject,
  accepting = false,
  declining = false,
}: Props) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (mode !== 'matched') return;
    if (firedRef.current) return;
    firedRef.current = true;

    confetti({
      particleCount: 120,
      spread: 100,
      startVelocity: 40,
      origin: { x: 0.5, y: 0.35 },
      colors: ['#ff6b9d', '#ffd93d', '#6bcb77', '#4d96ff', '#c084fc'],
    });
  }, [mode]);

  return (
    <div className="shrink-0 px-4 pt-3">
      <div className="bg-background mx-auto w-full max-w-[360px] rounded-[28px] px-6 py-7">
        {mode === 'request-received' && (
          <RequestReceivedContent
            otherProfile={otherProfile}
            onAccept={onAccept}
            onReject={onReject}
            accepting={accepting}
            declining={declining}
          />
        )}

        {mode === 'request-sent' && (
          <RequestSentContent otherProfile={otherProfile} />
        )}

        {mode === 'matched' && (
          <MatchedContent myProfile={myProfile} otherProfile={otherProfile} />
        )}
      </div>
    </div>
  );
}

function RequestReceivedContent({
  otherProfile,
  onAccept,
  onReject,
  accepting,
  declining,
}: {
  otherProfile: Profile;
  onAccept?: () => void;
  onReject?: () => void;
  accepting: boolean;
  declining: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <ProfileAvatar profile={otherProfile} size="lg" />

      <p className="mt-6 text-xl font-bold tracking-tight">
        {otherProfile.nickname}님이
      </p>
      <p className="mt-1 text-xl font-bold tracking-tight">채팅을 요청했어요</p>

      <p className="text-muted-foreground mt-3 text-sm leading-6">
        요청을 수락하면 대화를 시작할 수 있어요
      </p>

      <div className="mt-6 flex w-full gap-3">
        <button
          type="button"
          onClick={onReject}
          disabled={accepting || declining}
          className="border-border bg-muted text-foreground hover:bg-muted/80 flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {declining ? '처리 중...' : '거절'}
        </button>

        <button
          type="button"
          onClick={onAccept}
          disabled={accepting || declining}
          className="bg-foreground text-background flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {accepting ? '수락 중...' : '수락'}
        </button>
      </div>
    </div>
  );
}

function RequestSentContent({ otherProfile }: { otherProfile: Profile }) {
  return (
    <div className="flex flex-col items-center text-center">
      <ProfileAvatar profile={otherProfile} size="lg" />

      <p className="mt-6 text-xl font-bold tracking-tight">요청을 보냈어요</p>

      <p className="text-muted-foreground mt-3 text-sm leading-6">
        {otherProfile.nickname}님이 수락하면 대화를 시작할 수 있어요
      </p>

      <div className="bg-muted text-muted-foreground mt-6 rounded-2xl px-4 py-3 text-sm">
        응답을 기다리는 중이에요
      </div>
    </div>
  );
}

function MatchedContent({
  myProfile,
  otherProfile,
}: {
  myProfile: Profile;
  otherProfile: Profile;
}) {
  return (
    <div className="border-border/60 flex flex-col items-center border-b pb-8 text-center">
      <div className="relative flex items-center justify-center">
        <div className="translate-x-2">
          <ProfileAvatar profile={myProfile} />
        </div>
        <div className="-translate-x-2">
          <ProfileAvatar profile={otherProfile} />
        </div>
      </div>

      <p className="mt-5 text-xl font-bold tracking-tight">축하합니다!</p>
      <p className="text-muted-foreground mt-2 text-sm">
        소중한 인연이 연결되었어요 😊
      </p>
    </div>
  );
}

function ProfileAvatar({
  profile,
  size = 'md',
}: {
  profile: Profile;
  size?: 'md' | 'lg';
}) {
  const imgUrl = getImageUrl(profile.profile_image);
  const sizeClass = size === 'lg' ? 'h-24 w-24' : 'h-20 w-20';

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative ${sizeClass} border-background overflow-hidden rounded-full border-2 shadow-md`}
      >
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={profile.nickname}
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-2xl font-semibold">
            {profile.nickname[0]}
          </div>
        )}
      </div>
    </div>
  );
}

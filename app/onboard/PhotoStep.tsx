'use client';

import { useEffect, useRef, useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import type { StepProps } from './types';

const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/profile/avatar', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  const { path } = await res.json();
  return path;
};

export default function PhotoStep({ context, history }: StepProps<'Photo'>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    context.profile_image
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${context.profile_image}`
      : null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) {
        // Only revoke if it's a blob URL
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      }
    };
  }, [preview]);

  const avatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => setError(null),
    onError: (err: any) => setError(err.message),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setError(null);
    avatarMutation.mutate(file);
  };

  const handleNext = () => {
    const profileImage = avatarMutation.data ?? context.profile_image;

    if (!profileImage) {
      setError('프로필 사진을 업로드해주세요.');
      return;
    }

    history.push('BasicInfo', (prev: StepProps<'Photo'>['context']) => ({
      ...prev,
      profile_image: profileImage,
    }));
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">
        프로필 사진을 선택해주세요
      </h2>
      <button
        type="button"
        className="bg-muted border-border hover:border-primary mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-3xl">📷</span>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
      <p className="text-muted-foreground mb-4 text-center text-sm">
        {avatarMutation.isPending ? '업로드 중...' : '탭하여 사진 선택'}
      </p>

      {(error || avatarMutation.isError) && (
        <p className="text-destructive mb-4 text-center text-sm">
          {error || avatarMutation.error?.message}
        </p>
      )}

      <button
        className="bg-primary text-primary-foreground mb-2 w-full rounded-lg p-3 disabled:opacity-50"
        disabled={avatarMutation.isPending}
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

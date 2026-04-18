'use client'

import { useEffect, useRef, useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import type { StepProps } from './types'

const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/profile/avatar', { method: 'POST', body: formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }
  const { path } = await res.json()
  return path
}

export default function PhotoStep({ context: _context, history }: StepProps<'Photo'>) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const avatarMutation = useMutation({ mutationFn: uploadAvatar })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
    avatarMutation.mutate(file)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">프로필 사진을 선택해주세요</h2>
      <button
        type="button"
        className="w-24 h-24 bg-muted rounded-full mb-4 flex items-center justify-center mx-auto overflow-hidden"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview
          ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
          : <span className="text-3xl">📷</span>
        }
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
      {avatarMutation.isError && (
        <p className="text-destructive mb-3 text-sm text-center">
          업로드 실패: {avatarMutation.error?.message}
        </p>
      )}
      <button
        className="w-full bg-primary text-primary-foreground p-3 rounded-lg mb-2 disabled:opacity-50"
        disabled={avatarMutation.isPending}
        onClick={() =>
          history.push('BasicInfo', (prev: StepProps<'Photo'>['context']) => ({
            ...prev,
            profile_image: avatarMutation.data ?? '',
          }))
        }
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

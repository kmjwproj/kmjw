'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getImageUrl } from '@/src/entities/user/api/profile'

type UserItem = {
  id: string
  user_id: string
  nickname: string
  profile_image: string | null
}

type Props = {
  onClose: () => void
}

async function fetchUsers(): Promise<UserItem[]> {
  const res = await fetch('/api/users')
  if (!res.ok) throw new Error('유저 목록을 불러오지 못했습니다')
  return res.json()
}

async function createChatRoom(targetUserId: string): Promise<string> {
  const res = await fetch('/api/chat-rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetUserId }),
  })
  if (!res.ok) throw new Error('채팅방을 만들지 못했습니다')
  const { id } = await res.json()
  return id
}

export function NewChatModal({ onClose }: Props) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  async function handleStartChat(targetUserId: string) {
    setLoadingId(targetUserId)
    try {
      const roomId = await createChatRoom(targetUserId)
      onClose()
      router.push(`/messages/${roomId}`)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* 배경 딤 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 모달 */}
      <div className="relative z-10 w-full max-w-md bg-background rounded-t-2xl sm:rounded-2xl max-h-[80vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <h2 className="text-base font-semibold">새 채팅 시작</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground text-sm"
          >
            닫기
          </button>
        </div>

        {/* 유저 목록 */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <p className="text-center text-sm text-muted-foreground py-10">불러오는 중...</p>
          )}
          {isError && (
            <p className="text-center text-sm text-destructive py-10">불러오기 실패</p>
          )}
          {users?.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-10">유저가 없습니다</p>
          )}
          {users?.map((u) => {
            const avatarUrl = getImageUrl(u.profile_image)
            const isLoading = loadingId === u.user_id

            return (
              <div key={u.id} className="flex items-center gap-3 px-4 py-3">
                {/* 아바타 */}
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={u.nickname} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {u.nickname.charAt(0)}
                    </span>
                  )}
                </div>

                {/* 닉네임 */}
                <span className="flex-1 text-sm font-medium">{u.nickname}</span>

                {/* 채팅걸기 버튼 */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleStartChat(u.user_id)}
                  className="text-xs px-3 py-1.5 rounded-full bg-[var(--brand)] text-white disabled:opacity-50"
                >
                  {isLoading ? '이동 중...' : '채팅걸기'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

export function useStartChat() {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function startChat(targetUserId: string, onSuccess?: () => void) {
    setLoadingId(targetUserId)
    try {
      const roomId = await createChatRoom(targetUserId)
      onSuccess?.()
      router.push(`/messages/${roomId}`)
    } finally {
      setLoadingId(null)
    }
  }

  return {
    startChat,
    isLoading: (targetUserId: string) => loadingId === targetUserId,
  }
}

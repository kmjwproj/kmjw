'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/src/shared/store/auth-store'
import { getImageUrl } from '@/src/entities/user/api/profile'
import type { ChatRoom } from '@/src/entities/message/chat'

function formatRelativeTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const h = d.getHours()
    const m = String(d.getMinutes()).padStart(2, '0')
    return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${m}`
  }
  if (diffDays === 1) return '어제'
  if (diffDays < 7) {
    const days = ['일', '월', '화', '수', '목', '금', '토']
    return days[d.getDay()]
  }
  return `${d.getMonth() + 1}/${d.getDate()}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toChatRoom(item: any): ChatRoom {
  return {
    id: item.id,
    participantName: item.participant.nickname,
    participantAvatar: getImageUrl(item.participant.profile_image) ?? null,
    lastMessage: item.lastMessage,
    lastMessageAt: item.lastMessageAt ? formatRelativeTime(item.lastMessageAt) : null,
    isRead: item.isRead,
    lastSentByMe: item.lastSentByMe,
  }
}

export function useChatRooms() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: rooms = [] } = useQuery({
    queryKey: ['chat-rooms'],
    queryFn: async () => {
      const res = await fetch('/api/chat-rooms')
      if (!res.ok) throw new Error('Failed to fetch chat rooms')
      const data = await res.json()
      return data.map(toChatRoom) as ChatRoom[]
    },
  })

  // Realtime: 내 chat_room_participants에 새 행이 INSERT될 때 (다른 유저가 나와 채팅방을 만들었을 때)
  // 또는 새 메시지가 왔을 때 목록 갱신
  useEffect(() => {
    if (!user?.id) return
    const supabase = createClient()
    const channel = supabase
      .channel('chat-room-list')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_room_participants',
          filter: `user_id=eq.${user.id}`,
        },
        () => { queryClient.invalidateQueries({ queryKey: ['chat-rooms'] }) },
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => { queryClient.invalidateQueries({ queryKey: ['chat-rooms'] }) },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user?.id, queryClient])

  const filteredRooms = useMemo(() => {
    if (!searchQuery.trim()) return rooms
    const q = searchQuery.toLowerCase()
    return rooms.filter(
      (r) =>
        r.participantName.toLowerCase().includes(q) ||
        (r.lastMessage ?? '').toLowerCase().includes(q),
    )
  }, [rooms, searchQuery])

  return { rooms: filteredRooms, searchQuery, setSearchQuery }
}

import { useState, useMemo } from 'react'
import { MOCK_CHAT_ROOMS } from '@/src/entities/message/mock-data'
import type { ChatRoom } from '@/src/entities/message/chat'

export function useChatRooms() {
  const [searchQuery, setSearchQuery] = useState('')

  const rooms = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_CHAT_ROOMS
    const q = searchQuery.toLowerCase()
    return MOCK_CHAT_ROOMS.filter(
      (r) =>
        r.participantName.toLowerCase().includes(q) ||
        r.lastMessage.toLowerCase().includes(q),
    )
  }, [searchQuery])

  return { rooms, searchQuery, setSearchQuery }
}

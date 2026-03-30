'use client'

import { useRouter } from 'next/navigation'
import { useChatRooms } from '@/src/features/chat-room-list/hooks/use-chat-rooms'
import { ChatSearchBar } from '@/src/features/chat-room-list/ui/chat-search-bar'
import { ChatRoomItem } from '@/src/features/chat-room-list/ui/chat-room-item'

export default function MessagesScreen() {
  const router = useRouter()
  const { rooms, searchQuery, setSearchQuery } = useChatRooms()

  return (
    <div className="flex flex-col">
      {/* 검색바 */}
      <div className="px-4 py-3">
        <ChatSearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* 채팅방 목록 */}
      <div className="flex-1">
        {rooms.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">
            채팅방이 없습니다
          </p>
        ) : (
          rooms.map((room) => (
            <ChatRoomItem
              key={room.id}
              room={room}
              onClick={() => router.push(`/messages/${room.id}`)}
            />
          ))
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChatRooms } from '@/src/features/chat-room-list/hooks/use-chat-rooms'
import { ChatSearchBar } from '@/src/features/chat-room-list/ui/chat-search-bar'
import { ChatRoomItem } from '@/src/features/chat-room-list/ui/chat-room-item'
import { NewChatModal } from '@/src/features/chat-room-list/ui/new-chat-modal'

export default function MessagesScreen() {
  const router = useRouter()
  const { rooms, searchQuery, setSearchQuery } = useChatRooms()
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="flex flex-col">
      {/* 검색바 + 새 채팅 버튼 */}
      <div className="px-4 py-3 flex items-center gap-2">
        <div className="flex-1">
          <ChatSearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-9 h-9 rounded-full bg-[var(--brand)] text-white flex items-center justify-center text-xl shrink-0"
          aria-label="새 채팅 시작"
        >
          +
        </button>
      </div>

      {showModal && <NewChatModal onClose={() => setShowModal(false)} />}

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

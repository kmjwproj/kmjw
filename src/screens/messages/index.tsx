'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { HeaderNav } from '@/src/widgets/header-nav'
import { useChatRooms } from '@/src/features/chat-room-list/hooks/use-chat-rooms'
import { ChatSearchBar } from '@/src/features/chat-room-list/ui/chat-search-bar'
import { ChatRoomItem } from '@/src/features/chat-room-list/ui/chat-room-item'
import { NewChatModal } from '@/src/features/chat-room-list/ui/new-chat-modal'

const MESSAGE_TABS = ['전체 메시지', '보낸 메시지', '받은 메시지'] as const;

export default function MessagesScreen() {
  const router = useRouter()
  const { rooms, searchQuery, setSearchQuery } = useChatRooms()
  const [showModal, setShowModal] = useState(false)
  
  // 내가 작업한 탭 상태 로직 유지
  const [activeTab, setActiveTab] = useQueryState(
    'tab',
    parseAsStringLiteral(MESSAGE_TABS).withDefault(MESSAGE_TABS[0]),
  );

  return (
    <div className="flex flex-col">
      {/* 1. 내가 만든 상단 탭 UI */}
      <HeaderNav
        tabs={[...MESSAGE_TABS]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 2. dev에 추가된 검색 및 새 채팅 UI */}
      <div className="px-4 py-3 flex items-center gap-2">
        <div className="flex-1">
          <ChatSearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-9 h-9 rounded-full bg-[var(--brand)] text-white flex items-center justify-center text-xl shrink-0"
        >
          +
        </button>
      </div>

      {showModal && <NewChatModal onClose={() => setShowModal(false)} />}

      {/* 3. 탭과 검색어에 따른 목록 렌더링 */}
      <div className="flex-1">
        {rooms.length === 0 ? (
          <p className="text-center text-sm text-zinc-400 py-12">
            {activeTab}가 없습니다.
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
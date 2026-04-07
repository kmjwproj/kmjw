'use client'

import { useAuthStore } from '@/src/shared/store/auth-store'
import { useChatRoom } from '@/src/features/chat-room/model/use-chat-room'
import { ChatRoomHeader } from '@/src/features/chat-room/ui/chat-room-header'
import { MessageBubble } from '@/src/features/chat-room/ui/message-bubble'
import { DateSeparator } from '@/src/features/chat-room/ui/date-separator'
import { MessageInput } from '@/src/features/chat-room/ui/message-input'

type Props = {
  chatRoomId: string
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${m}`
}

function formatDateLabel(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

function isSameDay(a: string, b: string) {
  const da = new Date(a)
  const db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

export default function ChatRoomScreen({ chatRoomId }: Props) {
  const { user } = useAuthStore()
  const { messages, participant, loading, sending, sendMessage, bottomRef, otherLastReadAt } = useChatRoom(chatRoomId)

  return (
    // 전체화면 오버레이 — (main) 레이아웃의 헤더/탭바 위에 덮음
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center">
      <div className="w-full max-w-[480px] h-full flex flex-col">
        {/* 헤더 */}
        {participant && (
          <ChatRoomHeader
            nickname={participant.nickname}
            profileImage={participant.profile_image}
          />
        )}
        {!participant && !loading && (
          <ChatRoomHeader nickname="채팅" profileImage={null} />
        )}
        {loading && (
          <div className="shrink-0 h-16 border-b border-border/50 bg-background" />
        )}

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1" style={{ scrollbarWidth: 'none' }}>
          {loading && (
            <p className="text-center text-sm text-muted-foreground py-10">불러오는 중...</p>
          )}

          {!loading && messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-10">
              아직 메시지가 없습니다. 첫 메시지를 보내보세요!
            </p>
          )}

          {messages.map((msg, i) => {
            const isMe = msg.sender_id === user?.id
            const prev = messages[i - 1]
            const next = messages[i + 1]

            // 날짜 구분선: 이전 메시지와 날짜가 다를 때
            const showDateSep = !prev || !isSameDay(prev.created_at, msg.created_at)

            // 시간: 다음 메시지가 없거나, 다음 메시지와 발신자가 다르거나, 시간이 다를 때
            const showTime =
              !next ||
              next.sender_id !== msg.sender_id ||
              !isSameDay(next.created_at, msg.created_at) ||
              formatTime(next.created_at) !== formatTime(msg.created_at)

            return (
              <div key={msg.id}>
                {showDateSep && (
                  <DateSeparator dateLabel={formatDateLabel(msg.created_at)} />
                )}
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-0.5`}>
                  <MessageBubble
                    content={msg.content}
                    isMe={isMe}
                    time={formatTime(msg.created_at)}
                    showTime={showTime}
                    isRead={isMe && otherLastReadAt != null && otherLastReadAt >= msg.created_at}
                  />
                </div>
              </div>
            )
          })}

          <div ref={bottomRef} />
        </div>

        {/* 입력창 */}
        <MessageInput onSend={sendMessage} disabled={sending} />
      </div>
    </div>
  )
}

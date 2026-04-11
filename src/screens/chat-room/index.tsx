'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { useAuthStore } from '@/src/shared/store/auth-store'
import { useChatRoom } from '@/src/features/chat-room/model/use-chat-room'
import { ChatRoomHeader } from '@/src/features/chat-room/ui/chat-room-header'
import { MessageBubble } from '@/src/features/chat-room/ui/message-bubble'
import { DateSeparator } from '@/src/features/chat-room/ui/date-separator'
import { MessageInput } from '@/src/features/chat-room/ui/message-input'
import { getImageUrl } from '@/src/entities/user/api/profile'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

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
  const { messages, participant, loading, sending, sendMessage, bottomRef, otherLastReadAt, leaveRoom, leaving, myLeftAt, otherLeftAt } = useChatRoom(chatRoomId)
  const router = useRouter()
  const [notificationEnabled, setNotificationEnabled] = useState(true)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)

  return (
    // 전체화면 오버레이 — (main) 레이아웃의 헤더/탭바 위에 덮음
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center">
      <div className="w-full max-w-[480px] h-full flex flex-col">
        {/* 헤더 */}
        {participant && (
          <ChatRoomHeader
            nickname={participant.nickname}
            profileImage={participant.profile_image}
            notificationEnabled={notificationEnabled}
            onToggleNotification={() => setNotificationEnabled(v => !v)}
            onLeave={() => setShowLeaveDialog(true)}
          />
        )}
        {!participant && !loading && (
          <ChatRoomHeader
            nickname="채팅"
            profileImage={null}
            notificationEnabled={notificationEnabled}
            onToggleNotification={() => setNotificationEnabled(v => !v)}
            onLeave={() => setShowLeaveDialog(true)}
          />
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

          {(() => {
            const readMessageId = (() => {
              if (!otherLastReadAt) return null
              const readMsgs = messages.filter(
                (m) => m.sender_id === user?.id && otherLastReadAt >= m.created_at
              )
              return readMsgs.length > 0 ? readMsgs[readMsgs.length - 1].id : null
            })()

            return messages.map((msg, i) => {
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

              const showAvatar =
                !isMe &&
                (!prev ||
                  prev.sender_id !== msg.sender_id ||
                  formatTime(prev.created_at) !== formatTime(msg.created_at))

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
                      isRead={msg.id === readMessageId}
                      avatarUrl={!isMe ? getImageUrl(participant?.profile_image ?? null) : undefined}
                      showAvatar={showAvatar}
                    />
                  </div>
                </div>
              )
            })
          })()}

          {/* 나가기 알림 */}
          {otherLeftAt && (
            <p className="text-center text-xs text-muted-foreground py-3">
              {participant?.nickname ?? '상대방'}님이 채팅방을 나갔습니다.
            </p>
          )}
          {myLeftAt && (
            <p className="text-center text-xs text-muted-foreground py-3">
              채팅방을 나갔습니다.
            </p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* 입력창 */}
        {myLeftAt ? (
          <div className="shrink-0 px-4 pb-safe pb-6 pt-3 bg-background/80 backdrop-blur-2xl border-t border-border/50">
            <p className="text-center text-sm text-muted-foreground py-2">
              채팅방을 나갔습니다. 더 이상 메세지를 보낼 수 없습니다.
            </p>
          </div>
        ) : otherLeftAt ? (
          <div className="shrink-0 px-4 pb-safe pb-6 pt-3 bg-background/80 backdrop-blur-2xl border-t border-border/50">
            <p className="text-center text-sm text-muted-foreground py-2">
              상대방이 채팅방을 나갔습니다. 더 이상 메세지를 보낼 수 없습니다.
            </p>
          </div>
        ) : (
          <MessageInput onSend={sendMessage} disabled={sending || leaving} />
        )}

        {/* 나가기 확인 Dialog */}
        <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>채팅방 나가기</DialogTitle>
              <DialogDescription>
                {participant?.nickname ?? '상대방'} 채팅방을 나간 이후에는 상대방과 연락할 수 없습니다. 나가겠습니까?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowLeaveDialog(false)}
              >
                아니오
              </Button>
              <Button
                variant="destructive"
                disabled={leaving}
                onClick={() => {
                  leaveRoom(undefined, {
                    onSuccess: () => {
                      setShowLeaveDialog(false)
                      router.back()
                    },
                  })
                }}
              >
                {leaving ? '나가는 중...' : '예'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

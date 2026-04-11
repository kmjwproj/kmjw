'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getImageUrl } from '@/src/entities/user/api/profile';
import { useChatRoom } from '@/src/features/chat-room/model/use-chat-room';
import { ChatRoomHeader } from '@/src/features/chat-room/ui/chat-room-header';
import { DateSeparator } from '@/src/features/chat-room/ui/date-separator';
import { MatchCard } from '@/src/features/chat-room/ui/match-card';
import { MessageBubble } from '@/src/features/chat-room/ui/message-bubble';
import { MessageInput } from '@/src/features/chat-room/ui/message-input';
import { useAuthStore } from '@/src/shared/store/auth-store';

type Props = {
  chatRoomId: string;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${m}`;
}

function formatDateLabel(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

function isSameDay(a: string, b: string) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

export default function ChatRoomScreen({ chatRoomId }: Props) {
  const { user } = useAuthStore();
  const {
    messages,
    participant,
    myProfile,
    status,
    requesterId,
    loading,
    sending,
    sendMessage,
    bottomRef,
    otherLastReadAt,
    leaveRoom,
    leaving,
    myLeftAt,
    otherLeftAt,
    acceptRequest,
    accepting,
    declineRequest,
    declining,
    declined,
  } = useChatRoom(chatRoomId);
  const router = useRouter();
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const isRequester = user?.id === requesterId;
  const isPending = status === 'pending';
  const isActive = status === 'active';

  // 거절당했을 때 2.5초 후 자동 뒤로가기
  useEffect(() => {
    if (!declined) return;
    const timer = setTimeout(() => router.back(), 2500);
    return () => clearTimeout(timer);
  }, [declined, router]);

  return (
    <div className="bg-background fixed inset-0 z-50 flex flex-col items-center">
      <div className="relative flex h-full w-full max-w-[480px] flex-col">
        {participant && (
          <ChatRoomHeader
            nickname={participant.nickname}
            profileImage={participant.profile_image}
            notificationEnabled={notificationEnabled}
            onToggleNotification={() => setNotificationEnabled((v) => !v)}
            onLeave={isPending ? undefined : () => setShowLeaveDialog(true)}
          />
        )}

        {!participant && !loading && (
          <ChatRoomHeader
            nickname="채팅"
            profileImage={null}
            notificationEnabled={notificationEnabled}
            onToggleNotification={() => setNotificationEnabled((v) => !v)}
            onLeave={isPending ? undefined : () => setShowLeaveDialog(true)}
          />
        )}

        {loading && (
          <div className="border-border/50 bg-background h-16 shrink-0 border-b" />
        )}

        {/* 메시지 목록 */}
        <div
          className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* 상단 MatchCard 영역 */}
          {isPending && !isRequester && myProfile && participant && (
            <MatchCard
              myProfile={myProfile}
              otherProfile={participant}
              mode="request-received"
              onDismiss={() => {}}
              onAccept={() => acceptRequest()}
              onReject={() => declineRequest()}
              accepting={accepting}
              declining={declining}
            />
          )}

          {isPending && isRequester && myProfile && participant && (
            <MatchCard
              myProfile={myProfile}
              otherProfile={participant}
              mode="request-sent"
              onDismiss={() => {}}
            />
          )}

          {isActive && myProfile && participant && (
            <MatchCard
              myProfile={myProfile}
              otherProfile={participant}
              mode="matched"
              onDismiss={() => {}}
            />
          )}
          {loading && (
            <p className="text-muted-foreground py-10 text-center text-sm">
              불러오는 중...
            </p>
          )}

          {!loading && isActive && messages.length === 0 && (
            <p className="text-muted-foreground text-center text-sm">
              아직 메시지가 없습니다. 첫 메시지를 보내보세요!
            </p>
          )}

          {isActive &&
            (() => {
              const readMessageId = (() => {
                if (!otherLastReadAt) return null;
                const readMsgs = messages.filter(
                  (m) =>
                    m.sender_id === user?.id && otherLastReadAt >= m.created_at,
                );
                return readMsgs.length > 0
                  ? readMsgs[readMsgs.length - 1].id
                  : null;
              })();

              return messages.map((msg, i) => {
                const isMe = msg.sender_id === user?.id;
                const prev = messages[i - 1];
                const next = messages[i + 1];

                const showDateSep =
                  !prev || !isSameDay(prev.created_at, msg.created_at);
                const showTime =
                  !next ||
                  next.sender_id !== msg.sender_id ||
                  !isSameDay(next.created_at, msg.created_at) ||
                  formatTime(next.created_at) !== formatTime(msg.created_at);

                const showAvatar =
                  !isMe &&
                  (!prev ||
                    prev.sender_id !== msg.sender_id ||
                    formatTime(prev.created_at) !== formatTime(msg.created_at));

                return (
                  <div key={msg.id}>
                    {showDateSep && (
                      <DateSeparator
                        dateLabel={formatDateLabel(msg.created_at)}
                      />
                    )}

                    <div
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-0.5`}
                    >
                      <MessageBubble
                        content={msg.content}
                        isMe={isMe}
                        time={formatTime(msg.created_at)}
                        showTime={showTime}
                        isRead={msg.id === readMessageId}
                        avatarUrl={
                          !isMe
                            ? getImageUrl(participant?.profile_image ?? null)
                            : undefined
                        }
                        showAvatar={showAvatar}
                      />
                    </div>
                  </div>
                );
              });
            })()}

          {otherLeftAt && (
            <p className="text-muted-foreground py-3 text-center text-xs">
              {participant?.nickname ?? '상대방'}님이 채팅방을 나갔습니다.
            </p>
          )}

          {myLeftAt && (
            <p className="text-muted-foreground py-3 text-center text-xs">
              채팅방을 나갔습니다.
            </p>
          )}

          {declined && (
            <p className="text-muted-foreground py-3 text-center text-xs">
              매칭 신청이 거절되었습니다.
            </p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* 입력창 */}
        {declined ? (
          <div className="pb-safe bg-background/80 border-border/50 shrink-0 border-t px-4 pt-3 pb-6 backdrop-blur-2xl">
            <p className="text-muted-foreground py-2 text-center text-sm">
              매칭 신청이 거절되었습니다.
            </p>
          </div>
        ) : myLeftAt ? (
          <div className="pb-safe bg-background/80 border-border/50 shrink-0 border-t px-4 pt-3 pb-6 backdrop-blur-2xl">
            <p className="text-muted-foreground py-2 text-center text-sm">
              채팅방을 나갔습니다. 더 이상 메세지를 보낼 수 없습니다.
            </p>
          </div>
        ) : otherLeftAt ? (
          <div className="pb-safe bg-background/80 border-border/50 shrink-0 border-t px-4 pt-3 pb-6 backdrop-blur-2xl">
            <p className="text-muted-foreground py-2 text-center text-sm">
              상대방이 채팅방을 나갔습니다. 더 이상 메세지를 보낼 수 없습니다.
            </p>
          </div>
        ) : !isPending ? (
          <MessageInput onSend={sendMessage} disabled={sending || leaving} />
        ) : null}

        {/* 나가기 확인 Dialog */}
        <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>채팅방 나가기</DialogTitle>
              <DialogDescription>
                {participant?.nickname ?? '상대방'} 채팅방을 나간 이후에는
                상대방과 연락할 수 없습니다. 나가겠습니까?
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
                      setShowLeaveDialog(false);
                      router.back();
                    },
                  });
                }}
              >
                {leaving ? '나가는 중...' : '예'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

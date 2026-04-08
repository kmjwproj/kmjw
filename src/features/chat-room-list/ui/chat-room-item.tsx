import { cn } from '@/lib/utils'
import type { ChatRoom } from '@/src/entities/message/chat'

type Props = {
  room: ChatRoom
  onClick?: () => void
}

export function ChatRoomItem({ room, onClick }: Props) {
  const { participantName, participantAvatar, lastMessage, lastMessageAt, isRead, lastSentByMe } = room

  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      <div className="py-3 px-4 flex items-center gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-muted flex items-center justify-center">
          {participantAvatar ? (
            <img src={participantAvatar} alt={participantName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-base text-muted-foreground">{participantName.charAt(0)}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-center justify-between gap-2">
            <span className={cn('text-sm truncate', isRead ? 'font-medium' : 'font-semibold')}>
              {participantName}
            </span>
            {lastMessageAt && (
              <span className="text-xs text-muted-foreground shrink-0">{lastMessageAt}</span>
            )}
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <span className={cn('text-sm truncate', isRead ? 'text-muted-foreground' : 'text-foreground')}>
              {lastSentByMe && <span className="text-muted-foreground">보냄 · </span>}
              {lastMessage ?? ''}
            </span>
            {!isRead && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
          </div>
        </div>
      </div>
    </button>
  )
}

type Props = {
  content: string
  isMe: boolean
  time: string
  showTime: boolean
  isRead?: boolean
}

export function MessageBubble({ content, isMe, time, showTime, isRead }: Props) {
  if (isMe) {
    return (
      <div className="flex items-end gap-1 max-w-[80%] self-end">
        {showTime && (
          <span className="text-[10px] text-muted-foreground font-medium shrink-0 pb-0.5 uppercase">
            {isRead && <span className="text-[var(--brand)] mr-0.5">읽음</span>}
            {time}
          </span>
        )}
        <div className="bg-[var(--brand)] text-white px-4 py-3 rounded-[1.5rem] rounded-br-none shadow-sm">
          <p className="text-[15px] leading-relaxed">{content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-1 max-w-[80%]">
      <div className="bg-muted text-foreground px-4 py-3 rounded-[1.5rem] rounded-bl-none">
        <p className="text-[15px] leading-relaxed">{content}</p>
      </div>
      {showTime && (
        <span className="text-[10px] text-muted-foreground font-medium shrink-0 pb-0.5 uppercase">
          {time}
        </span>
      )}
    </div>
  )
}

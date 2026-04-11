type Props = {
  content: string;
  isMe: boolean;
  time: string;
  showTime: boolean;
  isRead?: boolean;
  avatarUrl?: string | null;
  showAvatar?: boolean;
};

export function MessageBubble({
  content,
  isMe,
  time,
  showTime,
  isRead,
  avatarUrl,
  showAvatar,
}: Props) {
  if (isMe) {
    return (
      <div className="flex max-w-[80%] items-end gap-1 self-end">
        {showTime && (
          <span className="text-muted-foreground shrink-0 pb-0.5 text-[10px] font-medium uppercase">
            {isRead && <span className="mr-0.5 text-[var(--brand)]">읽음</span>}
            {time}
          </span>
        )}
        <div className="rounded-[1.5rem] rounded-br-none bg-[var(--brand)] px-4 py-3 text-white shadow-sm">
          <p className="text-[15px] leading-relaxed">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[80%] items-end gap-1">
      {showAvatar ? (
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="프로필"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-xs">
              ?
            </div>
          )}
        </div>
      ) : (
        <div className="h-10 w-10 shrink-0" />
      )}
      <div className="bg-muted text-foreground ml-1 rounded-[1.5rem] rounded-bl-none px-4 py-3">
        <p className="text-[15px] leading-relaxed">{content}</p>
      </div>
      {showTime && (
        <span className="text-muted-foreground shrink-0 pb-0.5 text-[10px] font-medium uppercase">
          {time}
        </span>
      )}
    </div>
  );
}

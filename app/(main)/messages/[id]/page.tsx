export default function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground text-sm">채팅방 준비 중...</p>
    </div>
  )
}

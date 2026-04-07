import ChatRoomScreen from '@/src/screens/chat-room'

export default async function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ChatRoomScreen chatRoomId={id} />
}

export type Sender = 'me' | 'other'

export type Message = {
  id: string
  senderId: Sender
  content: string
  createdAt: string // ISO string
}

export type ChatRoom = {
  id: string
  participantName: string
  participantAvatar: string | null
  lastMessage: string | null
  lastMessageAt: string | null
  isRead: boolean
  lastSentByMe: boolean
}

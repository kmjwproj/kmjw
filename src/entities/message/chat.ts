import type { StaticImageData } from 'next/image'

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
  participantAvatar: StaticImageData
  lastMessage: string
  lastMessageAt: string
  isRead: boolean
  lastSentByMe: boolean
}

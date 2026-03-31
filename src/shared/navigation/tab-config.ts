import { Home, MessageCircle, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type Tab = {
  href: string
  icon: LucideIcon
  label: string
}

export const TABS: Tab[] = [
  { href: '/feed', icon: Home, label: '피드' },
  { href: '/messages', icon: MessageCircle, label: '메세지' },
  { href: '/my', icon: User, label: '마이페이지' },
]

import { Home, LayoutGrid, MessageSquare, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Tab = {
  href: string;
  icon: LucideIcon;
  label: string;
};

export const TABS: Tab[] = [
  { href: '/feed', icon: Home, label: '피드' },
  { href: '/explore', icon: LayoutGrid, label: '탐색' },
  { href: '/messages', icon: MessageSquare, label: '메세지' },
  { href: '/my', icon: User, label: '프로필' },
];

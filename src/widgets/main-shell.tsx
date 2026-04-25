'use client'

import { usePathname } from 'next/navigation'
import TopHeader from '@/src/widgets/top-header'
import BottomTabBar from '@/src/widgets/bottom-tab-bar'

export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isChatRoom = /^\/messages\/[^/]+/.test(pathname)

  if (isChatRoom) {
    return <>{children}</>
  }

  return (
    <>
      <TopHeader />
      <main className="h-screen overflow-y-auto pt-14 pb-16">{children}</main>
      <BottomTabBar />
    </>
  )
}

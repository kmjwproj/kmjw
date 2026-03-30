'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { TABS } from '@/src/shared/navigation/tab-config'

export default function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 z-50 flex justify-around items-center px-10 bg-background/90 backdrop-blur-xl border-t border-border/50">
      {TABS.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={cn(
              'flex items-center justify-center transition-all duration-200 active:scale-90',
              isActive
                ? 'text-[var(--brand)] scale-125'
                : 'text-zinc-400 hover:text-[var(--brand)]/70',
            )}
          >
            <Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 1.75}
              fill={isActive ? 'currentColor' : 'none'}
            />
          </Link>
        )
      })}
    </nav>
  )
}

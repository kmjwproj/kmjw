'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/src/shared/lib/cn';
import { TABS } from '@/src/shared/navigation/tab-config';

export const BottomTabBar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 mx-auto flex h-16 w-full max-w-120 items-center justify-between border-t border-gray-100 bg-white/95 px-6 backdrop-blur-xl">
      {TABS.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={cn(
              'flex flex-col items-center justify-center transition-all duration-200 active:scale-90',
              isActive ? 'text-black' : 'text-zinc-400 hover:text-black/70',
            )}
          >
            <Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 1.75}
              fill={isActive ? 'currentColor' : 'none'}
            />
            <p
              className={cn(
                'pt-1 text-xs',
                isActive ? 'text-black' : 'text-zinc-400',
              )}
            >
              {label}
            </p>
          </Link>
        );
      })}
    </nav>
  );
};

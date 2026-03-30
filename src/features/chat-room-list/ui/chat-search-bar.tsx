'use client'

import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function ChatSearchBar({ value, onChange }: ChatSearchBarProps) {
  return (
    <div className={cn('relative w-full bg-muted rounded-xl px-4 py-2.5')}>
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={20}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="검색"
        className={cn(
          'w-full pl-8 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none',
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}

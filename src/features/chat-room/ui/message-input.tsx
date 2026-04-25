'use client'

import { useRef, useState } from 'react'

type Props = {
  onSend: (content: string) => void
  disabled?: boolean
}

export function MessageInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    // 높이 자동 조절
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  return (
    <div className="shrink-0 px-4 pb-safe pb-6 pt-3 bg-background/80 backdrop-blur-2xl border-t border-border/50">
      <div className="flex items-end gap-2 bg-muted rounded-full px-4 py-2 ring-1 ring-foreground/5">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-[15px] font-medium placeholder:text-muted-foreground py-2 leading-relaxed max-h-[120px] overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
        />
        <button
          type="button"
          onClick={submit}
          disabled={!value.trim() || disabled}
          className="bg-[var(--brand)] text-white p-2.5 rounded-full shadow-md transition-all active:scale-90 disabled:opacity-40 shrink-0 mb-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

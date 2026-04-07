'use client'

import { useRouter } from 'next/navigation'
import { getImageUrl } from '@/src/entities/user/api/profile'

type Props = {
  nickname: string
  profileImage: string | null
}

export function ChatRoomHeader({ nickname, profileImage }: Props) {
  const router = useRouter()
  const avatarUrl = getImageUrl(profileImage)

  return (
    <header className="shrink-0 h-16 flex items-center justify-between px-4 bg-background/70 backdrop-blur-xl border-b border-border/50 z-10">
      {/* 왼쪽: 뒤로가기 + 상대방 정보 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-muted transition-colors active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-muted overflow-hidden shrink-0 flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt={nickname} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm text-muted-foreground">{nickname.charAt(0)}</span>
            )}
          </div>
          <span className="font-semibold text-sm tracking-tight">{nickname}</span>
        </div>
      </div>

      {/* 오른쪽: 더보기 */}
      <button type="button" className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
        </svg>
      </button>
    </header>
  )
}

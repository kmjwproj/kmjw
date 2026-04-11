'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Bell, BellOff, ChevronLeft, LogOut } from 'lucide-react';

type Props = {
  nickname: string;
  profileImage: string | null;
  notificationEnabled: boolean;
  onToggleNotification: () => void;
  onLeave?: () => void;
};

type NotificationToastProps = {
  visible: boolean;
  enabled: boolean;
};

function NotificationToast({ visible, enabled }: NotificationToastProps) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <div className="rounded-2xl bg-black/80 px-5 py-4 text-white shadow-lg">
        <div className="flex items-center gap-2">
          {enabled ? (
            <Bell className="h-4 w-4" />
          ) : (
            <BellOff className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {enabled ? '채팅 알림을 켰어요' : '채팅 알림을 껐어요'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ChatRoomHeader({
  nickname,
  notificationEnabled,
  onToggleNotification,
  onLeave,
}: Props) {
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);
  const prevNotificationEnabled = useRef(notificationEnabled);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevNotificationEnabled.current = notificationEnabled;
      return;
    }

    if (prevNotificationEnabled.current !== notificationEnabled) {
      setVisible(true);
      prevNotificationEnabled.current = notificationEnabled;
    }
  }, [notificationEnabled]);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <>
      <header className="bg-background/70 border-border/50 z-10 flex h-16 shrink-0 items-center justify-between border-b px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="hover:bg-muted rounded-full p-2 transition-colors active:scale-95"
          >
            <ChevronLeft size={22} />
          </button>
        </div>

        <div className="flex h-full items-center justify-center gap-2.5 p-2">
          <span className="text-md font-semibold tracking-tight">
            {nickname}
          </span>
        </div>

        <div className="flex gap-0.5">
          <button
            type="button"
            onClick={onToggleNotification}
            className="hover:bg-muted rounded-full p-2 transition-colors"
          >
            {notificationEnabled ? (
              <Bell size={20} className="text-foreground" />
            ) : (
              <BellOff size={20} className="text-muted-foreground" />
            )}
          </button>

          {onLeave && (
            <button
              type="button"
              onClick={onLeave}
              className="hover:bg-muted text-muted-foreground hover:text-destructive rounded-full p-2 transition-colors"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </header>

      <NotificationToast visible={visible} enabled={notificationEnabled} />
    </>
  );
}

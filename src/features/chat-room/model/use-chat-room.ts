'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/src/shared/store/auth-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Message = {
  id: string;
  chat_room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export type Profile = {
  user_id: string;
  nickname: string;
  profile_image: string | null;
};

export type Participant = Profile & {
  otherLastReadAt: string | null;
};

export type RoomStatus = 'pending' | 'active';

export function useChatRoom(chatRoomId: string) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null);
  const [declined, setDeclined] = useState(false);

  // 채팅방 정보 + 상대방 읽음 시간
  const { data: roomData } = useQuery({
    queryKey: ['chat-room', chatRoomId],
    queryFn: async () => {
      const res = await fetch(`/api/chat-rooms/${chatRoomId}`);
      if (!res.ok) throw new Error('Failed to fetch room');
      return res.json() as Promise<{
        id: string;
        status: RoomStatus;
        requesterId: string | null;
        participant: Profile;
        myProfile: Profile | null;
        otherLastReadAt: string | null;
        myLeftAt: string | null;
        otherLeftAt: string | null;
      }>;
    },
    staleTime: 0,
  });

  // 메시지 목록
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', chatRoomId],
    queryFn: async () => {
      const res = await fetch(`/api/chat-rooms/${chatRoomId}/messages`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      return res.json() as Promise<Message[]>;
    },
    staleTime: 0,
  });

  const markAsRead = useCallback(() => {
    fetch(`/api/chat-rooms/${chatRoomId}/read`, { method: 'PATCH' })
      .then(() => {
        channelRef.current?.send({
          type: 'broadcast',
          event: 'read_updated',
          payload: {},
        })
      })
      .catch(() => {})
  }, [chatRoomId])

  // 입장 시 읽음 처리
  useEffect(() => {
    markAsRead();
  }, [chatRoomId, markAsRead]);

  // 탭 전환 시 읽음 처리 (다른 탭에서 돌아올 때)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        markAsRead();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [chatRoomId, markAsRead]);

  // 메시지 전송 (낙관적 업데이트)
  const { mutate: sendMessage, isPending: sending } = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/chat-rooms/${chatRoomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      return res.json() as Promise<Message>;
    },
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ['messages', chatRoomId] });
      const previous = queryClient.getQueryData<Message[]>([
        'messages',
        chatRoomId,
      ]);
      const optimistic: Message = {
        id: `optimistic-${Date.now()}`,
        chat_room_id: chatRoomId,
        sender_id: user?.id ?? '',
        content,
        created_at: new Date().toISOString(),
      };
      queryClient.setQueryData<Message[]>(
        ['messages', chatRoomId],
        (old = []) => [...old, optimistic],
      );
      return { previous };
    },
    onError: (_err, _content, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['messages', chatRoomId], context.previous);
      }
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData<Message[]>(
        ['messages', chatRoomId],
        (old = []) => {
          const withoutOptimistic = old.filter(
            (m) => !m.id.startsWith('optimistic-'),
          );
          if (withoutOptimistic.some((m) => m.id === newMessage.id))
            return withoutOptimistic;
          return [...withoutOptimistic, newMessage];
        },
      );

      markAsRead()
      queryClient.invalidateQueries({ queryKey: ['chat-rooms'] })
    },
  });

  // leaveRoom mutation
  const { mutate: leaveRoom, isPending: leaving } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/chat-rooms/${chatRoomId}/leave`, { method: 'PATCH' })
      if (!res.ok) throw new Error('Failed to leave room')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-room', chatRoomId] })
      queryClient.invalidateQueries({ queryKey: ['chat-rooms'] })
    },
  })

  // acceptRequest mutation
  const { mutate: acceptRequest, isPending: accepting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/chat-rooms/${chatRoomId}/accept`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to accept request')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-room', chatRoomId] })
      queryClient.invalidateQueries({ queryKey: ['chat-rooms'] })
    },
  })

  // declineRequest mutation
  const { mutate: declineRequest, isPending: declining } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/chat-rooms/${chatRoomId}/decline`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to decline request')
      return res.json()
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['chat-room', chatRoomId] })
      queryClient.removeQueries({ queryKey: ['messages', chatRoomId] })
      queryClient.invalidateQueries({ queryKey: ['chat-rooms'] })
    },
  })

  // Realtime 구독
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${chatRoomId}`)
    channelRef.current = channel
    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          const newMsg = payload.new as Message;
          if (newMsg.sender_id === user?.id) return;
          queryClient.setQueryData<Message[]>(
            ['messages', chatRoomId],
            (old = []) => {
              if (old.some((m) => m.id === newMsg.id)) return old;
              return [...old, newMsg];
            },
          );
          queryClient.invalidateQueries({ queryKey: ['chat-room', chatRoomId] });
          if (document.visibilityState === 'visible') {
            markAsRead();
          }
        },
      )
      .on('broadcast', { event: 'read_updated' }, () => {
        queryClient.invalidateQueries({ queryKey: ['chat-room', chatRoomId] })
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_room_participants',
        filter: `chat_room_id=eq.${chatRoomId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['chat-room', chatRoomId] })
      })
      // 수락 감지: chat_rooms status → active
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_rooms',
        filter: `id=eq.${chatRoomId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['chat-room', chatRoomId] })
      })
      // 거절 감지: chat_rooms 삭제
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'chat_rooms',
        filter: `id=eq.${chatRoomId}`,
      }, () => {
        setDeclined(true)
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatRoomId, queryClient, user?.id, markAsRead]);

  // 새 메시지 시 하단 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const participant = roomData
    ? {
        ...roomData.participant,
        otherLastReadAt: roomData.otherLastReadAt,
      }
    : null;

  return {
    messages,
    participant,
    myProfile: roomData?.myProfile ?? null,
    status: roomData?.status ?? 'pending',
    requesterId: roomData?.requesterId ?? null,
    loading: isLoading,
    sending,
    sendMessage,
    bottomRef,
    otherLastReadAt: roomData?.otherLastReadAt ?? null,
    leaveRoom,
    leaving,
    myLeftAt: roomData?.myLeftAt ?? null,
    otherLeftAt: roomData?.otherLeftAt ?? null,
    acceptRequest,
    accepting,
    declineRequest,
    declining,
    declined,
  };
}

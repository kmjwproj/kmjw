'use client';

import { useEffect, useRef } from 'react';

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

export type Participant = {
  user_id: string;
  nickname: string;
  profile_image: string | null;
  otherLastReadAt: string | null;
};

export function useChatRoom(chatRoomId: string) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  // 채팅방 정보 + 상대방 읽음 시간
  const { data: roomData } = useQuery({
    queryKey: ['chat-room', chatRoomId],
    queryFn: async () => {
      const res = await fetch(`/api/chat-rooms/${chatRoomId}`);
      if (!res.ok) throw new Error('Failed to fetch room');
      return res.json() as Promise<{
        id: string;
        participant: Participant;
        otherLastReadAt: string | null;
      }>;
    },
    staleTime: 60_000,
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

  // 입장 시 읽음 처리
  useEffect(() => {
    fetch(`/api/chat-rooms/${chatRoomId}/read`, { method: 'PATCH' }).catch(
      () => {},
    );
  }, [chatRoomId]);

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
    },
  });

  // Realtime 구독 (상대방 메시지 수신)
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${chatRoomId}`)
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
          // 내 메시지는 낙관적 업데이트로 이미 처리됨, 상대방 메시지만 추가
          if (newMsg.sender_id === user?.id) return;
          queryClient.setQueryData<Message[]>(
            ['messages', chatRoomId],
            (old = []) => {
              if (old.some((m) => m.id === newMsg.id)) return old;
              return [...old, newMsg];
            },
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatRoomId, queryClient, user?.id]);

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
    loading: isLoading,
    sending,
    sendMessage,
    bottomRef,
    otherLastReadAt: roomData?.otherLastReadAt ?? null,
  };
}

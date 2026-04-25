import { NextResponse } from 'next/server';

import { createClient as createServerClient } from '@/lib/supabase/server';

// GET /api/chat-rooms — 내 채팅방 목록
export async function GET() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. 내가 속한 채팅방 참여 정보 조회
  const { data: myParticipants, error: participantsError } = await supabase
    .from('chat_room_participants')
    .select('chat_room_id, last_read_at')
    .eq('user_id', user.id);

  if (participantsError) return NextResponse.json({ error: participantsError.message }, { status: 500 });
  if (!myParticipants || myParticipants.length === 0) return NextResponse.json([]);

  const myRoomIds = myParticipants.map((p) => p.chat_room_id);

  // 2. 각 채팅방의 상대방 참여자 조회
  const { data: otherParticipants, error: othersError } = await supabase
    .from('chat_room_participants')
    .select('chat_room_id, user_id')
    .in('chat_room_id', myRoomIds)
    .neq('user_id', user.id);

  if (othersError) return NextResponse.json({ error: othersError.message }, { status: 500 });

  // 2-1. 상대방 user_id 목록으로 profiles 별도 조회
  const otherUserIds = (otherParticipants ?? []).map((p) => p.user_id);
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('user_id, nickname, profile_image')
    .in('user_id', otherUserIds);

  const profileMap = new Map<string, { nickname: string; profile_image: string | null }>();
  for (const p of profilesData ?? []) {
    profileMap.set(p.user_id, { nickname: p.nickname, profile_image: p.profile_image });
  }

  // 3. 각 채팅방의 마지막 메시지 조회
  const { data: lastMessages, error: messagesError } = await supabase
    .from('messages')
    .select('chat_room_id, sender_id, content, created_at')
    .in('chat_room_id', myRoomIds)
    .order('created_at', { ascending: false });

  if (messagesError) return NextResponse.json({ error: messagesError.message }, { status: 500 });

  // 채팅방별 마지막 메시지 map
  const lastMessageMap = new Map<string, { sender_id: string; content: string; created_at: string }>();
  for (const msg of lastMessages ?? []) {
    if (!lastMessageMap.has(msg.chat_room_id)) {
      lastMessageMap.set(msg.chat_room_id, {
        sender_id: msg.sender_id,
        content: msg.content,
        created_at: msg.created_at,
      });
    }
  }

  // 채팅방별 내 last_read_at map
  const myReadAtMap = new Map<string, string | null>();
  for (const p of myParticipants) {
    myReadAtMap.set(p.chat_room_id, p.last_read_at);
  }

  // 채팅방별 상대방 map
  const otherMap = new Map<string, { user_id: string; nickname: string; profile_image: string | null }>();
  for (const p of otherParticipants ?? []) {
    const profile = profileMap.get(p.user_id);
    otherMap.set(p.chat_room_id, {
      user_id: p.user_id,
      nickname: profile?.nickname ?? '(알 수 없음)',
      profile_image: profile?.profile_image ?? null,
    });
  }

  // 4. 조합
  const result = myRoomIds.map((roomId) => {
    const lastMsg = lastMessageMap.get(roomId) ?? null;
    const myLastReadAt = myReadAtMap.get(roomId) ?? null;
    const other = otherMap.get(roomId) ?? { user_id: '', nickname: '(알 수 없음)', profile_image: null };

    const lastSentByMe = lastMsg ? lastMsg.sender_id === user.id : false;
    const isRead = lastMsg
      ? lastSentByMe || (myLastReadAt != null && myLastReadAt >= lastMsg.created_at)
      : true;

    return {
      id: roomId,
      participant: {
        user_id: other.user_id,
        nickname: other.nickname,
        profile_image: other.profile_image,
      },
      lastMessage: lastMsg?.content ?? null,
      lastMessageAt: lastMsg?.created_at ?? null,
      isRead,
      lastSentByMe,
    };
  });

  // lastMessageAt 기준 내림차순 정렬
  result.sort((a, b) => {
    if (!a.lastMessageAt && !b.lastMessageAt) return 0;
    if (!a.lastMessageAt) return 1;
    if (!b.lastMessageAt) return -1;
    return b.lastMessageAt.localeCompare(a.lastMessageAt);
  });

  return NextResponse.json(result);
}

// POST /api/chat-rooms — 채팅방 생성 (이미 존재하면 기존 반환)
export async function POST(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { targetUserId } = await request.json();
  if (!targetUserId) {
    return NextResponse.json({ error: 'targetUserId is required' }, { status: 400 });
  }

  // 두 유저가 공통으로 속한 채팅방이 있는지 확인
  const { data: existing } = await supabase
    .from('chat_room_participants')
    .select('chat_room_id')
    .eq('user_id', user.id);

  const myRoomIds = (existing ?? []).map((r) => r.chat_room_id);

  if (myRoomIds.length > 0) {
    const { data: shared } = await supabase
      .from('chat_room_participants')
      .select('chat_room_id')
      .eq('user_id', targetUserId)
      .in('chat_room_id', myRoomIds);

    if (shared && shared.length > 0) {
      return NextResponse.json({ id: shared[0].chat_room_id });
    }
  }

  // 새 채팅방 생성
  const { data: newRoom, error: roomError } = await supabase
    .from('chat_rooms')
    .insert({ status: 'pending', requester_id: user.id })
    .select('id')
    .single();

  if (roomError || !newRoom) {
    return NextResponse.json({ error: roomError?.message ?? 'Failed to create room' }, { status: 500 });
  }

  // 참여자 2명 등록
  const { error: participantError } = await supabase
    .from('chat_room_participants')
    .insert([
      { chat_room_id: newRoom.id, user_id: user.id },
      { chat_room_id: newRoom.id, user_id: targetUserId },
    ]);

  if (participantError) {
    return NextResponse.json({ error: participantError.message }, { status: 500 });
  }

  return NextResponse.json({ id: newRoom.id });
}

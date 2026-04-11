import { NextResponse } from 'next/server';

import { createClient as createServerClient } from '@/lib/supabase/server';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 채팅방 정보 + 참여자 조회
  const [
    { data: room, error: roomError },
    { data: participants, error: participantsError },
  ] = await Promise.all([
    supabase
      .from('chat_rooms')
      .select('id, status, requester_id')
      .eq('id', id)
      .single(),
    supabase
      .from('chat_room_participants')
      .select('user_id')
      .eq('chat_room_id', id)
      .neq('user_id', user.id),
  ]);

  if (roomError) return NextResponse.json({ error: roomError.message }, { status: 500 });
  if (participantsError) return NextResponse.json({ error: participantsError.message }, { status: 500 });
  if (!room) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!participants?.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const targetUserId = participants[0].user_id;

  const [
    { data: otherProfile, error: profileError },
    { data: myProfile },
    { data: otherParticipant },
    { data: myParticipant },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('user_id, nickname, profile_image')
      .eq('user_id', targetUserId)
      .single(),
    supabase
      .from('profiles')
      .select('user_id, nickname, profile_image')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('chat_room_participants')
      .select('last_read_at, left_at')
      .eq('chat_room_id', id)
      .neq('user_id', user.id)
      .single(),
    supabase
      .from('chat_room_participants')
      .select('left_at')
      .eq('chat_room_id', id)
      .eq('user_id', user.id)
      .single(),
  ]);

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

  return NextResponse.json({
    id,
    status: room.status ?? 'active',
    requesterId: room.requester_id ?? null,
    participant: otherProfile,
    myProfile: myProfile ?? null,
    otherLastReadAt: otherParticipant?.last_read_at ?? null,
    myLeftAt: myParticipant?.left_at ?? null,
    otherLeftAt: otherParticipant?.left_at ?? null,
  });
}

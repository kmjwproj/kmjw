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

  // 해당 채팅방의 참여자 중 나 아닌 사람 조회
  const { data: participants, error } = await supabase
    .from('chat_room_participants')
    .select('user_id')
    .eq('chat_room_id', id)
    .neq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!participants?.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const targetUserId = participants[0].user_id;

  const [{ data: profile, error: profileError }, { data: otherParticipant }] = await Promise.all([
    supabase
      .from('profiles')
      .select('user_id, nickname, profile_image')
      .eq('user_id', targetUserId)
      .single(),
    supabase
      .from('chat_room_participants')
      .select('last_read_at')
      .eq('chat_room_id', id)
      .neq('user_id', user.id)
      .single(),
  ]);

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

  return NextResponse.json({ id, participant: profile, otherLastReadAt: otherParticipant?.last_read_at ?? null });
}

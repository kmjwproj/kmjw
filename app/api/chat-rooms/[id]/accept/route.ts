import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 수신자(나)가 참여자인지 확인
  const { data: participant } = await supabase
    .from('chat_room_participants')
    .select('user_id')
    .eq('chat_room_id', id)
    .eq('user_id', user.id)
    .single()

  if (!participant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // requester가 아닌 사람만 수락 가능 (수신자만)
  const { data: room } = await supabase
    .from('chat_rooms')
    .select('requester_id, status')
    .eq('id', id)
    .single()

  if (!room) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (room.status !== 'pending') return NextResponse.json({ error: 'Already processed' }, { status: 400 })
  if (room.requester_id === user.id) return NextResponse.json({ error: 'Requester cannot accept' }, { status: 403 })

  const { error } = await supabase
    .from('chat_rooms')
    .update({ status: 'active' })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

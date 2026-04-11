import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 수신자(나)가 참여자인지 확인
  const { data: room } = await supabase
    .from('chat_rooms')
    .select('requester_id, status')
    .eq('id', id)
    .single()

  if (!room) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (room.status !== 'pending') return NextResponse.json({ error: 'Already processed' }, { status: 400 })
  if (room.requester_id === user.id) return NextResponse.json({ error: 'Requester cannot decline' }, { status: 403 })

  // 채팅방 삭제 (CASCADE로 participants, messages 모두 삭제)
  const { error } = await supabase
    .from('chat_rooms')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

import { NextResponse } from 'next/server';

import { createClient as createServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data)
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { nickname, gender, age_range, bio, interests, profile_image } = body;

  const { data, error } = await supabase
    .from('profiles')
    .update({
      nickname,
      gender: gender || null,
      age_range: age_range || null,
      bio: bio || null,
      interests: interests?.length > 0 ? interests : null,
      profile_image: profile_image || null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

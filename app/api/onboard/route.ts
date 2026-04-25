import { NextResponse } from 'next/server';

import { createClient as createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { nickname, profile_image, gender, age_range, interests, mbti } = body;

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      nickname,
      profile_image,
      gender,
      age_range,
      interests,
      mbti: mbti || null,
      onboarded: true,
    },
  });

  if (updateError)
    return NextResponse.json({ error: updateError.message }, { status: 500 });

  const { error } = await supabase.from('profiles').upsert(
    {
      user_id: user.id,
      nickname,
      profile_image: profile_image || null,
      gender,
      age_range,
      interests,
      mbti: mbti || null,
      onboarded: true,
    },
    { onConflict: 'user_id' },
  );

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

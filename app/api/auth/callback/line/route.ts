import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(origin + '/signin?error=no_code')
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.LINE_REDIRECT_URI || origin + '/api/auth/callback/line',
        client_id: process.env.LINE_CLIENT_ID!,
        client_secret: process.env.LINE_CLIENT_SECRET!,
      }),
    })

    const tokens = await tokenResponse.json()

    if (tokens.error) {
      return NextResponse.redirect(origin + '/signin?error=token_error')
    }

    // Get profile
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    const profile = await profileResponse.json()

    if (profile.error) {
      return NextResponse.redirect(origin + '/signin?error=profile_error')
    }

    // Get or create session
    const supabase = await createServerSupabase()
    let { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      const { data, error } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            line_id: profile.userId,
          },
        },
      })

      if (error) {
        return NextResponse.redirect(origin + '/signin?error=anon_login')
      }

      // Refresh session
      ({ data: { session } } = await supabase.auth.getSession())
    }

    // Update user with Line profile info
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      session!.user.id,
      {
        user_metadata: {
          line_id: profile.userId,
          line_display_name: profile.displayName,
          line_picture_url: profile.pictureUrl || null,
        },
      }
    )

    if (updateError) {
      console.error('Update user error:', updateError)
      return NextResponse.redirect(origin + '/signin?error=update_error')
    }

    return NextResponse.redirect(origin)
  } catch (error) {
    console.error('Line callback error:', error)
    return NextResponse.redirect(origin + '/signin?error=callback_error')
  }
}
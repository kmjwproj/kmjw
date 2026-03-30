'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/use-auth-store'

export default function SignIn() {
  const { loading } = useAuthStore()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">로그인 중...</div>
  }

  return (
    <div className="container max-w-md mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[
          // 'google',
          'kakao',
          'twitter',
          'custom:line' 
        ]}
        view="sign_in"
      />

    </div>
  )
}
'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { AuthChangeEvent } from '@supabase/supabase-js'
import { useAuthStore } from '@/lib/use-auth-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchSession = useAuthStore((state) => state.fetchSession)

  useEffect(() => {
    fetchSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      useAuthStore.setState({ session, loading: false })
    })

    return () => subscription.unsubscribe()
  }, [])

  return <>{children}</>
}
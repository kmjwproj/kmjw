'use client'

import { useEffect } from 'react'
import { supabase } from '@/src/shared/lib/supabase'
import type { AuthChangeEvent } from '@supabase/supabase-js'
import { useAuthStore } from '@/src/shared/lib/supabase/useAuthStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchSession = useAuthStore((state) => state.fetchSession)
  const setSession = useAuthStore((state) => state.setSession)

  useEffect(() => {
    fetchSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [fetchSession, setSession])

  return <>{children}</>
}
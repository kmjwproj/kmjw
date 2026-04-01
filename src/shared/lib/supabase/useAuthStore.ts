import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './client'

interface AuthState {
  session: Session | null
  user: User | null
  loading: boolean
  fetchSession: () => Promise<void>
  setSession: (session: Session | null) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  loading: true,
  fetchSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ session, user: session?.user ?? null, loading: false })
    } catch (error) {
      set({ session: null, user: null, loading: false })
    }
  },
  setSession: (session) => {
    set({ session, user: session?.user ?? null, loading: false })
  },
}))
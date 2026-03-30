import { create } from 'zustand'
import { supabase } from './supabase'
import type { Session } from '@supabase/supabase-js'

interface AuthState {
  session: Session | null
  loading: boolean
  fetchSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,
  fetchSession: async () => {
    const { data } = await supabase.auth.getSession()
    set({ session: data.session, loading: false })
  },
}))
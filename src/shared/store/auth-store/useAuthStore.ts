import { createClient } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

const supabase = createClient();

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  fetchSession: () => Promise<void>;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  session: null,
  user: null,
  loading: true,
  fetchSession: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      set({ session, user: session?.user ?? null, loading: false });
    } catch (error) {
      console.error(error);
      set({ session: null, user: null, loading: false });
    }
  },
  setSession: (session) => {
    set({ session, user: session?.user ?? null, loading: false });
  },
}));

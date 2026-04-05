'use client';

import { useEffect } from 'react';

import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/src/shared/lib/supabase/useAuthStore';
import type { AuthChangeEvent } from '@supabase/supabase-js';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const fetchSession = useAuthStore((state) => state.fetchSession);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [fetchSession, setSession]);

  return <>{children}</>;
}

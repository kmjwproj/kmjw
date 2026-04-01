export { supabase, createClient as createBrowserClient } from './client'
export { createClient as createServerClient } from './server'
export { useAuthStore } from './useAuthStore'
export type { Session, User } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  return url
}

const getAnonKey = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return key
}

export const createClient = () => {
  return createBrowserClient<Database>(
    getSupabaseUrl(),
    getAnonKey()
  )
} 
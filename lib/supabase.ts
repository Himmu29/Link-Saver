import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Bookmark {
  id: string
  url: string
  title: string
  summary: string
  favicon?: string
  tags: string[]
  user_id: string
  created_at: string
  updated_at: string
}

export interface CreateBookmarkData {
  url: string
  title: string
  summary: string
  favicon?: string
  tags: string[]
  user_id: string
} 
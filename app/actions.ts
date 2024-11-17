'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export async function getNews() {
  const supabase = createServerActionClient<Database>({ cookies })
  return await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
}

export async function getNewsById(slug: string) {
  const supabase = createServerActionClient<Database>({ cookies })
  return await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .single()
} 
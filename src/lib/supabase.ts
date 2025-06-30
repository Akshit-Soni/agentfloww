import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  })
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  console.error('Invalid Supabase URL format:', supabaseUrl)
  throw new Error('Invalid Supabase URL format')
}

console.log('Initializing Supabase client with URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'agentfloww-auth-storage'
  },
  global: {
    headers: {
      'X-Client-Info': 'agentfloww-web'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Optional connection test function that can be called when needed
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    if (error) {
      console.error('Supabase connection test failed:', error)
      return false
    } else {
      console.log('Supabase connection test successful')
      return true
    }
  } catch (error) {
    console.error('Supabase connection test error:', error)
    return false
  }
}
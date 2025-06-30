import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthStore {
  user: User | null
  session: Session | null
  isLoading: boolean
  error: string | null
  
  // Actions
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: { name?: string; email?: string }) => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,

  signUp: async (email: string, password: string, name?: string) => {
    set({ isLoading: true, error: null })
    try {
      // Input validation
      if (!email || !email.includes('@')) {
        throw new Error('Please provide a valid email address')
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name?.trim() || ''
          }
        }
      })

      if (error) throw error

      // If user is created, ensure user record exists in users table
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              name: name?.trim() || '',
              password_hash: 'managed_by_supabase_auth',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            })

          if (profileError) {
            console.warn('Failed to create/update user profile:', profileError)
          }
        } catch (profileError) {
          console.warn('Failed to sync user profile:', profileError)
        }
      }

      set({ isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign up'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
      throw new Error(errorMessage)
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      // Input validation
      if (!email || !email.includes('@')) {
        throw new Error('Please provide a valid email address')
      }
      if (!password) {
        throw new Error('Password is required')
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      })

      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password')
        }
        throw error
      }

      // Ensure user record exists in users table after successful sign in
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || '',
              password_hash: 'managed_by_supabase_auth',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            })

          if (profileError) {
            console.warn('Failed to sync user profile:', profileError)
          }
        } catch (profileError) {
          console.warn('Failed to sync user profile:', profileError)
        }
      }

      set({ 
        user: data.user,
        session: data.session,
        isLoading: false,
        error: null
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
      throw new Error(errorMessage)
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      set({ 
        user: null,
        session: null,
        isLoading: false,
        error: null
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
      throw new Error(errorMessage)
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null })
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Please provide a valid email address')
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      set({ isLoading: false, error: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
      throw new Error(errorMessage)
    }
  },

  updateProfile: async (updates: { name?: string; email?: string }) => {
    set({ isLoading: true, error: null })
    try {
      const { user } = get()
      if (!user) throw new Error('No user logged in')

      // Validate inputs
      if (updates.email && !updates.email.includes('@')) {
        throw new Error('Please provide a valid email address')
      }

      // Update auth profile if email is being changed
      if (updates.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: updates.email.trim().toLowerCase()
        })
        if (authError) throw authError
      }

      // Update user profile in database
      if (updates.name) {
        const { error: profileError } = await supabase
          .from('users')
          .update({ 
            name: updates.name.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (profileError) throw profileError
      }

      set({ isLoading: false, error: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
      throw new Error(errorMessage)
    }
  },

  initialize: async () => {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error

      // If we have a session, ensure user record exists in users table
      if (session?.user) {
        try {
          const { error: profileError } = await supabase
            .from('users')
            .upsert({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || '',
              password_hash: 'managed_by_supabase_auth',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            })

          if (profileError) {
            console.warn('Failed to sync user profile on initialize:', profileError)
          }
        } catch (profileError) {
          console.warn('Failed to sync user profile on initialize:', profileError)
        }
      }

      set({ 
        user: session?.user || null,
        session,
        isLoading: false,
        error: null
      })

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        // Sync user data when auth state changes
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          try {
            const { error: profileError } = await supabase
              .from('users')
              .upsert({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || '',
                password_hash: 'managed_by_supabase_auth',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'id'
              })

            if (profileError) {
              console.warn('Failed to sync user profile on auth change:', profileError)
            }
          } catch (profileError) {
            console.warn('Failed to sync user profile on auth change:', profileError)
          }
        }

        set({ 
          user: session?.user || null,
          session,
          isLoading: false,
          error: null
        })
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize auth'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
    }
  }
}))
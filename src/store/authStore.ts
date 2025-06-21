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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || ''
          }
        }
      })

      if (error) throw error

      // If user is created, ensure user record exists in users table
      if (data.user) {
        // Use upsert to handle cases where user might already exist
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            name: name || '',
            password_hash: 'managed_by_supabase_auth', // Placeholder since field is required
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (profileError) {
          console.warn('Failed to create/update user profile:', profileError)
        }
      }

      set({ isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign up',
        isLoading: false 
      })
      throw error
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Ensure user record exists in users table after successful sign in
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || '',
            password_hash: 'managed_by_supabase_auth', // Placeholder since field is required
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (profileError) {
          console.warn('Failed to sync user profile:', profileError)
        }
      }

      set({ 
        user: data.user,
        session: data.session,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign in',
        isLoading: false 
      })
      throw error
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
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign out',
        isLoading: false 
      })
      throw error
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      set({ isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to send reset email',
        isLoading: false 
      })
      throw error
    }
  },

  updateProfile: async (updates: { name?: string; email?: string }) => {
    set({ isLoading: true, error: null })
    try {
      const { user } = get()
      if (!user) throw new Error('No user logged in')

      // Update auth profile if email is being changed
      if (updates.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: updates.email
        })
        if (authError) throw authError
      }

      // Update user profile in database
      if (updates.name) {
        const { error: profileError } = await supabase
          .from('users')
          .update({ name: updates.name })
          .eq('id', user.id)

        if (profileError) throw profileError
      }

      set({ isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile',
        isLoading: false 
      })
      throw error
    }
  },

  initialize: async () => {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error

      // If we have a session, ensure user record exists in users table
      if (session?.user) {
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || '',
            password_hash: 'managed_by_supabase_auth', // Placeholder since field is required
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (profileError) {
          console.warn('Failed to sync user profile on initialize:', profileError)
        }
      }

      set({ 
        user: session?.user || null,
        session,
        isLoading: false 
      })

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        // Sync user data when auth state changes
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          const { error: profileError } = await supabase
            .from('users')
            .upsert({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || '',
              password_hash: 'managed_by_supabase_auth', // Placeholder since field is required
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            })

          if (profileError) {
            console.warn('Failed to sync user profile on auth change:', profileError)
          }
        }

        set({ 
          user: session?.user || null,
          session,
          isLoading: false 
        })
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to initialize auth',
        isLoading: false 
      })
    }
  }
}))
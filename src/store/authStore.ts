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
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,

  clearError: () => set({ error: null }),

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

      console.log('Attempting to sign up user:', email)

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name?.trim() || ''
          }
        }
      })

      if (error) {
        console.error('Sign up error:', error)
        throw error
      }

      console.log('Sign up successful:', data.user?.id)

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
      console.error('Sign up failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign up'
      
      // Handle network errors specifically
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        set({ 
          error: 'Unable to connect to the server. Please check your internet connection and try again.',
          isLoading: false 
        })
      } else {
        set({ 
          error: errorMessage,
          isLoading: false 
        })
      }
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

      console.log('Attempting to sign in user:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      })

      if (error) {
        console.error('Sign in error:', error)
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password')
        }
        throw error
      }

      console.log('Sign in successful:', data.user?.id)

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
      console.error('Sign in failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in'
      
      // Handle network errors specifically
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        set({ 
          error: 'Unable to connect to the server. Please check your internet connection and try again.',
          isLoading: false 
        })
      } else {
        set({ 
          error: errorMessage,
          isLoading: false 
        })
      }
      throw new Error(errorMessage)
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null })
    try {
      console.log('Attempting to sign out user')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }

      console.log('Sign out successful')
      set({ 
        user: null,
        session: null,
        isLoading: false,
        error: null
      })
    } catch (error) {
      console.error('Sign out failed:', error)
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

      console.log('Attempting to reset password for:', email)

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        console.error('Reset password error:', error)
        throw error
      }

      console.log('Reset password email sent successfully')
      set({ isLoading: false, error: null })
    } catch (error) {
      console.error('Reset password failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email'
      
      // Handle network errors specifically
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        set({ 
          error: 'Unable to connect to the server. Please check your internet connection and try again.',
          isLoading: false 
        })
      } else {
        set({ 
          error: errorMessage,
          isLoading: false 
        })
      }
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

      console.log('Attempting to update profile for user:', user.id)

      // Update auth profile if email is being changed
      if (updates.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: updates.email.trim().toLowerCase()
        })
        if (authError) {
          console.error('Auth update error:', authError)
          throw authError
        }
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

        if (profileError) {
          console.error('Profile update error:', profileError)
          throw profileError
        }
      }

      console.log('Profile update successful')
      set({ isLoading: false, error: null })
    } catch (error) {
      console.error('Profile update failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      
      // Handle network errors specifically
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        set({ 
          error: 'Unable to connect to the server. Please check your internet connection and try again.',
          isLoading: false 
        })
      } else {
        set({ 
          error: errorMessage,
          isLoading: false 
        })
      }
      throw new Error(errorMessage)
    }
  },

  initialize: async () => {
    try {
      console.log('Initializing auth store...')
      
      // Get initial session with timeout
      const sessionPromise = supabase.auth.getSession()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      )

      const { data: { session }, error } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]) as any

      if (error) {
        console.error('Get session error:', error)
        throw error
      }

      console.log('Session retrieved:', !!session)

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
        console.log('Auth state changed:', event, !!session)
        
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

      console.log('Auth store initialized successfully')
    } catch (error) {
      console.error('Auth initialization failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize auth'
      
      // Handle network errors specifically
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('Connection timeout')) {
        set({ 
          error: 'Unable to connect to the authentication server. Please check your internet connection and try again.',
          isLoading: false 
        })
      } else {
        set({ 
          error: errorMessage,
          isLoading: false 
        })
      }
    }
  }
}))
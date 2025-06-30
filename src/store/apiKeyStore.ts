import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { openAIService } from '@/lib/openai/OpenAIService'

export interface ApiKey {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'google' | 'cohere'
  keyPreview: string
  isActive: boolean
  lastUsed?: string
  createdAt: string
  updatedAt: string
}

interface ApiKeyStore {
  apiKeys: ApiKey[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchApiKeys: () => Promise<void>
  addApiKey: (name: string, provider: string, key: string) => Promise<void>
  updateApiKey: (id: string, updates: Partial<ApiKey>) => Promise<void>
  deleteApiKey: (id: string) => Promise<void>
  testApiKey: (id: string) => Promise<boolean>
  getActiveKey: (provider: string) => ApiKey | null
}

export const useApiKeyStore = create<ApiKeyStore>((set, get) => ({
  apiKeys: [],
  isLoading: false,
  error: null,

  fetchApiKeys: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const apiKeys: ApiKey[] = (data || []).map(key => ({
        id: key.id,
        name: key.name,
        provider: key.provider,
        keyPreview: key.key_preview,
        isActive: key.is_active,
        lastUsed: key.last_used,
        createdAt: key.created_at,
        updatedAt: key.updated_at
      }))

      set({ apiKeys, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch API keys',
        isLoading: false 
      })
    }
  },

  addApiKey: async (name: string, provider: string, key: string) => {
    set({ isLoading: true, error: null })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Validate the API key based on provider
      await get().validateApiKey(provider, key)

      // Hash the key for storage (in production, use proper encryption)
      const keyHash = await get().hashApiKey(key)
      const keyPreview = `${key.slice(0, 3)}...${key.slice(-4)}`

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          name,
          provider,
          key_hash: keyHash,
          key_preview: keyPreview,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error

      const newApiKey: ApiKey = {
        id: data.id,
        name: data.name,
        provider: data.provider,
        keyPreview: data.key_preview,
        isActive: data.is_active,
        lastUsed: data.last_used,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }

      // Initialize the service with the new key if it's OpenAI
      if (provider === 'openai' && data.is_active) {
        await openAIService.initialize(key)
      }

      set(state => ({ 
        apiKeys: [newApiKey, ...state.apiKeys],
        isLoading: false 
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add API key',
        isLoading: false 
      })
      throw error
    }
  },

  updateApiKey: async (id: string, updates: Partial<ApiKey>) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .update({
          name: updates.name,
          is_active: updates.isActive,
          last_used: updates.lastUsed ? new Date(updates.lastUsed).toISOString() : undefined
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set(state => ({
        apiKeys: state.apiKeys.map(key =>
          key.id === id
            ? { 
                ...key, 
                name: data.name,
                isActive: data.is_active,
                lastUsed: data.last_used,
                updatedAt: data.updated_at
              }
            : key
        ),
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update API key',
        isLoading: false 
      })
    }
  },

  deleteApiKey: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id)

      if (error) throw error

      set(state => ({
        apiKeys: state.apiKeys.filter(key => key.id !== id),
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete API key',
        isLoading: false 
      })
    }
  },

  testApiKey: async (id: string) => {
    try {
      const apiKey = get().apiKeys.find(key => key.id === id)
      if (!apiKey) throw new Error('API key not found')

      // Get the actual key from the database (in production, decrypt it)
      const { data, error } = await supabase
        .from('api_keys')
        .select('key_hash')
        .eq('id', id)
        .single()

      if (error) throw error

      // For testing purposes, we'll simulate validation
      // In production, you'd decrypt the key and test it
      const isValid = await get().validateApiKey(apiKey.provider, 'test-key')
      
      if (isValid) {
        // Update last used timestamp
        await get().updateApiKey(id, { lastUsed: new Date().toISOString() })
      }

      return isValid
    } catch (error) {
      console.error('API key test failed:', error)
      return false
    }
  },

  getActiveKey: (provider: string) => {
    const { apiKeys } = get()
    return apiKeys.find(key => key.provider === provider && key.isActive) || null
  },

  // Helper methods (these would be private in a class)
  validateApiKey: async (provider: string, key: string): Promise<boolean> => {
    switch (provider) {
      case 'openai':
        return key.startsWith('sk-') && key.length > 20
      case 'anthropic':
        return key.startsWith('sk-ant-') && key.length > 20
      case 'google':
        return key.length > 20
      case 'cohere':
        return key.length > 20
      default:
        return false
    }
  },

  hashApiKey: async (key: string): Promise<string> => {
    // In production, use proper encryption/hashing
    // For now, we'll use a simple hash
    const encoder = new TextEncoder()
    const data = encoder.encode(key)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
}))
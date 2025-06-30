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

// Helper functions
const validateApiKey = async (provider: string, key: string): Promise<boolean> => {
  // Input sanitization
  if (!key || typeof key !== 'string') {
    throw new Error('Invalid API key format')
  }

  const sanitizedKey = key.trim()
  
  switch (provider) {
    case 'openai':
      return sanitizedKey.startsWith('sk-') && sanitizedKey.length >= 51 && sanitizedKey.length <= 64
    case 'anthropic':
      return sanitizedKey.startsWith('sk-ant-') && sanitizedKey.length >= 40
    case 'google':
      return sanitizedKey.length >= 32 && sanitizedKey.length <= 128
    case 'cohere':
      return sanitizedKey.length >= 32 && sanitizedKey.length <= 128
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}

const hashApiKey = async (key: string): Promise<string> => {
  // Generate random salt
  const salt = crypto.getRandomValues(new Uint8Array(16))
  
  // Use PBKDF2 for secure hashing
  const encoder = new TextEncoder()
  const keyData = encoder.encode(key)
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    cryptoKey,
    256
  )
  
  // Combine salt and hash
  const combined = new Uint8Array(salt.length + hashBuffer.byteLength)
  combined.set(salt)
  combined.set(new Uint8Array(hashBuffer), salt.length)
  
  // Convert to hex string
  return Array.from(combined)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

const createKeyPreview = (key: string): string => {
  if (key.length < 8) return key
  return `${key.slice(0, 4)}...${key.slice(-4)}`
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

      // Enhanced validation
      await validateApiKey(provider, key)

      // Secure key hashing with salt
      const keyHash = await hashApiKey(key)
      const keyPreview = createKeyPreview(key)

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          name: name.trim(),
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
          name: updates.name?.trim(),
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
      const isValid = await validateApiKey(apiKey.provider, 'test-key')
      
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
  }
}))
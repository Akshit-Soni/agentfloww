import { supabase } from '@/lib/supabase'

export interface OpenAIConfig {
  apiKey: string
  organization?: string
  baseURL?: string
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenAIRequest {
  model: string
  messages: OpenAIMessage[]
  temperature?: number
  max_tokens?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  stream?: boolean
}

export interface OpenAIResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: OpenAIMessage
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface OpenAIUsage {
  userId: string
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
  timestamp: string
}

export class OpenAIService {
  private config: OpenAIConfig | null = null
  private rateLimiter: Map<string, number[]> = new Map()
  private readonly RATE_LIMIT_WINDOW = 60000 // 1 minute
  private readonly MAX_REQUESTS_PER_MINUTE = 60

  async initialize(apiKey: string, organization?: string): Promise<void> {
    if (!apiKey || !apiKey.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format')
    }

    this.config = {
      apiKey,
      organization,
      baseURL: 'https://api.openai.com/v1'
    }

    // Validate API key by making a test request
    await this.validateApiKey()
  }

  private async validateApiKey(): Promise<void> {
    if (!this.config) {
      throw new Error('OpenAI service not initialized')
    }

    try {
      const response = await fetch(`${this.config.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          ...(this.config.organization && { 'OpenAI-Organization': this.config.organization })
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`API key validation failed: ${error.error?.message || response.statusText}`)
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to validate OpenAI API key: ${error.message}`)
      }
      throw new Error('Failed to validate OpenAI API key')
    }
  }

  private checkRateLimit(userId: string): void {
    const now = Date.now()
    const userRequests = this.rateLimiter.get(userId) || []
    
    // Remove requests older than the window
    const recentRequests = userRequests.filter(timestamp => now - timestamp < this.RATE_LIMIT_WINDOW)
    
    if (recentRequests.length >= this.MAX_REQUESTS_PER_MINUTE) {
      throw new Error('Rate limit exceeded. Please wait before making more requests.')
    }
    
    // Add current request
    recentRequests.push(now)
    this.rateLimiter.set(userId, recentRequests)
  }

  async generateCompletion(request: OpenAIRequest, userId: string): Promise<OpenAIResponse> {
    if (!this.config) {
      throw new Error('OpenAI service not initialized')
    }

    // Check rate limiting
    this.checkRateLimit(userId)

    // Validate request
    this.validateRequest(request)

    const startTime = Date.now()

    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          ...(this.config.organization && { 'OpenAI-Organization': this.config.organization })
        },
        body: JSON.stringify({
          ...request,
          user: userId // For OpenAI's abuse monitoring
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
      }

      const result: OpenAIResponse = await response.json()
      const executionTime = Date.now() - startTime

      // Track usage
      await this.trackUsage({
        userId,
        model: request.model,
        promptTokens: result.usage.prompt_tokens,
        completionTokens: result.usage.completion_tokens,
        totalTokens: result.usage.total_tokens,
        cost: this.calculateCost(request.model, result.usage),
        timestamp: new Date().toISOString()
      })

      // Log successful request
      console.log(`OpenAI request completed in ${executionTime}ms`, {
        model: request.model,
        tokens: result.usage.total_tokens,
        cost: this.calculateCost(request.model, result.usage)
      })

      return result
    } catch (error) {
      const executionTime = Date.now() - startTime
      console.error(`OpenAI request failed after ${executionTime}ms:`, error)
      
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Unknown error occurred during OpenAI request')
    }
  }

  private validateRequest(request: OpenAIRequest): void {
    if (!request.model) {
      throw new Error('Model is required')
    }

    if (!request.messages || request.messages.length === 0) {
      throw new Error('Messages array is required and cannot be empty')
    }

    // Validate message format
    for (const message of request.messages) {
      if (!message.role || !['system', 'user', 'assistant'].includes(message.role)) {
        throw new Error('Invalid message role')
      }
      if (!message.content || typeof message.content !== 'string') {
        throw new Error('Message content is required and must be a string')
      }
    }

    // Validate parameters
    if (request.temperature !== undefined && (request.temperature < 0 || request.temperature > 2)) {
      throw new Error('Temperature must be between 0 and 2')
    }

    if (request.max_tokens !== undefined && request.max_tokens < 1) {
      throw new Error('Max tokens must be greater than 0')
    }
  }

  private calculateCost(model: string, usage: { prompt_tokens: number; completion_tokens: number }): number {
    // Pricing per 1K tokens (as of 2025)
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
      'gpt-3.5-turbo-16k': { input: 0.003, output: 0.004 }
    }

    const modelPricing = pricing[model] || pricing['gpt-3.5-turbo']
    const inputCost = (usage.prompt_tokens / 1000) * modelPricing.input
    const outputCost = (usage.completion_tokens / 1000) * modelPricing.output
    
    return inputCost + outputCost
  }

  private async trackUsage(usage: OpenAIUsage): Promise<void> {
    try {
      // Store usage data for billing and analytics
      await supabase
        .from('openai_usage')
        .insert({
          user_id: usage.userId,
          model: usage.model,
          prompt_tokens: usage.promptTokens,
          completion_tokens: usage.completionTokens,
          total_tokens: usage.totalTokens,
          cost: usage.cost,
          created_at: usage.timestamp
        })
    } catch (error) {
      console.warn('Failed to track OpenAI usage:', error)
    }
  }

  async getAvailableModels(): Promise<string[]> {
    if (!this.config) {
      throw new Error('OpenAI service not initialized')
    }

    try {
      const response = await fetch(`${this.config.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          ...(this.config.organization && { 'OpenAI-Organization': this.config.organization })
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch available models')
      }

      const data = await response.json()
      return data.data
        .filter((model: any) => model.id.includes('gpt'))
        .map((model: any) => model.id)
        .sort()
    } catch (error) {
      console.error('Failed to fetch OpenAI models:', error)
      // Return default models if API call fails
      return ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo']
    }
  }

  async getUserUsage(userId: string, startDate?: string, endDate?: string): Promise<OpenAIUsage[]> {
    try {
      let query = supabase
        .from('openai_usage')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (startDate) {
        query = query.gte('created_at', startDate)
      }
      if (endDate) {
        query = query.lte('created_at', endDate)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Failed to fetch user usage:', error)
      return []
    }
  }

  isInitialized(): boolean {
    return this.config !== null
  }

  getConfig(): OpenAIConfig | null {
    return this.config
  }
}

// Singleton instance
export const openAIService = new OpenAIService()
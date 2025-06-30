import { supabase } from '@/lib/supabase'
import { openAIService } from '@/lib/openai/OpenAIService'
import { useApiKeyStore } from '@/store/apiKeyStore'

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMRequest {
  model: string
  messages: LLMMessage[]
  temperature?: number
  maxTokens?: number
  userId: string
}

export interface LLMResponse {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
  finishReason: string
  cost?: number
}

export class LLMService {
  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    try {
      // Determine provider based on model
      const provider = this.getProviderFromModel(request.model)
      
      // Get active API key for the provider
      const apiKey = useApiKeyStore.getState().getActiveKey(provider)
      if (!apiKey) {
        throw new Error(`No active API key found for ${provider}. Please add an API key in settings.`)
      }

      // Route to appropriate service based on provider
      switch (provider) {
        case 'openai':
          return await this.callOpenAI(request)
        case 'anthropic':
          return await this.callAnthropic(request)
        case 'google':
          return await this.callGoogle(request)
        default:
          throw new Error(`Unsupported provider: ${provider}`)
      }
    } catch (error) {
      // Log the error for monitoring
      await this.logLLMError(request, error)
      throw error
    }
  }

  private async callOpenAI(request: LLMRequest): Promise<LLMResponse> {
    if (!openAIService.isInitialized()) {
      const apiKey = useApiKeyStore.getState().getActiveKey('openai')
      if (!apiKey) {
        throw new Error('OpenAI API key not configured')
      }
      // In production, decrypt the key
      await openAIService.initialize('placeholder-key')
    }

    const response = await openAIService.generateCompletion({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature,
      max_tokens: request.maxTokens
    }, request.userId)

    return {
      content: response.choices[0].message.content,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens
      },
      model: response.model,
      finishReason: response.choices[0].finish_reason
    }
  }

  private async callAnthropic(request: LLMRequest): Promise<LLMResponse> {
    // Mock Anthropic implementation
    const mockResponse: LLMResponse = {
      content: this.generateMockResponse(request.messages),
      usage: {
        promptTokens: this.estimateTokens(request.messages.map(m => m.content).join(' ')),
        completionTokens: 50,
        totalTokens: 0
      },
      model: request.model,
      finishReason: 'stop'
    }
    
    mockResponse.usage.totalTokens = mockResponse.usage.promptTokens + mockResponse.usage.completionTokens
    return mockResponse
  }

  private async callGoogle(request: LLMRequest): Promise<LLMResponse> {
    // Mock Google implementation
    const mockResponse: LLMResponse = {
      content: this.generateMockResponse(request.messages),
      usage: {
        promptTokens: this.estimateTokens(request.messages.map(m => m.content).join(' ')),
        completionTokens: 50,
        totalTokens: 0
      },
      model: request.model,
      finishReason: 'stop'
    }
    
    mockResponse.usage.totalTokens = mockResponse.usage.promptTokens + mockResponse.usage.completionTokens
    return mockResponse
  }

  private getProviderFromModel(model: string): string {
    if (model.startsWith('gpt-')) return 'openai'
    if (model.startsWith('claude-')) return 'anthropic'
    if (model.startsWith('gemini-')) return 'google'
    if (model.startsWith('command-')) return 'cohere'
    return 'openai' // default
  }

  private generateMockResponse(messages: LLMMessage[]): string {
    const lastMessage = messages[messages.length - 1]
    const systemMessage = messages.find(m => m.role === 'system')
    
    // Generate a contextual mock response based on the conversation
    if (lastMessage?.content.toLowerCase().includes('hello')) {
      return "Hello! I'm an AI assistant. How can I help you today?"
    }
    
    if (lastMessage?.content.toLowerCase().includes('analyze')) {
      return "Based on my analysis, I can see several key patterns and insights in the data you've provided. Here are the main findings:\n\n1. The primary trend shows...\n2. There are notable correlations between...\n3. I recommend focusing on..."
    }
    
    if (lastMessage?.content.toLowerCase().includes('write') || lastMessage?.content.toLowerCase().includes('content')) {
      return "Here's a well-structured piece of content based on your requirements:\n\n# Title\n\nThis content addresses your key points while maintaining an engaging tone and clear structure. The main sections cover the essential topics you've outlined."
    }
    
    if (systemMessage?.content.includes('customer support')) {
      return "Thank you for contacting us! I understand your concern and I'm here to help. Let me look into this matter for you and provide the best possible solution."
    }
    
    // Default response
    return `I understand your request: "${lastMessage?.content}". Based on the context provided, here's my response with relevant information and actionable insights.`
  }

  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4)
  }

  private async logLLMError(request: LLMRequest, error: any): Promise<void> {
    try {
      console.error('LLM request failed:', {
        model: request.model,
        userId: request.userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } catch (logError) {
      console.warn('Failed to log LLM error:', logError)
    }
  }

  async validateApiKey(provider: string, apiKey: string): Promise<boolean> {
    try {
      switch (provider) {
        case 'openai':
          await openAIService.initialize(apiKey)
          return true
        case 'anthropic':
          // Mock validation for Anthropic
          return apiKey.startsWith('sk-ant-') && apiKey.length > 20
        case 'google':
          // Mock validation for Google
          return apiKey.length > 20
        default:
          return false
      }
    } catch (error) {
      return false
    }
  }

  getSupportedModels(): string[] {
    return [
      'gpt-4',
      'gpt-4-turbo',
      'gpt-3.5-turbo',
      'claude-3-sonnet',
      'claude-3-haiku',
      'gemini-pro'
    ]
  }

  getModelInfo(model: string): { provider: string; contextWindow: number; costPer1kTokens: number } {
    const modelInfo: Record<string, { provider: string; contextWindow: number; costPer1kTokens: number }> = {
      'gpt-4': { provider: 'OpenAI', contextWindow: 8192, costPer1kTokens: 0.03 },
      'gpt-4-turbo': { provider: 'OpenAI', contextWindow: 128000, costPer1kTokens: 0.01 },
      'gpt-3.5-turbo': { provider: 'OpenAI', contextWindow: 16384, costPer1kTokens: 0.002 },
      'claude-3-sonnet': { provider: 'Anthropic', contextWindow: 200000, costPer1kTokens: 0.015 },
      'claude-3-haiku': { provider: 'Anthropic', contextWindow: 200000, costPer1kTokens: 0.0025 },
      'gemini-pro': { provider: 'Google', contextWindow: 32768, costPer1kTokens: 0.001 }
    }

    return modelInfo[model] || { provider: 'Unknown', contextWindow: 4096, costPer1kTokens: 0.01 }
  }
}
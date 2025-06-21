import { supabase } from '@/lib/supabase'

export interface ToolExecutionResult {
  success: boolean
  output: any
  error?: string
  executionTime: number
}

export class ToolService {
  async executeTool(toolId: string, input: any, userId: string): Promise<ToolExecutionResult> {
    const startTime = Date.now()

    try {
      // Get tool configuration
      const { data: tool, error: toolError } = await supabase
        .from('tools')
        .select('*')
        .eq('id', toolId)
        .single()

      if (toolError || !tool) {
        throw new Error(`Tool not found: ${toolId}`)
      }

      // Check if user has access to this tool
      if (!tool.is_built_in && tool.user_id !== userId) {
        throw new Error('Access denied to this tool')
      }

      // Execute tool based on type
      let result: any
      switch (tool.type) {
        case 'api':
          result = await this.executeApiTool(tool, input)
          break
        case 'webhook':
          result = await this.executeWebhookTool(tool, input)
          break
        case 'email':
          result = await this.executeEmailTool(tool, input)
          break
        case 'ai':
          result = await this.executeAiTool(tool, input)
          break
        default:
          result = await this.executeCustomTool(tool, input)
      }

      const executionTime = Date.now() - startTime

      // Log execution
      await this.logExecution(toolId, userId, 'completed', input, result, executionTime)

      return {
        success: true,
        output: result,
        executionTime
      }
    } catch (error) {
      const executionTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      // Log failed execution
      await this.logExecution(toolId, userId, 'failed', input, null, executionTime, errorMessage)

      return {
        success: false,
        output: null,
        error: errorMessage,
        executionTime
      }
    }
  }

  private async executeApiTool(tool: any, input: any): Promise<any> {
    const config = tool.config
    const endpoint = config.endpoint
    const method = config.method || 'GET'
    const headers = config.headers || {}
    const timeout = config.timeout || 30000

    if (!endpoint) {
      throw new Error('API endpoint not configured')
    }

    // Replace parameter placeholders in URL
    let url = endpoint
    if (config.parameters) {
      config.parameters.forEach((param: any) => {
        if (input[param.name] !== undefined) {
          url = url.replace(`{${param.name}}`, encodeURIComponent(input[param.name]))
        }
      })
    }

    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      signal: AbortSignal.timeout(timeout)
    }

    // Add body for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      requestOptions.body = JSON.stringify(input)
    }

    const response = await fetch(url, requestOptions)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    
    return {
      status: response.status,
      statusText: response.statusText,
      data: result,
      headers: Object.fromEntries(response.headers.entries())
    }
  }

  private async executeWebhookTool(tool: any, input: any): Promise<any> {
    // Similar to API tool but specifically for webhooks
    return await this.executeApiTool(tool, input)
  }

  private async executeEmailTool(tool: any, input: any): Promise<any> {
    // Mock email sending for now
    const { to, subject, body } = input

    if (!to || !subject || !body) {
      throw new Error('Missing required email parameters: to, subject, body')
    }

    // In a real implementation, this would integrate with an email service
    return {
      success: true,
      message: `Email sent to ${to}`,
      messageId: `msg_${Date.now()}`,
      timestamp: new Date().toISOString()
    }
  }

  private async executeAiTool(tool: any, input: any): Promise<any> {
    // Mock AI tool execution (e.g., web search, text analysis)
    const { query } = input

    if (!query) {
      throw new Error('Missing required parameter: query')
    }

    // Mock search results
    return {
      query,
      results: [
        {
          title: 'Mock Search Result 1',
          url: 'https://example.com/result1',
          snippet: 'This is a mock search result for demonstration purposes.'
        },
        {
          title: 'Mock Search Result 2',
          url: 'https://example.com/result2',
          snippet: 'Another mock search result with relevant information.'
        }
      ],
      timestamp: new Date().toISOString()
    }
  }

  private async executeCustomTool(tool: any, input: any): Promise<any> {
    // Mock custom tool execution
    return {
      success: true,
      message: `Custom tool "${tool.name}" executed successfully`,
      input,
      timestamp: new Date().toISOString()
    }
  }

  private async logExecution(
    toolId: string,
    userId: string,
    status: string,
    input: any,
    output: any,
    executionTime: number,
    errorMessage?: string
  ) {
    try {
      await supabase
        .from('tool_executions')
        .insert({
          tool_id: toolId,
          user_id: userId,
          status,
          input_data: input,
          output_data: output,
          error_message: errorMessage,
          execution_time_ms: executionTime
        })
    } catch (error) {
      console.error('Failed to log tool execution:', error)
    }
  }
}
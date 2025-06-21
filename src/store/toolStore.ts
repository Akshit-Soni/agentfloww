import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { Tool, ToolExecution } from '@/types/tool'

interface ToolStore {
  tools: Tool[]
  executions: ToolExecution[]
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchTools: () => Promise<void>
  createTool: (tool: Partial<Tool>) => Promise<Tool>
  updateTool: (id: string, updates: Partial<Tool>) => Promise<void>
  deleteTool: (id: string) => Promise<void>
  testTool: (id: string, input: any) => Promise<ToolExecution>
  fetchExecutions: (toolId?: string) => Promise<void>
}

// Built-in tools that come with the platform
const builtInTools: Tool[] = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Search the web for up-to-date information',
    type: 'ai',
    category: 'data',
    status: 'active',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: {
      parameters: [
        {
          id: 'query',
          name: 'query',
          type: 'string',
          required: true,
          description: 'The search query'
        }
      ]
    }
  },
  {
    id: 'email-sender',
    name: 'Email Sender',
    description: 'Send emails via SMTP or email service',
    type: 'email',
    category: 'communication',
    status: 'active',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: {
      parameters: [
        {
          id: 'to',
          name: 'to',
          type: 'string',
          required: true,
          description: 'Recipient email address'
        },
        {
          id: 'subject',
          name: 'subject',
          type: 'string',
          required: true,
          description: 'Email subject'
        },
        {
          id: 'body',
          name: 'body',
          type: 'string',
          required: true,
          description: 'Email body content'
        }
      ]
    }
  },
  {
    id: 'http-request',
    name: 'HTTP Request',
    description: 'Make HTTP requests to any API endpoint',
    type: 'api',
    category: 'integration',
    status: 'active',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: {
      method: 'GET',
      parameters: [
        {
          id: 'url',
          name: 'url',
          type: 'string',
          required: true,
          description: 'The URL to make the request to'
        },
        {
          id: 'headers',
          name: 'headers',
          type: 'object',
          required: false,
          description: 'Request headers'
        },
        {
          id: 'body',
          name: 'body',
          type: 'object',
          required: false,
          description: 'Request body for POST/PUT requests'
        }
      ]
    }
  }
]

export const useToolStore = create<ToolStore>((set, get) => ({
  tools: builtInTools,
  executions: [],
  isLoading: false,
  error: null,

  fetchTools: async () => {
    set({ isLoading: true, error: null })
    try {
      // For now, we'll use the built-in tools
      // In a real implementation, you'd fetch custom tools from the database
      set({ tools: builtInTools, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tools', 
        isLoading: false 
      })
    }
  },

  createTool: async (toolData) => {
    set({ isLoading: true, error: null })
    try {
      const newTool: Tool = {
        id: Math.random().toString(36).substr(2, 9),
        name: toolData.name || 'New Tool',
        description: toolData.description || '',
        type: toolData.type || 'custom',
        category: toolData.category || 'utility',
        status: 'inactive',
        isBuiltIn: false,
        config: toolData.config || { parameters: [] },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      set(state => ({ 
        tools: [...state.tools, newTool], 
        isLoading: false 
      }))
      
      return newTool
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create tool', 
        isLoading: false 
      })
      throw error
    }
  },

  updateTool: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      set(state => ({
        tools: state.tools.map(tool =>
          tool.id === id
            ? { ...tool, ...updates, updatedAt: new Date().toISOString() }
            : tool
        ),
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update tool', 
        isLoading: false 
      })
    }
  },

  deleteTool: async (id) => {
    set({ isLoading: true, error: null })
    try {
      set(state => ({
        tools: state.tools.filter(tool => tool.id !== id && !tool.isBuiltIn),
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete tool', 
        isLoading: false 
      })
    }
  },

  testTool: async (id, input) => {
    set({ isLoading: true, error: null })
    try {
      const tool = get().tools.find(t => t.id === id)
      if (!tool) throw new Error('Tool not found')

      // Mock tool execution
      const execution: ToolExecution = {
        id: Math.random().toString(36).substr(2, 9),
        toolId: id,
        status: 'completed',
        input,
        output: {
          success: true,
          message: `Tool "${tool.name}" executed successfully`,
          data: { result: 'Mock response data' }
        },
        executionTime: Math.floor(Math.random() * 1000) + 100,
        createdAt: new Date().toISOString()
      }

      set(state => ({
        executions: [execution, ...state.executions],
        isLoading: false
      }))

      return execution
    } catch (error) {
      const execution: ToolExecution = {
        id: Math.random().toString(36).substr(2, 9),
        toolId: id,
        status: 'failed',
        input,
        output: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: 0,
        createdAt: new Date().toISOString()
      }

      set(state => ({
        executions: [execution, ...state.executions],
        error: error instanceof Error ? error.message : 'Failed to test tool',
        isLoading: false
      }))

      return execution
    }
  },

  fetchExecutions: async (toolId) => {
    set({ isLoading: true, error: null })
    try {
      // Mock executions data
      const mockExecutions: ToolExecution[] = []
      set({ executions: mockExecutions, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch executions', 
        isLoading: false 
      })
    }
  }
}))
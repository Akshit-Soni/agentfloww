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

export const useToolStore = create<ToolStore>((set, get) => ({
  tools: [],
  executions: [],
  isLoading: false,
  error: null,

  fetchTools: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const tools: Tool[] = (data || []).map(tool => ({
        id: tool.id,
        name: tool.name,
        description: tool.description || '',
        type: tool.type,
        category: tool.category,
        status: tool.status,
        config: tool.config,
        isBuiltIn: tool.is_built_in,
        createdAt: tool.created_at,
        updatedAt: tool.updated_at,
        userId: tool.user_id
      }))

      set({ tools, isLoading: false })
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('tools')
        .insert({
          user_id: user.id,
          name: toolData.name || 'New Tool',
          description: toolData.description || '',
          type: toolData.type || 'custom',
          category: toolData.category || 'utility',
          status: toolData.status || 'inactive',
          config: toolData.config || { parameters: [] },
          is_built_in: false
        })
        .select()
        .single()

      if (error) throw error

      const newTool: Tool = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        type: data.type,
        category: data.category,
        status: data.status,
        config: data.config,
        isBuiltIn: data.is_built_in,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        userId: data.user_id
      }
      
      set(state => ({ 
        tools: [newTool, ...state.tools], 
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
      const { data, error } = await supabase
        .from('tools')
        .update({
          name: updates.name,
          description: updates.description,
          type: updates.type,
          category: updates.category,
          status: updates.status,
          config: updates.config
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set(state => ({
        tools: state.tools.map(tool =>
          tool.id === id
            ? { 
                ...tool, 
                ...updates, 
                updatedAt: data.updated_at 
              }
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
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id)

      if (error) throw error

      set(state => ({
        tools: state.tools.filter(tool => tool.id !== id),
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const tool = get().tools.find(t => t.id === id)
      if (!tool) throw new Error('Tool not found')

      const startTime = Date.now()
      
      // Mock tool execution for now
      // In a real implementation, this would call the actual tool
      let output: any
      let status: 'completed' | 'failed' = 'completed'
      let errorMessage: string | undefined

      try {
        if (tool.type === 'api' && tool.config.endpoint) {
          // Mock API call
          output = {
            success: true,
            message: `API call to ${tool.config.endpoint} completed`,
            data: { mockResponse: 'This is a mock response' },
            statusCode: 200
          }
        } else {
          output = {
            success: true,
            message: `Tool "${tool.name}" executed successfully`,
            data: { result: 'Mock execution result', input }
          }
        }
      } catch (error) {
        status = 'failed'
        errorMessage = error instanceof Error ? error.message : 'Unknown error'
        output = null
      }

      const executionTime = Date.now() - startTime

      // Save execution to database
      const { data: executionData, error: executionError } = await supabase
        .from('tool_executions')
        .insert({
          tool_id: id,
          user_id: user.id,
          status,
          input_data: input,
          output_data: output,
          error_message: errorMessage,
          execution_time_ms: executionTime
        })
        .select()
        .single()

      if (executionError) throw executionError

      const execution: ToolExecution = {
        id: executionData.id,
        toolId: executionData.tool_id,
        status: executionData.status,
        input: executionData.input_data,
        output: executionData.output_data,
        error: executionData.error_message,
        executionTime: executionData.execution_time_ms,
        createdAt: executionData.created_at
      }

      set(state => ({
        executions: [execution, ...state.executions],
        isLoading: false
      }))

      return execution
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to test tool',
        isLoading: false 
      })
      throw error
    }
  },

  fetchExecutions: async (toolId) => {
    set({ isLoading: true, error: null })
    try {
      let query = supabase
        .from('tool_executions')
        .select(`
          *,
          tools!inner(name)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (toolId) {
        query = query.eq('tool_id', toolId)
      }

      const { data, error } = await query

      if (error) throw error

      const executions: ToolExecution[] = (data || []).map(execution => ({
        id: execution.id,
        toolId: execution.tool_id,
        status: execution.status,
        input: execution.input_data,
        output: execution.output_data,
        error: execution.error_message,
        executionTime: execution.execution_time_ms,
        createdAt: execution.created_at
      }))

      set({ executions, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch executions', 
        isLoading: false 
      })
    }
  }
}))
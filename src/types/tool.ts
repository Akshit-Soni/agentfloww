export interface Tool {
  id: string
  name: string
  description: string
  type: ToolType
  category: ToolCategory
  status: ToolStatus
  config: ToolConfig
  isBuiltIn: boolean
  createdAt: string
  updatedAt: string
  userId?: string
}

export type ToolType = 
  | 'api'
  | 'webhook'
  | 'database'
  | 'file'
  | 'email'
  | 'calendar'
  | 'social'
  | 'ai'
  | 'custom'

export type ToolCategory = 
  | 'communication'
  | 'data'
  | 'automation'
  | 'ai'
  | 'integration'
  | 'utility'

export type ToolStatus = 'active' | 'inactive' | 'error' | 'testing'

export interface ToolConfig {
  endpoint?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  authentication?: ToolAuthentication
  parameters: ToolParameter[]
  responseMapping?: Record<string, string>
  timeout?: number
  retries?: number
}

export interface ToolAuthentication {
  type: 'none' | 'api-key' | 'bearer' | 'basic' | 'oauth'
  config: Record<string, any>
}

export interface ToolParameter {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required: boolean
  description: string
  defaultValue?: any
  validation?: ToolParameterValidation
}

export interface ToolParameterValidation {
  min?: number
  max?: number
  pattern?: string
  enum?: string[]
}

export interface ToolExecution {
  id: string
  toolId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  input: any
  output: any
  error?: string
  executionTime: number
  createdAt: string
}
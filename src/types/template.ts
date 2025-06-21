export interface AgentTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  icon: string
  estimatedSetupTime: string
  useCases: string[]
  features: string[]
  agentConfig: {
    name: string
    description: string
    type: 'llm' | 'rule' | 'event' | 'hybrid'
    persona: string
    primaryObjective: string
    tools: string[] // Tool IDs
    workflow: {
      nodes: any[]
      edges: any[]
      settings: any
    }
  }
  requiredApiKeys: string[] // Provider names
  setupInstructions: SetupStep[]
  isPopular: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  complexity: 'simple' | 'moderate' | 'complex'
  tags: string[]
  icon: string
  estimatedExecutionTime: string
  workflow: {
    nodes: any[]
    edges: any[]
    settings: any
  }
  requiredTools: string[] // Tool IDs
  inputSchema: any
  outputSchema: any
  usageExamples: UsageExample[]
  isPopular: boolean
  createdAt: string
  updatedAt: string
}

export type TemplateCategory = 
  | 'customer-service'
  | 'content-creation'
  | 'data-analysis'
  | 'automation'
  | 'research'
  | 'communication'
  | 'productivity'
  | 'marketing'
  | 'sales'
  | 'hr'

export interface SetupStep {
  id: string
  title: string
  description: string
  type: 'config' | 'api-key' | 'tool' | 'test'
  required: boolean
  estimatedTime: string
}

export interface UsageExample {
  title: string
  description: string
  input: any
  expectedOutput: any
}
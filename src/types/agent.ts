import { Node, Edge } from 'reactflow'

export interface WorkflowNode extends Omit<Node, 'type'> {
  type: string
  data: {
    label: string
    config?: Record<string, any>
    description?: string
    [key: string]: any
  }
}

export type WorkflowEdge = Edge & {
  id: string
  source: string
  target: string
  type?: string
  animated?: boolean
  style?: Record<string, any>
  data?: Record<string, any>
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  settings: {
    timeout?: number
    retries?: number
    parallelism?: number
    logging?: boolean
    [key: string]: any
  }
}

export interface AgentMetrics {
  totalRuns: number
  successRate: number
  avgResponseTime: number
  errorCount: number
  lastRun?: string
}

export interface AgentDeployment {
  url?: string
  status: 'draft' | 'active' | 'inactive' | 'deployed'
  deployedAt?: string
  version?: string
}

export interface ExecutionContext {
  executionId: string
  agentId: string
  userId: string
  input: any
  variables: Record<string, any>
  currentNodeId: string
}

export interface ExecutionResult {
  success: boolean
  output: any
  error?: string
  executionTime: number
  steps: ExecutionStep[]
}

export interface ExecutionStep {
  nodeId: string
  nodeType: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  input: any
  output: any
  error?: string
  startTime: number
  endTime?: number
}
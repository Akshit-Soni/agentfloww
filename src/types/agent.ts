import { Node, Edge } from 'reactflow'

export interface WorkflowNode extends Node {
  data: {
    label: string
    config?: Record<string, any>
    description?: string
    [key: string]: any
  }
}

export interface WorkflowEdge extends Edge {
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
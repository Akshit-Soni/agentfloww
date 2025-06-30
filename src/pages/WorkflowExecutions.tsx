import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAgentStore } from '@/store/agentStore'
import { 
  Play, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  MoreVertical,
  Calendar,
  Download
} from 'lucide-react'
import { formatDateTime, formatRelativeTime } from '@/lib/utils'

interface WorkflowExecution {
  id: string
  agentId: string
  agentName: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt: string
  completedAt?: string
  executionTime?: number
  input: any
  output?: any
  error?: string
  steps: ExecutionStep[]
}

interface ExecutionStep {
  id: string
  nodeId: string
  nodeType: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt: string
  completedAt?: string
  executionTime?: number
  input?: any
  output?: any
  error?: string
}

export function WorkflowExecutions() {
  const { agents, fetchAgents } = useAgentStore()
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterAgent, setFilterAgent] = useState<string>('all')
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
    fetchExecutions()
  }, [fetchAgents])

  const fetchExecutions = async () => {
    setIsLoading(true)
    try {
      // Mock data - in a real app, this would fetch from the database
      const mockExecutions: WorkflowExecution[] = [
        {
          id: '1',
          agentId: 'agent-1',
          agentName: 'Customer Support Agent',
          status: 'completed',
          startedAt: '2025-01-27T10:30:00Z',
          completedAt: '2025-01-27T10:30:15Z',
          executionTime: 15000,
          input: { message: 'I need help with my order' },
          output: { response: 'I can help you with your order. Please provide your order number.' },
          steps: [
            {
              id: 'step-1',
              nodeId: 'start',
              nodeType: 'start',
              status: 'completed',
              startedAt: '2025-01-27T10:30:00Z',
              completedAt: '2025-01-27T10:30:01Z',
              executionTime: 1000
            },
            {
              id: 'step-2',
              nodeId: 'intent-analysis',
              nodeType: 'llm',
              status: 'completed',
              startedAt: '2025-01-27T10:30:01Z',
              completedAt: '2025-01-27T10:30:08Z',
              executionTime: 7000,
              output: { intent: 'order_inquiry', confidence: 0.95 }
            },
            {
              id: 'step-3',
              nodeId: 'response-generation',
              nodeType: 'llm',
              status: 'completed',
              startedAt: '2025-01-27T10:30:08Z',
              completedAt: '2025-01-27T10:30:15Z',
              executionTime: 7000,
              output: { response: 'I can help you with your order. Please provide your order number.' }
            }
          ]
        },
        {
          id: '2',
          agentId: 'agent-2',
          agentName: 'Content Writer Agent',
          status: 'running',
          startedAt: '2025-01-27T10:25:00Z',
          input: { topic: 'AI trends 2025', wordCount: 1000 },
          steps: [
            {
              id: 'step-1',
              nodeId: 'start',
              nodeType: 'start',
              status: 'completed',
              startedAt: '2025-01-27T10:25:00Z',
              completedAt: '2025-01-27T10:25:01Z',
              executionTime: 1000
            },
            {
              id: 'step-2',
              nodeId: 'research',
              nodeType: 'tool',
              status: 'completed',
              startedAt: '2025-01-27T10:25:01Z',
              completedAt: '2025-01-27T10:25:10Z',
              executionTime: 9000
            },
            {
              id: 'step-3',
              nodeId: 'outline',
              nodeType: 'llm',
              status: 'running',
              startedAt: '2025-01-27T10:25:10Z'
            }
          ]
        },
        {
          id: '3',
          agentId: 'agent-1',
          agentName: 'Customer Support Agent',
          status: 'failed',
          startedAt: '2025-01-27T10:20:00Z',
          completedAt: '2025-01-27T10:20:05Z',
          executionTime: 5000,
          input: { message: 'What is your return policy?' },
          error: 'Failed to connect to knowledge base',
          steps: [
            {
              id: 'step-1',
              nodeId: 'start',
              nodeType: 'start',
              status: 'completed',
              startedAt: '2025-01-27T10:20:00Z',
              completedAt: '2025-01-27T10:20:01Z',
              executionTime: 1000
            },
            {
              id: 'step-2',
              nodeId: 'knowledge-search',
              nodeType: 'tool',
              status: 'failed',
              startedAt: '2025-01-27T10:20:01Z',
              completedAt: '2025-01-27T10:20:05Z',
              executionTime: 4000,
              error: 'Connection timeout to knowledge base API'
            }
          ]
        }
      ]
      
      setExecutions(mockExecutions)
    } catch (error) {
      console.error('Failed to fetch executions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredExecutions = executions.filter(execution => {
    const matchesSearch = execution.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         execution.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || execution.status === filterStatus
    const matchesAgent = filterAgent === 'all' || execution.agentId === filterAgent
    return matchesSearch && matchesStatus && matchesAgent
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />
      case 'running': return <Clock className="w-4 h-4 text-blue-500" />
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'running': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workflow Executions</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and track your agent workflow executions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search executions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All Agents</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Executions List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded shimmer" />
                  <div className="h-3 bg-muted rounded w-2/3 shimmer" />
                  <div className="h-3 bg-muted rounded w-1/2 shimmer" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredExecutions.length > 0 ? (
        <div className="space-y-4">
          {filteredExecutions.map((execution) => (
            <Card key={execution.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(execution.status)}
                    <div>
                      <h3 className="font-semibold">{execution.agentName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>ID: {execution.id}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(execution.startedAt)}</span>
                        {execution.executionTime && (
                          <>
                            <span>•</span>
                            <span>{(execution.executionTime / 1000).toFixed(1)}s</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(execution.status)}>
                      {execution.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedExecution(execution)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>

                {/* Execution Details */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Input:</span>
                    <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(execution.input, null, 2)}
                    </pre>
                  </div>
                  
                  {execution.output && (
                    <div>
                      <span className="text-muted-foreground">Output:</span>
                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(execution.output, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {execution.error && (
                    <div>
                      <span className="text-muted-foreground">Error:</span>
                      <div className="text-xs bg-red-50 text-red-800 p-2 rounded mt-1">
                        {execution.error}
                      </div>
                    </div>
                  )}
                </div>

                {/* Steps Progress */}
                <div className="mt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium">Steps:</span>
                    <span className="text-xs text-muted-foreground">
                      {execution.steps.filter(s => s.status === 'completed').length} / {execution.steps.length} completed
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {execution.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`h-2 flex-1 rounded ${
                          step.status === 'completed' ? 'bg-green-500' :
                          step.status === 'running' ? 'bg-blue-500' :
                          step.status === 'failed' ? 'bg-red-500' :
                          'bg-gray-200'
                        }`}
                        title={`${step.nodeType} - ${step.status}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm || filterStatus !== 'all' || filterAgent !== 'all' 
              ? 'No executions found' 
              : 'No executions yet'
            }
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || filterStatus !== 'all' || filterAgent !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Workflow executions will appear here when agents run'
            }
          </p>
        </div>
      )}

      {/* Execution Detail Modal */}
      {selectedExecution && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold">Execution Details</h2>
                <p className="text-muted-foreground">
                  {selectedExecution.agentName} • {selectedExecution.id}
                </p>
              </div>
              <Button variant="ghost" onClick={() => setSelectedExecution(null)}>
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Execution Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Status</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(selectedExecution.status)}
                      <Badge className={getStatusColor(selectedExecution.status)}>
                        {selectedExecution.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Started</span>
                    <div className="text-sm font-medium mt-1">
                      {formatDateTime(selectedExecution.startedAt)}
                    </div>
                  </div>
                  {selectedExecution.completedAt && (
                    <div>
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <div className="text-sm font-medium mt-1">
                        {formatDateTime(selectedExecution.completedAt)}
                      </div>
                    </div>
                  )}
                  {selectedExecution.executionTime && (
                    <div>
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <div className="text-sm font-medium mt-1">
                        {(selectedExecution.executionTime / 1000).toFixed(1)}s
                      </div>
                    </div>
                  )}
                </div>

                {/* Steps Detail */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Execution Steps</h3>
                  <div className="space-y-3">
                    {selectedExecution.steps.map((step, index) => (
                      <Card key={step.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium">
                                Step {index + 1}: {step.nodeType}
                              </span>
                              {getStatusIcon(step.status)}
                            </div>
                            {step.executionTime && (
                              <span className="text-xs text-muted-foreground">
                                {(step.executionTime / 1000).toFixed(1)}s
                              </span>
                            )}
                          </div>
                          
                          {step.output && (
                            <div className="mt-2">
                              <span className="text-xs text-muted-foreground">Output:</span>
                              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(step.output, null, 2)}
                              </pre>
                            </div>
                          )}
                          
                          {step.error && (
                            <div className="mt-2">
                              <span className="text-xs text-muted-foreground">Error:</span>
                              <div className="text-xs bg-red-50 text-red-800 p-2 rounded mt-1">
                                {step.error}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
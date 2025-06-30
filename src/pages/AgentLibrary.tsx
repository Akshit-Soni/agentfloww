import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAgentStore } from '@/store/agentStore'
import { useToast } from '@/components/ui/Toast'
import { 
  Bot, 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  ExternalLink,
  MoreVertical
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function AgentLibrary() {
  const navigate = useNavigate()
  const { agents, fetchAgents, deleteAgent, isLoading } = useAgentStore()
  const { addToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (agent.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus
    const matchesType = filterType === 'all' || agent.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const handleDeleteAgent = async (agentId: string, agentName: string) => {
    if (window.confirm(`Are you sure you want to delete "${agentName}"? This action cannot be undone.`)) {
      try {
        await deleteAgent(agentId)
        addToast({
          type: 'success',
          title: 'Agent Deleted',
          description: `Agent "${agentName}" has been deleted successfully.`
        })
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Delete Failed',
          description: error instanceof Error ? error.message : 'Failed to delete agent'
        })
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'deployed': return 'bg-blue-100 text-blue-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'llm': return 'bg-purple-100 text-purple-800'
      case 'hybrid': return 'bg-blue-100 text-blue-800'
      case 'rule-based': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agent Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your AI agents
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate('/templates')}>
            Browse Templates
          </Button>
          <Button onClick={() => navigate('/agents/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Agent
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
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
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="deployed">Deployed</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All Types</option>
            <option value="llm">LLM</option>
            <option value="hybrid">Hybrid</option>
            <option value="rule-based">Rule-based</option>
          </select>
        </div>
      </div>

      {/* Agents Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded shimmer" />
                <div className="h-4 bg-muted rounded w-2/3 shimmer" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded shimmer" />
                  <div className="h-4 bg-muted rounded w-3/4 shimmer" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {agent.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Agent Info */}
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getTypeColor(agent.type)}>
                      {agent.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {agent.workflow.nodes.length} nodes
                    </span>
                  </div>

                  {/* Last Updated */}
                  <div className="text-xs text-muted-foreground">
                    Updated {formatDate(agent.updated_at)}
                  </div>

                  {/* Deployed URL */}
                  {agent.deployed_url && (
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      <a
                        href={agent.deployed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline truncate"
                      >
                        {agent.deployed_url}
                      </a>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/agents/edit/${agent.id}`)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/builder/${agent.id}`)}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Build
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteAgent(agent.id, agent.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
              ? 'No agents found' 
              : 'No agents yet'
            }
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first AI agent to get started'
            }
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Button onClick={() => navigate('/agents/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </Button>
            <Button variant="outline" onClick={() => navigate('/templates')}>
              Browse Templates
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
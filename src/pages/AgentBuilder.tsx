import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAgentStore } from '@/store/agentStore'
import { useToolStore } from '@/store/toolStore'
import { useToast } from '@/components/ui/Toast'
import { 
  Save, 
  ArrowLeft, 
  Bot, 
  Settings, 
  Workflow,
  Plus,
  X
} from 'lucide-react'

export function AgentBuilder() {
  const { agentId } = useParams()
  const navigate = useNavigate()
  const { agents, createAgent, updateAgent, isLoading } = useAgentStore()
  const { tools, fetchTools } = useToolStore()
  const { addToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'llm' as 'llm' | 'hybrid' | 'rule-based',
    status: 'draft' as 'draft' | 'active' | 'inactive' | 'deployed',
    persona: '',
    primaryObjective: '',
    selectedTools: [] as string[]
  })

  useEffect(() => {
    fetchTools()
    
    if (agentId && agents.length > 0) {
      const agent = agents.find(a => a.id === agentId)
      if (agent) {
        setIsEditing(true)
        setFormData({
          name: agent.name,
          description: agent.description || '',
          type: agent.type,
          status: agent.status,
          persona: '', // These would come from agent metadata
          primaryObjective: '',
          selectedTools: [] // These would come from agent configuration
        })
      }
    }
  }, [agentId, agents, fetchTools])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const agentData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        workflow: {
          nodes: [],
          edges: [],
          settings: {
            timeout: 60,
            retries: 2,
            parallelism: 1,
            logging: true
          }
        }
      }

      if (isEditing && agentId) {
        await updateAgent(agentId, agentData)
        addToast({
          type: 'success',
          title: 'Agent Updated',
          description: 'Agent has been updated successfully.'
        })
      } else {
        const newAgent = await createAgent(agentData)
        addToast({
          type: 'success',
          title: 'Agent Created',
          description: 'Agent has been created successfully.'
        })
        navigate(`/agents/edit/${newAgent.id}`)
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: isEditing ? 'Update Failed' : 'Creation Failed',
        description: error instanceof Error ? error.message : 'Failed to save agent'
      })
    }
  }

  const handleToolToggle = (toolId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTools: prev.selectedTools.includes(toolId)
        ? prev.selectedTools.filter(id => id !== toolId)
        : [...prev.selectedTools, toolId]
    }))
  }

  const availableTools = tools.filter(tool => tool.status === 'active')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/agents')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEditing ? 'Edit Agent' : 'Create New Agent'}
              </h1>
              <p className="text-muted-foreground">
                Configure your AI agent's behavior and capabilities
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => navigate('/agents')}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isEditing ? 'Update Agent' : 'Create Agent'}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Define the core properties of your AI agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Agent Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter agent name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this agent does and how it should behave"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Agent Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="llm">LLM-based</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="rule-based">Rule-based</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  LLM-based agents use language models, Hybrid combines multiple approaches, Rule-based uses predefined logic
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Agent Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Agent Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure the agent's personality and objectives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Persona</label>
                <textarea
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  rows={3}
                  value={formData.persona}
                  onChange={(e) => setFormData(prev => ({ ...prev, persona: e.target.value }))}
                  placeholder="Define the agent's personality, tone, and communication style..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Primary Objective</label>
                <textarea
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  rows={2}
                  value={formData.primaryObjective}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryObjective: e.target.value }))}
                  placeholder="What is the main goal or purpose of this agent?"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tools & Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Tools & Capabilities</span>
              </CardTitle>
              <CardDescription>
                Select the tools and capabilities this agent can use
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableTools.map((tool) => (
                    <div
                      key={tool.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.selectedTools.includes(tool.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent'
                      }`}
                      onClick={() => handleToolToggle(tool.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{tool.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {tool.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{tool.type}</Badge>
                            <Badge variant="outline">{tool.category}</Badge>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.selectedTools.includes(tool.id)
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        }`}>
                          {formData.selectedTools.includes(tool.id) && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tools available</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate('/tools/new')}
                  >
                    Create Tool
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workflow Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Workflow className="w-5 h-5" />
                <span>Workflow</span>
              </CardTitle>
              <CardDescription>
                Configure the agent's workflow and behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Workflow className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">
                  {isEditing 
                    ? 'Edit the workflow in the workflow builder'
                    : 'Create the agent first, then build its workflow'
                  }
                </p>
                {isEditing && (
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/builder/${agentId}`)}
                  >
                    <Workflow className="w-4 h-4 mr-2" />
                    Open Workflow Builder
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
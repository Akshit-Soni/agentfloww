import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BoltBadge } from '@/components/ui/BoltBadge'
import { useAgentStore } from '@/store/agentStore'
import { useToolStore } from '@/store/toolStore'
import { 
  Bot, 
  Workflow, 
  Wrench, 
  Play, 
  Plus,
  ArrowRight,
  BookTemplate as FileTemplate
} from 'lucide-react'

export function Dashboard() {
  const navigate = useNavigate()
  const { agents, fetchAgents } = useAgentStore()
  const { tools, fetchTools } = useToolStore()

  useEffect(() => {
    fetchAgents()
    fetchTools()
  }, [fetchAgents, fetchTools])

  const activeAgents = agents.filter(agent => agent.status === 'active')
  const deployedAgents = agents.filter(agent => agent.status === 'deployed')
  const activeTools = tools.filter(tool => tool.status === 'active')

  const stats = [
    {
      title: 'Total Agents',
      value: agents.length,
      description: `${activeAgents.length} active`,
      icon: Bot,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Deployed Agents',
      value: deployedAgents.length,
      description: 'Live and running',
      icon: Play,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Available Tools',
      value: activeTools.length,
      description: `${tools.length} total tools`,
      icon: Wrench,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  const quickActions = [
    {
      title: 'Create Agent',
      description: 'Build a new AI agent from scratch',
      icon: Bot,
      action: () => navigate('/agents/new'),
      color: 'bg-blue-500'
    },
    {
      title: 'Browse Templates',
      description: 'Start with pre-built templates',
      icon: FileTemplate,
      action: () => navigate('/templates'),
      color: 'bg-purple-500'
    },
    {
      title: 'Build Workflow',
      description: 'Create custom workflows',
      icon: Workflow,
      action: () => navigate('/builder'),
      color: 'bg-green-500'
    },
    {
      title: 'Create Tool',
      description: 'Add new tools and integrations',
      icon: Wrench,
      action: () => navigate('/tools/new'),
      color: 'bg-orange-500'
    }
  ]

  const recentAgents = agents.slice(0, 3)

  return (
    <div className="p-6 space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your AI agents.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => navigate('/agents/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Agent
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started quickly with these common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Agents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Agents</CardTitle>
              <CardDescription>Your latest AI agents</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/agents')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentAgents.length > 0 ? (
              <div className="space-y-4">
                {recentAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => navigate(`/agents/edit/${agent.id}`)}
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{agent.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {agent.description || 'No description'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        agent.status === 'active' ? 'bg-green-100 text-green-800' :
                        agent.status === 'deployed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {agent.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No agents created yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate('/agents/new')}
                >
                  Create Your First Agent
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">API Services</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Database</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Workflow Engine</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">AI Models</span>
                </div>
                <span className="text-sm text-yellow-600 font-medium">Limited</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bolt.new Badge - positioned in bottom right corner */}
      <div className="fixed bottom-4 right-4 z-10">
        <BoltBadge />
      </div>
    </div>
  )
}
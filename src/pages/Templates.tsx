import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Play
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useTemplateStore } from '@/store/templateStore'
import { useToast } from '@/components/ui/Toast'
import { AgentTemplate, WorkflowTemplate, TemplateCategory } from '@/types/template'

export function Templates() {
  const navigate = useNavigate()
  const { 
    agentTemplates, 
    workflowTemplates, 
    fetchAgentTemplates, 
    fetchWorkflowTemplates,
    createAgentFromTemplate,
    isLoading 
  } = useTemplateStore()
  const { addToast } = useToast()
  
  const [activeTab, setActiveTab] = useState<'agents' | 'workflows'>('agents')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | WorkflowTemplate | null>(null)

  useEffect(() => {
    fetchAgentTemplates()
    fetchWorkflowTemplates()
  }, [fetchAgentTemplates, fetchWorkflowTemplates])

  const filteredAgentTemplates = agentTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory
    const matchesDifficulty = filterDifficulty === 'all' || template.difficulty === filterDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const filteredWorkflowTemplates = workflowTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = async (template: AgentTemplate | WorkflowTemplate) => {
    try {
      if ('agentConfig' in template) {
        // Agent template
        const agentId = await createAgentFromTemplate(template.id)
        addToast({
          type: 'success',
          title: 'Agent Created',
          description: `Agent "${template.name}" has been created successfully.`
        })
        navigate(`/agents/edit/${agentId}`)
      } else {
        // Workflow template - redirect to workflow builder with template
        navigate(`/builder?template=${template.id}`)
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to Create',
        description: error instanceof Error ? error.message : 'Failed to create from template'
      })
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'complex': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: TemplateCategory) => {
    const colors = {
      'customer-service': 'bg-blue-100 text-blue-800',
      'content-creation': 'bg-purple-100 text-purple-800',
      'data-analysis': 'bg-green-100 text-green-800',
      'automation': 'bg-orange-100 text-orange-800',
      'research': 'bg-teal-100 text-teal-800',
      'communication': 'bg-pink-100 text-pink-800',
      'productivity': 'bg-indigo-100 text-indigo-800',
      'marketing': 'bg-red-100 text-red-800',
      'sales': 'bg-yellow-100 text-yellow-800',
      'hr': 'bg-gray-100 text-gray-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground mt-1">
            Get started quickly with pre-built agent and workflow templates
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate('/agents/new')}>
            Create Custom Agent
          </Button>
          <Button onClick={() => navigate('/builder')}>
            Build Custom Workflow
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'agents'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Agent Templates ({agentTemplates.length})
        </button>
        <button
          onClick={() => setActiveTab('workflows')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'workflows'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Workflow Templates ({workflowTemplates.length})
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All Categories</option>
            <option value="customer-service">Customer Service</option>
            <option value="content-creation">Content Creation</option>
            <option value="data-analysis">Data Analysis</option>
            <option value="automation">Automation</option>
            <option value="research">Research</option>
            <option value="communication">Communication</option>
            <option value="productivity">Productivity</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="hr">HR</option>
          </select>
          {activeTab === 'agents' && (
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          )}
        </div>
      </div>

      {/* Templates Grid */}
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'agents' 
            ? filteredAgentTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{template.icon}</span>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {template.name}
                          </CardTitle>
                          {template.isPopular && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-yellow-600">Popular</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Tags and Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category.replace('-', ' ')}
                        </Badge>
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                      </div>

                      {/* Setup Time */}
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{template.estimatedSetupTime} setup</span>
                      </div>

                      {/* Features Preview */}
                      <div>
                        <p className="text-sm font-medium mb-2">Key Features:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {template.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                          {template.features.length > 3 && (
                            <li className="text-xs text-muted-foreground">
                              +{template.features.length - 3} more features
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Required API Keys */}
                      {template.requiredApiKeys.length > 0 && (
                        <div className="flex items-center space-x-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-muted-foreground">
                            Requires: {template.requiredApiKeys.join(', ')} API key
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Button 
                          onClick={() => handleUseTemplate(template)}
                          className="flex-1"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : filteredWorkflowTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{template.icon}</span>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {template.name}
                          </CardTitle>
                          {template.isPopular && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-yellow-600">Popular</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Tags and Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category.replace('-', ' ')}
                        </Badge>
                        <Badge className={getComplexityColor(template.complexity)}>
                          {template.complexity}
                        </Badge>
                      </div>

                      {/* Execution Time */}
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Play className="w-4 h-4" />
                        <span>~{template.estimatedExecutionTime} execution</span>
                      </div>

                      {/* Workflow Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Nodes:</span>
                          <span className="ml-1 font-medium">{template.workflow.nodes.length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tools:</span>
                          <span className="ml-1 font-medium">{template.requiredTools.length}</span>
                        </div>
                      </div>

                      {/* Required Tools */}
                      {template.requiredTools.length > 0 && (
                        <div className="flex items-center space-x-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-muted-foreground">
                            Requires {template.requiredTools.length} tool{template.requiredTools.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Button 
                          onClick={() => handleUseTemplate(template)}
                          className="flex-1"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          }
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (
        (activeTab === 'agents' ? filteredAgentTemplates : filteredWorkflowTemplates).length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-medium text-foreground mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => {
              setSearchTerm('')
              setFilterCategory('all')
              setFilterDifficulty('all')
            }}>
              Clear Filters
            </Button>
          </div>
        )
      )}
    </div>
  )
}
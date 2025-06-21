import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Settings, 
  Play, 
  Trash2, 
  Edit, 
  Copy,
  Zap,
  Globe,
  Database,
  Mail,
  Calendar,
  Code,
  Wrench
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useToolStore } from '@/store/toolStore'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import { Tool, ToolType, ToolCategory } from '@/types/tool'

export function Tools() {
  const navigate = useNavigate()
  const { tools, fetchTools, deleteTool, testTool, isLoading } = useToolStore()
  const { addToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchTools()
  }, [fetchTools])

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || tool.category === filterCategory
    const matchesType = filterType === 'all' || tool.type === filterType
    return matchesSearch && matchesCategory && matchesType
  })

  const handleDeleteTool = async (toolId: string) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      try {
        await deleteTool(toolId)
        addToast({
          type: 'success',
          title: 'Tool Deleted',
          description: 'Tool has been successfully deleted.'
        })
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Delete Failed',
          description: error instanceof Error ? error.message : 'Failed to delete tool'
        })
      }
    }
  }

  const handleTestTool = async (toolId: string) => {
    const tool = tools.find(t => t.id === toolId)
    if (!tool) return

    try {
      // Create mock input based on tool parameters
      const mockInput: Record<string, any> = {}
      tool.config.parameters.forEach(param => {
        if (param.required) {
          switch (param.type) {
            case 'string':
              mockInput[param.name] = param.name === 'url' ? 'https://api.example.com/test' : 'test value'
              break
            case 'number':
              mockInput[param.name] = 123
              break
            case 'boolean':
              mockInput[param.name] = true
              break
            default:
              mockInput[param.name] = 'test'
          }
        }
      })

      await testTool(toolId, mockInput)
      addToast({
        type: 'success',
        title: 'Tool Test Complete',
        description: `Tool "${tool.name}" executed successfully.`
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Tool Test Failed',
        description: error instanceof Error ? error.message : 'Failed to test tool'
      })
    }
  }

  const handleCopyId = (toolId: string) => {
    navigator.clipboard.writeText(toolId)
    addToast({
      type: 'success',
      title: 'Copied',
      description: 'Tool ID copied to clipboard.'
    })
  }

  const getTypeIcon = (type: ToolType) => {
    switch (type) {
      case 'api': return <Globe className="w-4 h-4" />
      case 'database': return <Database className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      case 'calendar': return <Calendar className="w-4 h-4" />
      case 'ai': return <Zap className="w-4 h-4" />
      case 'custom': return <Code className="w-4 h-4" />
      default: return <Wrench className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: Tool['status']) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'error': return 'destructive'
      case 'testing': return 'outline'
      default: return 'outline'
    }
  }

  const getCategoryColor = (category: ToolCategory) => {
    switch (category) {
      case 'communication': return 'bg-blue-100 text-blue-800'
      case 'data': return 'bg-green-100 text-green-800'
      case 'automation': return 'bg-purple-100 text-purple-800'
      case 'ai': return 'bg-orange-100 text-orange-800'
      case 'integration': return 'bg-teal-100 text-teal-800'
      case 'utility': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tools</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage custom tools for your AI agents
          </p>
        </div>
        <Button onClick={() => navigate('/tools/new')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Tool
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
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
            <option value="communication">Communication</option>
            <option value="data">Data</option>
            <option value="automation">Automation</option>
            <option value="ai">AI</option>
            <option value="integration">Integration</option>
            <option value="utility">Utility</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All Types</option>
            <option value="api">API</option>
            <option value="webhook">Webhook</option>
            <option value="database">Database</option>
            <option value="email">Email</option>
            <option value="calendar">Calendar</option>
            <option value="ai">AI</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Tools Grid */}
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
      ) : filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(tool.type)}
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    {tool.isBuiltIn && <Badge variant="secondary">Built-in</Badge>}
                  </div>
                  <Badge variant={getStatusColor(tool.status)}>
                    {tool.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Categories and Type */}
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(tool.category)}>
                      {tool.category}
                    </Badge>
                    <Badge variant="outline">{tool.type}</Badge>
                  </div>

                  {/* Parameters Count */}
                  <div className="text-sm text-muted-foreground">
                    {tool.config.parameters.length} parameter{tool.config.parameters.length !== 1 ? 's' : ''}
                  </div>

                  {/* Last Updated */}
                  <div className="text-xs text-muted-foreground">
                    Updated {formatDate(tool.updatedAt)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {!tool.isBuiltIn && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/tools/edit/${tool.id}`)}
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestTool(tool.id)}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Test
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyId(tool.id)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    {!tool.isBuiltIn && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTool(tool.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Wrench className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm || filterCategory !== 'all' || filterType !== 'all' ? 'No tools found' : 'No custom tools yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || filterCategory !== 'all' || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first custom tool to extend your agents capabilities'
            }
          </p>
          <Button onClick={() => navigate('/tools/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Tool
          </Button>
        </div>
      )}
    </div>
  )
}
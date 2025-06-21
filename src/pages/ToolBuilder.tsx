import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, X, Play, ArrowLeft, Plus, Trash2, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useToolStore } from '@/store/toolStore'
import { useToast } from '@/components/ui/Toast'
import { Tool, ToolParameter, ToolAuthentication } from '@/types/tool'

export function ToolBuilder() {
  const { toolId } = useParams()
  const navigate = useNavigate()
  const { tools, createTool, updateTool, testTool, isLoading } = useToolStore()
  const { addToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testInput, setTestInput] = useState<Record<string, any>>({})
  const [testResult, setTestResult] = useState<any>(null)

  const [formData, setFormData] = useState<Partial<Tool>>({
    name: '',
    description: '',
    type: 'api',
    category: 'integration',
    status: 'inactive',
    config: {
      endpoint: '',
      method: 'GET',
      headers: {},
      authentication: { type: 'none', config: {} },
      parameters: [],
      timeout: 30000,
      retries: 3
    }
  })

  // Load existing tool if editing
  useEffect(() => {
    if (toolId && tools.length > 0) {
      const tool = tools.find(t => t.id === toolId)
      if (tool) {
        setIsEditing(true)
        setFormData(tool)
        
        // Initialize test input with default values
        const initialTestInput: Record<string, any> = {}
        tool.config.parameters.forEach(param => {
          if (param.defaultValue !== undefined) {
            initialTestInput[param.name] = param.defaultValue
          }
        })
        setTestInput(initialTestInput)
      }
    }
  }, [toolId, tools])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isEditing && toolId) {
        await updateTool(toolId, formData)
        addToast({
          type: 'success',
          title: 'Tool Updated',
          description: 'Tool has been successfully updated.'
        })
      } else {
        await createTool(formData)
        addToast({
          type: 'success',
          title: 'Tool Created',
          description: 'Tool has been successfully created.'
        })
      }
      navigate('/tools')
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save tool'
      })
    }
  }

  const handleTest = async () => {
    if (!toolId && !isEditing) {
      addToast({
        type: 'error',
        title: 'Cannot Test',
        description: 'Please save the tool first before testing.'
      })
      return
    }
    
    setIsTesting(true)
    try {
      const result = await testTool(toolId || 'new-tool', testInput)
      setTestResult(result)
      addToast({
        type: 'success',
        title: 'Test Complete',
        description: 'Tool test executed successfully.'
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Test Failed',
        description: error instanceof Error ? error.message : 'Tool test failed'
      })
    } finally {
      setIsTesting(false)
    }
  }

  const addParameter = () => {
    const newParam: ToolParameter = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      type: 'string',
      required: false,
      description: ''
    }
    
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config!,
        parameters: [...(prev.config?.parameters || []), newParam]
      }
    }))
  }

  const updateParameter = (index: number, updates: Partial<ToolParameter>) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config!,
        parameters: prev.config!.parameters.map((param, i) => 
          i === index ? { ...param, ...updates } : param
        )
      }
    }))
  }

  const removeParameter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config!,
        parameters: prev.config!.parameters.filter((_, i) => i !== index)
      }
    }))
  }

  const updateTestInput = (paramName: string, value: any) => {
    setTestInput(prev => ({ ...prev, [paramName]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/tools')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEditing ? 'Edit Tool' : 'Create New Tool'}
              </h1>
              <p className="text-muted-foreground">
                Configure your custom tool for AI agent integration
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleTest} disabled={isTesting}>
              {isTesting ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Test Tool
            </Button>
            <Button variant="outline" onClick={() => navigate('/tools')}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isEditing ? 'Update Tool' : 'Create Tool'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Configuration */}
        <div className="flex-1 p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Define the core properties of your tool
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tool Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter tool name"
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
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="testing">Testing</option>
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
                    placeholder="Describe what this tool does and how it should be used"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    >
                      <option value="api">API</option>
                      <option value="webhook">Webhook</option>
                      <option value="database">Database</option>
                      <option value="email">Email</option>
                      <option value="calendar">Calendar</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    >
                      <option value="communication">Communication</option>
                      <option value="data">Data</option>
                      <option value="automation">Automation</option>
                      <option value="ai">AI</option>
                      <option value="integration">Integration</option>
                      <option value="utility">Utility</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Configuration */}
            {formData.type === 'api' && (
              <Card>
                <CardHeader>
                  <CardTitle>API Configuration</CardTitle>
                  <CardDescription>
                    Configure the API endpoint and request settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Endpoint URL</label>
                    <Input
                      value={formData.config?.endpoint || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        config: { ...prev.config!, endpoint: e.target.value }
                      }))}
                      placeholder="https://api.example.com/endpoint"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">HTTP Method</label>
                      <select
                        value={formData.config?.method || 'GET'}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          config: { ...prev.config!, method: e.target.value as any }
                        }))}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Timeout (ms)</label>
                      <Input
                        type="number"
                        value={formData.config?.timeout || 30000}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          config: { ...prev.config!, timeout: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Retries</label>
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        value={formData.config?.retries || 3}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          config: { ...prev.config!, retries: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Parameters */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Parameters</CardTitle>
                    <CardDescription>
                      Define the input parameters for this tool
                    </CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addParameter}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Parameter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {formData.config?.parameters?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No parameters defined. Click "Add Parameter" to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.config?.parameters?.map((param, index) => (
                      <div key={param.id} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Parameter {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeParameter(index)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <Input
                              value={param.name}
                              onChange={(e) => updateParameter(index, { name: e.target.value })}
                              placeholder="parameter_name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                              value={param.type}
                              onChange={(e) => updateParameter(index, { type: e.target.value as any })}
                              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                            >
                              <option value="string">String</option>
                              <option value="number">Number</option>
                              <option value="boolean">Boolean</option>
                              <option value="object">Object</option>
                              <option value="array">Array</option>
                            </select>
                          </div>
                          <div className="flex items-center space-x-2 pt-6">
                            <input
                              type="checkbox"
                              checked={param.required}
                              onChange={(e) => updateParameter(index, { required: e.target.checked })}
                              className="rounded"
                            />
                            <label className="text-sm">Required</label>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <Input
                            value={param.description}
                            onChange={(e) => updateParameter(index, { description: e.target.value })}
                            placeholder="Describe this parameter"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Test Panel */}
        <div className="w-96 border-l border-border bg-card">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold flex items-center">
              <Play className="w-4 h-4 mr-2" />
              Test Tool
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Test your tool with sample inputs
            </p>
          </div>

          <div className="p-4 space-y-4">
            {/* Test Inputs */}
            <div>
              <h4 className="text-sm font-medium mb-3">Input Parameters</h4>
              {formData.config?.parameters?.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No parameters defined yet
                </p>
              ) : (
                <div className="space-y-3">
                  {formData.config?.parameters?.map((param) => (
                    <div key={param.id}>
                      <label className="block text-sm font-medium mb-1">
                        {param.name}
                        {param.required && <span className="text-destructive ml-1">*</span>}
                      </label>
                      <Input
                        value={testInput[param.name] || ''}
                        onChange={(e) => updateTestInput(param.name, e.target.value)}
                        placeholder={param.description || `Enter ${param.name}`}
                        type={param.type === 'number' ? 'number' : 'text'}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Test Button */}
            <Button 
              onClick={handleTest} 
              disabled={isTesting || !formData.config?.parameters?.length}
              className="w-full"
            >
              {isTesting ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Run Test
            </Button>

            {/* Test Results */}
            {testResult && (
              <div>
                <h4 className="text-sm font-medium mb-2">Test Result</h4>
                <div className={`p-3 rounded-lg text-sm ${
                  testResult.status === 'completed' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={testResult.status === 'completed' ? 'default' : 'destructive'}>
                      {testResult.status}
                    </Badge>
                    <span className="text-xs">{testResult.executionTime}ms</span>
                  </div>
                  
                  {testResult.error ? (
                    <p>{testResult.error}</p>
                  ) : (
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(testResult.output, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
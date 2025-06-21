import React, { useState, useEffect } from 'react'
import { X, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Node } from 'reactflow'
import { useToolStore } from '@/store/toolStore'

interface PropertiesPanelProps {
  node: Node
  onUpdateNode: (nodeId: string, data: any) => void
  onClose: () => void
}

export function PropertiesPanel({ node, onUpdateNode, onClose }: PropertiesPanelProps) {
  const [nodeData, setNodeData] = useState(node.data)
  const { tools, fetchTools } = useToolStore()

  useEffect(() => {
    if (node.type === 'tool') {
      fetchTools()
    }
  }, [node.type, fetchTools])

  const handleSave = () => {
    onUpdateNode(node.id, nodeData)
    onClose()
  }

  const renderNodeConfig = () => {
    switch (node.type) {
      case 'llm':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <select 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                value={nodeData.config?.model || 'gpt-4'}
                onChange={(e) => setNodeData({
                  ...nodeData,
                  config: { ...nodeData.config, model: e.target.value }
                })}
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">System Prompt</label>
              <textarea
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                rows={4}
                placeholder="Enter system prompt..."
                value={nodeData.config?.systemPrompt || ''}
                onChange={(e) => setNodeData({
                  ...nodeData,
                  config: { ...nodeData.config, systemPrompt: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Temperature</label>
              <Input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={nodeData.config?.temperature || 0.7}
                onChange={(e) => setNodeData({
                  ...nodeData,
                  config: { ...nodeData.config, temperature: parseFloat(e.target.value) }
                })}
              />
            </div>
          </div>
        )
      
      case 'rule':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Condition</label>
              <Input
                placeholder="e.g., input.contains('urgent')"
                value={nodeData.config?.condition || ''}
                onChange={(e) => setNodeData({
                  ...nodeData,
                  config: { ...nodeData.config, condition: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Action</label>
              <select 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                value={nodeData.config?.action || 'continue'}
                onChange={(e) => setNodeData({
                  ...nodeData,
                  config: { ...nodeData.config, action: e.target.value }
                })}
              >
                <option value="continue">Continue</option>
                <option value="stop">Stop</option>
                <option value="redirect">Redirect</option>
              </select>
            </div>
          </div>
        )

      case 'tool':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Tool</label>
              <select 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                value={nodeData.config?.toolId || ''}
                onChange={(e) => {
                  const selectedTool = tools.find(t => t.id === e.target.value)
                  setNodeData({
                    ...nodeData,
                    config: { 
                      ...nodeData.config, 
                      toolId: e.target.value,
                      toolName: selectedTool?.name || '',
                      toolType: selectedTool?.type || '',
                      parameters: selectedTool?.config.parameters || []
                    }
                  })
                }}
              >
                <option value="">Select a tool...</option>
                {tools.filter(t => t.status === 'active').map(tool => (
                  <option key={tool.id} value={tool.id}>
                    {tool.name} ({tool.type})
                  </option>
                ))}
              </select>
            </div>

            {nodeData.config?.toolId && (
              <div>
                <label className="block text-sm font-medium mb-2">Tool Parameters</label>
                <div className="space-y-2">
                  {nodeData.config?.parameters?.map((param: any, index: number) => (
                    <div key={param.id} className="border border-border rounded p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{param.name}</span>
                        {param.required && (
                          <span className="text-xs text-destructive">Required</span>
                        )}
                      </div>
                      <Input
                        placeholder={param.description || `Enter ${param.name}`}
                        value={nodeData.config?.parameterValues?.[param.name] || ''}
                        onChange={(e) => setNodeData({
                          ...nodeData,
                          config: {
                            ...nodeData.config,
                            parameterValues: {
                              ...nodeData.config?.parameterValues,
                              [param.name]: e.target.value
                            }
                          }
                        })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {param.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'connector':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Connector Type</label>
              <select 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                value={nodeData.config?.type || 'gmail'}
                onChange={(e) => setNodeData({
                  ...nodeData,
                  config: { ...nodeData.config, type: e.target.value }
                })}
              >
                <option value="gmail">Gmail</option>
                <option value="calendar">Google Calendar</option>
                <option value="github">GitHub</option>
                <option value="slack">Slack</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Action</label>
              <Input
                placeholder="e.g., send_email, create_event"
                value={nodeData.config?.action || ''}
                onChange={(e) => setNodeData({
                  ...nodeData,
                  config: { ...nodeData.config, action: e.target.value }
                })}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-sm text-muted-foreground">
            No configuration options available for this node type.
          </div>
        )
    }
  }

  return (
    <div className="w-80 bg-card border-l border-border">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4" />
          <h3 className="text-lg font-semibold">Node Properties</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Basic Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Basic Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Label</label>
              <Input
                value={nodeData.label || ''}
                onChange={(e) => setNodeData({ ...nodeData, label: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                rows={2}
                placeholder="Optional description..."
                value={nodeData.description || ''}
                onChange={(e) => setNodeData({ ...nodeData, description: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Node Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            {renderNodeConfig()}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
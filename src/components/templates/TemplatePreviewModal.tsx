import React from 'react'
import { X, Clock, Users, CheckCircle, AlertCircle, Star, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { AgentTemplate, WorkflowTemplate } from '@/types/template'

interface TemplatePreviewModalProps {
  template: AgentTemplate | WorkflowTemplate
  onClose: () => void
  onUse: (template: AgentTemplate | WorkflowTemplate) => void
}

export function TemplatePreviewModal({ template, onClose, onUse }: TemplatePreviewModalProps) {
  const isAgentTemplate = 'agentConfig' in template

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{template.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{template.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{template.category.replace('-', ' ')}</Badge>
                {isAgentTemplate ? (
                  <Badge className={getDifficultyColor((template as AgentTemplate).difficulty)}>
                    {(template as AgentTemplate).difficulty}
                  </Badge>
                ) : (
                  <Badge className={getComplexityColor((template as WorkflowTemplate).complexity)}>
                    {(template as WorkflowTemplate).complexity}
                  </Badge>
                )}
                {template.isPopular && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-yellow-600">Popular</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{template.description}</p>
              </div>

              {/* Use Cases */}
              {isAgentTemplate && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Use Cases</h3>
                  <ul className="space-y-2">
                    {(template as AgentTemplate).useCases.map((useCase, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Features */}
              {isAgentTemplate && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(template as AgentTemplate).features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Usage Examples */}
              {!isAgentTemplate && (template as WorkflowTemplate).usageExamples && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Usage Examples</h3>
                  <div className="space-y-4">
                    {(template as WorkflowTemplate).usageExamples.map((example, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-base">{example.title}</CardTitle>
                          <CardDescription>{example.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium mb-2">Input:</h5>
                              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                {JSON.stringify(example.input, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium mb-2">Expected Output:</h5>
                              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                {JSON.stringify(example.expectedOutput, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Setup Instructions */}
              {isAgentTemplate && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Setup Instructions</h3>
                  <div className="space-y-3">
                    {(template as AgentTemplate).setupInstructions.map((step, index) => (
                      <div key={step.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{step.title}</h4>
                            {step.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">~{step.estimatedTime}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {isAgentTemplate 
                        ? `${(template as AgentTemplate).estimatedSetupTime} setup`
                        : `${(template as WorkflowTemplate).estimatedExecutionTime} execution`
                      }
                    </span>
                  </div>
                  {isAgentTemplate && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{(template as AgentTemplate).difficulty} level</span>
                    </div>
                  )}
                  {!isAgentTemplate && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Play className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{(template as WorkflowTemplate).workflow.nodes.length} nodes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{(template as WorkflowTemplate).complexity} complexity</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isAgentTemplate && (template as AgentTemplate).requiredApiKeys.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 text-orange-500 mr-2" />
                        API Keys
                      </h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {(template as AgentTemplate).requiredApiKeys.map((key, index) => (
                          <li key={index}>• {key}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {!isAgentTemplate && (template as WorkflowTemplate).requiredTools.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 text-orange-500 mr-2" />
                        Required Tools
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {(template as WorkflowTemplate).requiredTools.length} tool{(template as WorkflowTemplate).requiredTools.length !== 1 ? 's' : ''} required
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/50">
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(template.updatedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onUse(template)}>
              Use This Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
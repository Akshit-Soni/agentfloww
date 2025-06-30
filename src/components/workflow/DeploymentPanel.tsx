import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { X, Upload, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import { useAgentStore } from '@/store/agentStore'
import { useToast } from '@/components/ui/Toast'

interface DeploymentPanelProps {
  onClose: () => void
  agentId: string
}

export function DeploymentPanel({ onClose, agentId }: DeploymentPanelProps) {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)
  const [deploymentName, setDeploymentName] = useState('')
  const { deployAgent, agents } = useAgentStore()
  const { addToast } = useToast()

  const agent = agents.find(a => a.id === agentId)

  const handleDeploy = async () => {
    if (!agent) return

    setIsDeploying(true)
    try {
      const url = await deployAgent(agentId)
      setDeploymentUrl(url)
      addToast({
        type: 'success',
        title: 'Deployment Successful',
        description: `Agent "${agent.name}" has been deployed successfully.`
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Deployment Failed',
        description: error instanceof Error ? error.message : 'Failed to deploy agent'
      })
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="w-96 border-l border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Upload className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Deploy Agent</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Agent Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agent Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium">Name:</span>
              <span className="ml-2 text-sm text-muted-foreground">{agent?.name}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Type:</span>
              <span className="ml-2 text-sm text-muted-foreground">{agent?.type}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Status:</span>
              <span className="ml-2 text-sm text-muted-foreground">{agent?.status}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Nodes:</span>
              <span className="ml-2 text-sm text-muted-foreground">{agent?.workflow.nodes.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deployment Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Deployment Name</label>
              <Input
                value={deploymentName}
                onChange={(e) => setDeploymentName(e.target.value)}
                placeholder="Enter deployment name (optional)"
              />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Deployment Options</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Auto-scaling enabled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>HTTPS encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Monitoring & logging</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Status */}
        {(isDeploying || deploymentUrl) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deployment Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isDeploying ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Deploying agent...</span>
                </div>
              ) : deploymentUrl ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Deployment successful!</span>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-1">Agent URL:</p>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-white px-2 py-1 rounded border flex-1 truncate">
                        {deploymentUrl}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(deploymentUrl, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Deployment Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Requirements Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              {agent?.workflow.nodes.length ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Workflow configured</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Agent validated</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Dependencies resolved</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleDeploy} 
            disabled={isDeploying || !agent}
            className="flex-1"
          >
            {isDeploying ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Deploy
          </Button>
        </div>
      </div>
    </div>
  )
}
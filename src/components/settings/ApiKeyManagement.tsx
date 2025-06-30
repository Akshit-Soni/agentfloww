import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useApiKeyStore } from '@/store/apiKeyStore'
import { useToast } from '@/components/ui/Toast'
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  TestTube, 
  Key,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

export function ApiKeyManagement() {
  const { apiKeys, fetchApiKeys, addApiKey, deleteApiKey, testApiKey, isLoading } = useApiKeyStore()
  const { addToast } = useToast()
  const [showAddForm, setShowAddForm] = useState(false)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [testingKeys, setTestingKeys] = useState<Record<string, boolean>>({})
  
  const [newKey, setNewKey] = useState({
    name: '',
    provider: 'openai',
    key: ''
  })

  useEffect(() => {
    fetchApiKeys()
  }, [fetchApiKeys])

  const handleAddKey = async () => {
    if (!newKey.name.trim() || !newKey.key.trim()) {
      addToast({
        type: 'error',
        title: 'Invalid Input',
        description: 'Please provide both name and API key.'
      })
      return
    }

    try {
      await addApiKey(newKey.name, newKey.provider, newKey.key)
      setNewKey({ name: '', provider: 'openai', key: '' })
      setShowAddForm(false)
      addToast({
        type: 'success',
        title: 'API Key Added',
        description: 'Your API key has been added and validated successfully.'
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to Add Key',
        description: error instanceof Error ? error.message : 'Failed to add API key'
      })
    }
  }

  const handleDeleteKey = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the API key "${name}"?`)) {
      try {
        await deleteApiKey(id)
        addToast({
          type: 'success',
          title: 'API Key Deleted',
          description: 'The API key has been removed successfully.'
        })
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Failed to Delete',
          description: 'Failed to delete the API key.'
        })
      }
    }
  }

  const handleTestKey = async (id: string, name: string) => {
    setTestingKeys(prev => ({ ...prev, [id]: true }))
    try {
      const isValid = await testApiKey(id)
      addToast({
        type: isValid ? 'success' : 'error',
        title: isValid ? 'Key Valid' : 'Key Invalid',
        description: isValid 
          ? `API key "${name}" is working correctly.`
          : `API key "${name}" failed validation.`
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Test Failed',
        description: 'Failed to test the API key.'
      })
    } finally {
      setTestingKeys(prev => ({ ...prev, [id]: false }))
    }
  }

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai': return '🤖'
      case 'anthropic': return '🧠'
      case 'google': return '🔍'
      case 'cohere': return '💬'
      default: return '🔑'
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>API Keys</span>
            </CardTitle>
            <CardDescription>
              Manage your API keys for different AI providers
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
            <Plus className="w-4 h-4 mr-2" />
            Add API Key
          </Button>
        </CardHeader>
        <CardContent>
          {/* Add Key Form */}
          {showAddForm && (
            <div className="mb-6 p-4 border border-border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-3">Add New API Key</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input
                      placeholder="e.g., OpenAI Production"
                      value={newKey.name}
                      onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Provider</label>
                    <select
                      value={newKey.provider}
                      onChange={(e) => setNewKey(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    >
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="google">Google</option>
                      <option value="cohere">Cohere</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">API Key</label>
                  <Input
                    type="password"
                    placeholder="Enter your API key"
                    value={newKey.key}
                    onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your API key will be encrypted and stored securely.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={handleAddKey} disabled={isLoading}>
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Add Key
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* API Keys List */}
          {apiKeys.length > 0 ? (
            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getProviderIcon(apiKey.provider)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{apiKey.name}</h4>
                        <Badge className={getStatusColor(apiKey.isActive)}>
                          {apiKey.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span className="capitalize">{apiKey.provider}</span>
                        <span>•</span>
                        <span className="font-mono">
                          {showKeys[apiKey.id] ? 'sk-...' : apiKey.keyPreview}
                        </span>
                        {apiKey.lastUsed && (
                          <>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Used {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {showKeys[apiKey.id] ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestKey(apiKey.id, apiKey.name)}
                      disabled={testingKeys[apiKey.id]}
                    >
                      {testingKeys[apiKey.id] ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <TestTube className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteKey(apiKey.id, apiKey.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No API Keys</h3>
              <p className="text-muted-foreground mb-4">
                Add your first API key to start using AI models in your agents
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add API Key
              </Button>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Security Notice</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your API keys are encrypted and stored securely. They are only used to make requests to AI providers on your behalf. 
                  You can revoke access at any time by deleting the key from this interface.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
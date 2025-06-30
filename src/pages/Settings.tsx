import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/Toast'
import { 
  Key, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit
} from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  provider: string
  keyPreview: string
  isActive: boolean
  lastUsed?: string
  createdAt: string
}

export function Settings() {
  const { user, updateProfile } = useAuthStore()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || ''
  })

  // API Keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'OpenAI Production',
      provider: 'OpenAI',
      keyPreview: 'sk-...abc123',
      isActive: true,
      lastUsed: '2 hours ago',
      createdAt: '2025-01-20'
    },
    {
      id: '2',
      name: 'Anthropic Claude',
      provider: 'Anthropic',
      keyPreview: 'sk-...def456',
      isActive: false,
      createdAt: '2025-01-18'
    }
  ])

  const [showAddKeyForm, setShowAddKeyForm] = useState(false)
  const [newApiKey, setNewApiKey] = useState({
    name: '',
    provider: 'OpenAI',
    key: ''
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    executionAlerts: true,
    errorAlerts: true,
    weeklyReports: false
  })

  const handleProfileUpdate = async () => {
    setIsLoading(true)
    try {
      await updateProfile(profileData)
      addToast({
        type: 'success',
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.'
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update profile'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddApiKey = () => {
    if (!newApiKey.name || !newApiKey.key) {
      addToast({
        type: 'error',
        title: 'Invalid Input',
        description: 'Please provide both name and API key.'
      })
      return
    }

    const apiKey: ApiKey = {
      id: Date.now().toString(),
      name: newApiKey.name,
      provider: newApiKey.provider,
      keyPreview: `${newApiKey.key.slice(0, 3)}...${newApiKey.key.slice(-6)}`,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setApiKeys(prev => [...prev, apiKey])
    setNewApiKey({ name: '', provider: 'OpenAI', key: '' })
    setShowAddKeyForm(false)
    
    addToast({
      type: 'success',
      title: 'API Key Added',
      description: 'Your API key has been added successfully.'
    })
  }

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id))
    addToast({
      type: 'success',
      title: 'API Key Deleted',
      description: 'API key has been removed.'
    })
  }

  const toggleApiKey = (id: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === id ? { ...key, isActive: !key.isActive } : key
    ))
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      type="email"
                    />
                  </div>
                </div>
                <Button onClick={handleProfileUpdate} disabled={isLoading}>
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}

          {/* API Keys */}
          {activeTab === 'api-keys' && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>
                      Manage your API keys for different AI providers
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowAddKeyForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Key
                  </Button>
                </CardHeader>
                <CardContent>
                  {showAddKeyForm && (
                    <div className="mb-6 p-4 border border-border rounded-lg bg-muted/50">
                      <h4 className="font-medium mb-3">Add New API Key</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Key name"
                          value={newApiKey.name}
                          onChange={(e) => setNewApiKey(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <select
                          value={newApiKey.provider}
                          onChange={(e) => setNewApiKey(prev => ({ ...prev, provider: e.target.value }))}
                          className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                          <option value="OpenAI">OpenAI</option>
                          <option value="Anthropic">Anthropic</option>
                          <option value="Google">Google</option>
                          <option value="Cohere">Cohere</option>
                        </select>
                        <Input
                          placeholder="API key"
                          type="password"
                          value={newApiKey.key}
                          onChange={(e) => setNewApiKey(prev => ({ ...prev, key: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Button size="sm" onClick={handleAddApiKey}>
                          Add Key
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowAddKeyForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${apiKey.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <div>
                            <h4 className="font-medium">{apiKey.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{apiKey.provider}</span>
                              <span>•</span>
                              <span>{apiKey.keyPreview}</span>
                              {apiKey.lastUsed && (
                                <>
                                  <span>•</span>
                                  <span>Used {apiKey.lastUsed}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={apiKey.isActive ? 'default' : 'secondary'}>
                            {apiKey.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleApiKey(apiKey.id)}
                          >
                            {apiKey.isActive ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteApiKey(apiKey.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how you want to be notified about agent activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {key === 'emailNotifications' && 'Receive notifications via email'}
                        {key === 'executionAlerts' && 'Get notified when agents complete executions'}
                        {key === 'errorAlerts' && 'Receive alerts when agents encounter errors'}
                        {key === 'weeklyReports' && 'Get weekly performance reports'}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">
                      Enable 2FA
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-muted-foreground">
                        Update your account password
                      </p>
                    </div>
                    <Button variant="outline">
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Active Sessions</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage your active login sessions
                      </p>
                    </div>
                    <Button variant="outline">
                      View Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your platform experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm">
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                  </select>
                </div>

                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
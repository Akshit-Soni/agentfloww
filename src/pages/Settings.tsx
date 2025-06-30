import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/Toast'
import { ApiKeyManagement } from '@/components/settings/ApiKeyManagement'
import { 
  Key, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Eye,
  EyeOff,
  LogOut,
  Globe,
  Clock
} from 'lucide-react'

export function Settings() {
  const { user, updateProfile, signOut } = useAuthStore()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('api-keys')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('UTC')

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || ''
  })

  // Password settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    executionAlerts: true,
    errorAlerts: true,
    weeklyReports: false
  })

  // Mock active sessions
  const [activeSessions, setActiveSessions] = useState([
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'Bhopal, India',
      lastActive: new Date().toISOString(),
      current: true
    },
    {
      id: '2',
      device: 'Mobile App on Android',
      location: 'Sehore, India',
      lastActive: new Date(Date.now() - 86400000).toISOString(),
      current: false
    }
  ])

  useEffect(() => {
    // Initialize theme based on system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark ? 'dark' : 'light')
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', prefersDark)
  }, [])

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', prefersDark)
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
    
    addToast({
      type: 'success',
      title: 'Theme Updated',
      description: `Theme has been changed to ${newTheme}.`
    })
  }

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

  const handlePasswordChange = async () => {
    setIsLoading(true)
    try {
      // Validation
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match')
      }
      
      if (passwordData.newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }
      
      // Mock password change
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      addToast({
        type: 'success',
        title: 'Password Updated',
        description: 'Your password has been changed successfully.'
      })
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Password Change Failed',
        description: error instanceof Error ? error.message : 'Failed to change password'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId))
    
    addToast({
      type: 'success',
      title: 'Session Removed',
      description: 'The session has been terminated successfully.'
    })
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      addToast({
        type: 'success',
        title: 'Signed Out',
        description: 'You have been signed out successfully.'
      })
      // Redirect will happen automatically via AuthGuard
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Sign Out Failed',
        description: error instanceof Error ? error.message : 'Failed to sign out'
      })
    }
  }

  const tabs = [
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'profile', label: 'Profile', icon: User },
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
          {/* API Keys */}
          {activeTab === 'api-keys' && <ApiKeyManagement />}

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
                <Button className="mt-4">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter your current password"
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                    />
                  </div>
                  
                  <Button 
                    onClick={handlePasswordChange} 
                    disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Change Password
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>
                    Manage your active login sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{session.device}</h4>
                            {session.current && (
                              <Badge variant="outline" className="text-xs">Current</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <Globe className="w-3 h-3" />
                            <span>{session.location}</span>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>Last active {new Date(session.lastActive).toLocaleString()}</span>
                          </div>
                        </div>
                        {!session.current && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRemoveSession(session.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      variant="destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out of All Sessions
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
                  <select 
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    value={theme}
                    onChange={(e) => handleThemeChange(e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select 
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <select 
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Asia/Kolkata">India (IST)</option>
                  </select>
                </div>

                <Button onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Preferences Saved',
                    description: 'Your preferences have been updated successfully.'
                  })
                }}>
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
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { BoltBadge } from '@/components/ui/BoltBadge'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/Toast'
import { Zap, AlertCircle } from 'lucide-react'

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const { signIn, signUp, isLoading, error, clearError } = useAuthStore()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  // Get redirect path from URL query params
  const getRedirectPath = () => {
    const searchParams = new URLSearchParams(location.search)
    return searchParams.get('redirect') || '/dashboard'
  }

  // Clear errors when component mounts or when switching between login/signup
  useEffect(() => {
    clearError()
  }, [isLogin, clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    try {
      if (isLogin) {
        await signIn(email, password)
        addToast({
          type: 'success',
          title: 'Welcome back!',
          description: 'You have been successfully signed in.'
        })
        navigate(getRedirectPath(), { replace: true })
      } else {
        await signUp(email, password, name)
        addToast({
          type: 'success',
          title: 'Account created!',
          description: 'Your account has been created successfully.'
        })
        navigate('/dashboard', { replace: true })
      }
    } catch (error) {
      // Error is already handled by the store
      console.error('Auth error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">agentfloww</h1>
              <p className="text-sm text-muted-foreground">AI Agent Platform</p>
            </div>
          </div>
          <CardTitle>{isLogin ? 'Welcome back' : 'Create account'}</CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Sign in to your account to continue' 
              : 'Sign up to get started with AI agents'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Bolt.new Badge */}
      <div className="absolute bottom-4 right-4">
        <BoltBadge />
      </div>
    </div>
  )
}
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { LoginForm } from './LoginForm'

interface AuthGuardProps {
  children?: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading, error, initialize, clearError } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        await initialize()
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsInitialized(true)
      }
    }
    
    initAuth()
    
    return () => {
      // Clear any errors when component unmounts
      clearError()
    }
  }, [initialize, clearError])

  // If no children provided, this is the login route
  if (!children) {
    if (isLoading || !isInitialized) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    }

    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard', { replace: true })
      return null
    }

    return <LoginForm />
  }

  // For protected routes
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // Save the current location to redirect back after login
    const currentPath = location.pathname
    navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, { replace: true })
    return null
  }

  return <>{children}</>
}
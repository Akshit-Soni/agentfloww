import React from 'react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { LogOut, User } from 'lucide-react'

export function Header() {
  const { user, signOut } = useAuthStore()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">
            {user?.user_metadata?.name || user?.email || 'User'}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </header>
  )
}
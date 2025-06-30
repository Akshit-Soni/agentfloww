import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [timeouts, setTimeouts] = useState<Map<string, NodeJS.Timeout>>(new Map())

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
    
    // Auto remove after 5 seconds with proper cleanup
    const timeoutId = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
      setTimeouts(prev => {
        const newTimeouts = new Map(prev)
        newTimeouts.delete(id)
        return newTimeouts
      })
    }, 5000)

    setTimeouts(prev => new Map(prev).set(id, timeoutId))
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    
    // Clear timeout if exists
    const timeoutId = timeouts.get(id)
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeouts(prev => {
        const newTimeouts = new Map(prev)
        newTimeouts.delete(id)
        return newTimeouts
      })
    }
  }, [timeouts])

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      timeouts.forEach(timeoutId => clearTimeout(timeoutId))
    }
  }, [timeouts])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
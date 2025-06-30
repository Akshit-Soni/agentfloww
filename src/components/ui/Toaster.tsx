import React from 'react'
import { useToast } from './Toast'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { Button } from './Button'

export function Toaster() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const Icon = {
          success: CheckCircle,
          error: AlertCircle,
          warning: AlertTriangle,
          info: Info,
        }[toast.type]

        const colors = {
          success: 'bg-green-50 border-green-200 text-green-800',
          error: 'bg-red-50 border-red-200 text-red-800',
          warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          info: 'bg-blue-50 border-blue-200 text-blue-800',
        }[toast.type]

        return (
          <div
            key={toast.id}
            className={`max-w-sm w-full border rounded-lg p-4 shadow-lg ${colors}`}
          >
            <div className="flex items-start">
              <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium">{toast.title}</h4>
                {toast.description && (
                  <p className="text-sm mt-1 opacity-90">{toast.description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeToast(toast.id)}
                className="ml-2 h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
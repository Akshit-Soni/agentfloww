import React from 'react'
import { ExternalLink } from 'lucide-react'

interface BoltBadgeProps {
  className?: string
}

export function BoltBadge({ className = '' }: BoltBadgeProps) {
  return (
    <a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors group ${className}`}
      title="Built with Bolt.new"
    >
      <span className="text-xs">Built with</span>
      <span className="font-medium text-blue-600 group-hover:text-blue-700">Bolt.new</span>
      <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-75" />
    </a>
  )
}
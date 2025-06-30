import React from 'react'
import { Button } from '@/components/ui/Button'
import { Play, Save, Upload, Download, Settings } from 'lucide-react'

interface WorkflowToolbarProps {
  onTest: () => void
  onSave: () => void
  onDeploy: () => void
}

export function WorkflowToolbar({ onTest, onSave, onDeploy }: WorkflowToolbarProps) {
  return (
    <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold">Workflow Builder</h2>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onTest}>
          <Play className="w-4 h-4 mr-2" />
          Test
        </Button>
        <Button variant="outline" size="sm" onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button size="sm" onClick={onDeploy}>
          <Upload className="w-4 h-4 mr-2" />
          Deploy
        </Button>
      </div>
    </div>
  )
}
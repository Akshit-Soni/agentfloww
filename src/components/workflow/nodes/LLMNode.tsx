import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Card } from '@/components/ui/Card'

interface LLMNodeData {
  label: string
  config?: {
    model?: string
    systemPrompt?: string
    temperature?: number
  }
}

export const LLMNode: React.FC<NodeProps<LLMNodeData>> = ({ data, selected }) => {
  return (
    <Card className={`min-w-[180px] p-3 border-2 ${selected ? 'border-blue-500' : 'border-purple-500'} bg-purple-50`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
        <span className="font-medium text-purple-800">{data.label || 'LLM'}</span>
      </div>
      {data.config?.model && (
        <div className="mt-2 text-xs text-purple-600">
          Model: {data.config.model}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
    </Card>
  )
}
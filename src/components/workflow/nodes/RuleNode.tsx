import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Card } from '@/components/ui/Card'

interface RuleNodeData {
  label: string
  config?: {
    condition?: string
    action?: string
  }
}

export const RuleNode: React.FC<NodeProps<RuleNodeData>> = ({ data, selected }) => {
  return (
    <Card className={`min-w-[160px] p-3 border-2 ${selected ? 'border-blue-500' : 'border-orange-500'} bg-orange-50`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-orange-500 border-2 border-white"
      />
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
        <span className="font-medium text-orange-800">{data.label || 'Rule'}</span>
      </div>
      {data.config?.condition && (
        <div className="mt-2 text-xs text-orange-600 truncate">
          {data.config.condition}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-orange-500 border-2 border-white"
      />
    </Card>
  )
}
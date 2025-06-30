import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Card } from '@/components/ui/Card'

interface EndNodeData {
  label: string
}

export const EndNode: React.FC<NodeProps<EndNodeData>> = ({ data, selected }) => {
  return (
    <Card className={`min-w-[150px] p-3 border-2 ${selected ? 'border-blue-500' : 'border-red-500'} bg-red-50`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-red-500 border-2 border-white"
      />
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <span className="font-medium text-red-800">{data.label || 'End'}</span>
      </div>
    </Card>
  )
}
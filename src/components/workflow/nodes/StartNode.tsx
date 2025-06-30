import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Card } from '@/components/ui/Card'

interface StartNodeData {
  label: string
}

export const StartNode: React.FC<NodeProps<StartNodeData>> = ({ data, selected }) => {
  return (
    <Card className={`min-w-[150px] p-3 border-2 ${selected ? 'border-blue-500' : 'border-green-500'} bg-green-50`}>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="font-medium text-green-800">{data.label || 'Start'}</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </Card>
  )
}
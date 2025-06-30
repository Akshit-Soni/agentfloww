import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Card } from '@/components/ui/Card'

interface ConnectorNodeData {
  label: string
  config?: {
    type?: string
    endpoint?: string
  }
}

export const ConnectorNode: React.FC<NodeProps<ConnectorNodeData>> = ({ data, selected }) => {
  return (
    <Card className={`min-w-[170px] p-3 border-2 ${selected ? 'border-blue-500' : 'border-blue-500'} bg-blue-50`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <span className="font-medium text-blue-800">{data.label || 'Connector'}</span>
      </div>
      {data.config?.type && (
        <div className="mt-2 text-xs text-blue-600">
          Type: {data.config.type}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </Card>
  )
}
import React from 'react'
import { Handle, Position } from 'reactflow'
import { Wrench } from 'lucide-react'

export function ToolNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-purple-100 border-2 border-purple-200 min-w-[150px]">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-purple-500"
      />
      <div className="flex items-center space-x-2">
        <Wrench className="w-4 h-4 text-purple-700" />
        <div className="text-purple-700 font-medium">{data.label}</div>
      </div>
      {data.config?.toolName && (
        <div className="text-xs text-purple-600 mt-1">{data.config.toolName}</div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-purple-500"
      />
    </div>
  )
}
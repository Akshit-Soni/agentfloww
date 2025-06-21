import React from 'react'
import { 
  Play, 
  MessageSquare, 
  Database, 
  GitBranch, 
  Webhook, 
  Brain, 
  Filter,
  Zap,
  StopCircle,
  Search,
  Wrench
} from 'lucide-react'
import { Input } from '@/components/ui/Input'

interface NodePaletteProps {
  onAddNode: (type: string, position: { x: number; y: number }) => void
}

const nodeTypes = [
  { type: 'start', label: 'Start', icon: Play, color: 'bg-green-100 text-green-700', category: 'Flow' },
  { type: 'llm', label: 'LLM Call', icon: MessageSquare, color: 'bg-blue-100 text-blue-700', category: 'AI' },
  { type: 'rag', label: 'RAG Retriever', icon: Database, color: 'bg-purple-100 text-purple-700', category: 'AI' },
  { type: 'intent', label: 'Intent Detection', icon: Brain, color: 'bg-pink-100 text-pink-700', category: 'AI' },
  { type: 'tool', label: 'Tool', icon: Wrench, color: 'bg-purple-100 text-purple-700', category: 'Tools' },
  { type: 'rule', label: 'Rule Check', icon: Filter, color: 'bg-orange-100 text-orange-700', category: 'Logic' },
  { type: 'condition', label: 'Condition', icon: GitBranch, color: 'bg-teal-100 text-teal-700', category: 'Logic' },
  { type: 'connector', label: 'Connector', icon: Zap, color: 'bg-yellow-100 text-yellow-700', category: 'Integration' },
  { type: 'webhook', label: 'Webhook', icon: Webhook, color: 'bg-indigo-100 text-indigo-700', category: 'Integration' },
  { type: 'end', label: 'End', icon: StopCircle, color: 'bg-red-100 text-red-700', category: 'Flow' },
]

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All')

  const categories = ['All', ...Array.from(new Set(nodeTypes.map(node => node.category)))]

  const filteredNodes = nodeTypes.filter(node => {
    const matchesSearch = node.label.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || node.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Node Palette</h3>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-2 py-1 border border-input rounded text-xs bg-background"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Nodes */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredNodes.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => handleDragStart(e, node.type)}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent cursor-grab active:cursor-grabbing transition-colors group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${node.color} group-hover:scale-110 transition-transform`}>
                <node.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium block">{node.label}</span>
                <span className="text-xs text-muted-foreground">{node.category}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredNodes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No nodes found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Drag and drop nodes onto the canvas to build your workflow
        </p>
      </div>
    </div>
  )
}
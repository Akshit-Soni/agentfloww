import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { WorkflowToolbar } from '@/components/workflow/WorkflowToolbar'
import { NodePalette } from '@/components/workflow/NodePalette'
import { ChatPanel } from '@/components/workflow/ChatPanel'
import { PropertiesPanel } from '@/components/workflow/PropertiesPanel'
import { DeploymentPanel } from '@/components/workflow/DeploymentPanel'
import { CustomNodes } from '@/components/workflow/nodes'
import { useAgentStore } from '@/store/agentStore'
import { useTemplateStore } from '@/store/templateStore'
import { useToast } from '@/components/ui/Toast'

const nodeTypes = CustomNodes

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'start',
    position: { x: 100, y: 100 },
    data: { label: 'Start' },
  },
]

const initialEdges: Edge[] = []

export function WorkflowBuilder() {
  const { agentId } = useParams()
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('template')
  const { currentAgent, setCurrentAgent, agents, updateWorkflow, updateAgent } = useAgentStore()
  const { createWorkflowFromTemplate, workflowTemplates } = useTemplateStore()
  const { addToast } = useToast()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isDeploymentOpen, setIsDeploymentOpen] = useState(false)

  // Load workflow from template if templateId is provided
  useEffect(() => {
    if (templateId && workflowTemplates.length > 0) {
      const loadTemplateWorkflow = async () => {
        try {
          const workflow = await createWorkflowFromTemplate(templateId)
          setNodes(workflow.nodes)
          setEdges(workflow.edges)
          
          const template = workflowTemplates.find(t => t.id === templateId)
          if (template) {
            addToast({
              type: 'success',
              title: 'Template Loaded',
              description: `Workflow template "${template.name}" has been loaded successfully.`
            })
          }
        } catch (error) {
          addToast({
            type: 'error',
            title: 'Template Load Failed',
            description: error instanceof Error ? error.message : 'Failed to load template'
          })
        }
      }
      
      loadTemplateWorkflow()
    }
  }, [templateId, workflowTemplates, createWorkflowFromTemplate, setNodes, setEdges, addToast])

  // Load agent if agentId is provided
  useEffect(() => {
    if (agentId && agents.length > 0) {
      const agent = agents.find(a => a.id === agentId)
      if (agent) {
        setCurrentAgent(agent)
        if (agent.workflow.nodes.length > 0) {
          setNodes(agent.workflow.nodes)
          setEdges(agent.workflow.edges)
        }
      }
    }
  }, [agentId, agents, setCurrentAgent, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const reactFlowBounds = (event.target as Element).getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      addNode(type, position)
    },
    [setNodes]
  )

  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const id = `${type}-${Date.now()}`
    const newNode: Node = {
      id,
      type,
      position,
      data: { 
        label: type.charAt(0).toUpperCase() + type.slice(1),
        config: {}
      },
    }
    setNodes((nds) => [...nds, newNode])
  }, [setNodes])

  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    )
  }, [setNodes])

  const handleSave = useCallback(async () => {
    if (currentAgent) {
      const workflow = {
        nodes,
        edges,
        settings: currentAgent.workflow.settings
      }
      updateWorkflow(workflow)
      
      // Save to database
      try {
        await updateAgent(currentAgent.id, { workflow })
        
        addToast({
          type: 'success',
          title: 'Workflow Saved',
          description: 'Your workflow has been saved successfully.'
        })
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Save Failed',
          description: error instanceof Error ? error.message : 'Failed to save workflow'
        })
      }
    } else {
      addToast({
        type: 'info',
        title: 'Create Agent First',
        description: 'Please create an agent first to save this workflow.'
      })
    }
  }, [nodes, edges, currentAgent, updateWorkflow, updateAgent, addToast])

  // Auto-save workflow changes with debouncing
  useEffect(() => {
    const currentAgentState = useAgentStore.getState().currentAgent
    if (currentAgentState && (nodes.length > 1 || edges.length > 0)) {
      const timeoutId = setTimeout(() => {
        const workflow = {
          nodes,
          edges,
          settings: currentAgentState.workflow.settings
        }
        updateWorkflow(workflow)
      }, 1000) // Debounce for 1 second

      return () => clearTimeout(timeoutId)
    }
  }, [nodes, edges, updateWorkflow])

  return (
    <div className="h-full flex">
      {/* Node Palette */}
      <NodePalette onAddNode={addNode} />
      
      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        <WorkflowToolbar 
          onTest={() => setIsChatOpen(true)}
          onSave={handleSave}
          onDeploy={() => setIsDeploymentOpen(true)}
        />
        
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedNode && (
        <PropertiesPanel
          node={selectedNode}
          onUpdateNode={updateNodeData}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Chat Panel */}
      {isChatOpen && (
        <ChatPanel
          onClose={() => setIsChatOpen(false)}
          workflow={{ nodes, edges }}
        />
      )}

      {/* Deployment Panel */}
      {isDeploymentOpen && currentAgent && (
        <DeploymentPanel
          onClose={() => setIsDeploymentOpen(false)}
          agentId={currentAgent.id}
        />
      )}
    </div>
  )
}
import { supabase } from '@/lib/supabase'
import { LLMService } from './LLMService'
import { ToolService } from './ToolService'
import { WorkflowDefinition, WorkflowNode, WorkflowEdge, ExecutionContext, ExecutionResult, ExecutionStep } from '@/types/agent'

export class WorkflowEngine {
  private llmService: LLMService
  private toolService: ToolService
  private executionLocks: Map<string, boolean> = new Map()

  constructor() {
    this.llmService = new LLMService()
    this.toolService = new ToolService()
  }

  async executeWorkflow(
    workflow: WorkflowDefinition,
    input: any,
    agentId: string,
    userId: string
  ): Promise<ExecutionResult> {
    const startTime = Date.now()
    const executionId = crypto.randomUUID()
    const steps: ExecutionStep[] = []

    // Prevent concurrent executions for the same agent
    const lockKey = `${agentId}-${userId}`
    if (this.executionLocks.get(lockKey)) {
      throw new Error('Another execution is already in progress for this agent')
    }

    this.executionLocks.set(lockKey, true)

    try {
      // Create execution record
      await this.createExecutionRecord(executionId, agentId, userId, input)

      // Initialize execution context
      const context: ExecutionContext = {
        executionId,
        agentId,
        userId,
        input,
        variables: { input },
        currentNodeId: ''
      }

      // Find start node
      const startNode = workflow.nodes.find(node => node.type === 'start')
      if (!startNode) {
        throw new Error('No start node found in workflow')
      }

      // Execute workflow
      const result = await this.executeNode(startNode, workflow, context, steps)

      const executionTime = Date.now() - startTime

      // Update execution record
      await this.updateExecutionRecord(executionId, {
        status: result.success ? 'completed' : 'failed',
        output_data: result.output,
        error_message: result.error,
        execution_time_ms: executionTime,
        completed_at: new Date().toISOString()
      })

      return {
        success: result.success,
        output: result.output,
        error: result.error,
        executionTime,
        steps
      }
    } catch (error) {
      const executionTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      await this.updateExecutionRecord(executionId, {
        status: 'failed',
        error_message: errorMessage,
        execution_time_ms: executionTime,
        completed_at: new Date().toISOString()
      })

      return {
        success: false,
        output: null,
        error: errorMessage,
        executionTime,
        steps
      }
    } finally {
      // Release execution lock
      this.executionLocks.delete(lockKey)
    }
  }

  private async executeNode(
    node: WorkflowNode,
    workflow: WorkflowDefinition,
    context: ExecutionContext,
    steps: ExecutionStep[]
  ): Promise<{ success: boolean; output: any; error?: string }> {
    const stepStartTime = Date.now()
    context.currentNodeId = node.id

    const step: ExecutionStep = {
      nodeId: node.id,
      nodeType: node.type,
      status: 'running',
      input: context.variables,
      output: null,
      startTime: stepStartTime
    }
    steps.push(step)

    try {
      // Create step record
      await this.createStepRecord(context.executionId, step)

      let result: any

      switch (node.type) {
        case 'start':
          result = await this.executeStartNode(node, context)
          break
        case 'llm':
          result = await this.executeLLMNode(node, context)
          break
        case 'tool':
          result = await this.executeToolNode(node, context)
          break
        case 'rule':
          result = await this.executeRuleNode(node, context)
          break
        case 'connector':
          result = await this.executeConnectorNode(node, context)
          break
        case 'condition':
          result = await this.executeConditionNode(node, context)
          break
        case 'end':
          result = await this.executeEndNode(node, context)
          break
        default:
          throw new Error(`Unknown node type: ${node.type}`)
      }

      step.status = 'completed'
      step.output = result
      step.endTime = Date.now()

      // Update step record
      await this.updateStepRecord(context.executionId, step)

      // Update context variables
      context.variables[node.id] = result

      // If this is an end node, return the result
      if (node.type === 'end') {
        return { success: true, output: result }
      }

      // Find next nodes
      const nextEdges = workflow.edges.filter(edge => edge.source === node.id)
      
      if (nextEdges.length === 0) {
        // No next nodes, workflow complete
        return { success: true, output: result }
      }

      // Execute next nodes (for now, just execute the first one)
      const nextEdge = nextEdges[0]
      const nextNode = workflow.nodes.find(n => n.id === nextEdge.target)
      
      if (!nextNode) {
        throw new Error(`Next node not found: ${nextEdge.target}`)
      }

      return await this.executeNode(nextNode, workflow, context, steps)

    } catch (error) {
      step.status = 'failed'
      step.error = error instanceof Error ? error.message : 'Unknown error'
      step.endTime = Date.now()

      await this.updateStepRecord(context.executionId, step)

      return {
        success: false,
        output: null,
        error: step.error
      }
    }
  }

  private async executeStartNode(node: WorkflowNode, context: ExecutionContext) {
    return {
      message: 'Workflow started',
      input: context.input,
      timestamp: new Date().toISOString()
    }
  }

  private async executeLLMNode(node: WorkflowNode, context: ExecutionContext) {
    const config = node.data.config || {}
    const model = config.model || 'gpt-3.5-turbo'
    const systemPrompt = config.systemPrompt || 'You are a helpful assistant.'
    const temperature = config.temperature || 0.7

    // Get user input or previous node output
    const userMessage = context.variables.input?.message || 
                       context.variables.input || 
                       'Hello'

    return await this.llmService.generateResponse({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: String(userMessage) }
      ],
      temperature,
      userId: context.userId
    })
  }

  private async executeToolNode(node: WorkflowNode, context: ExecutionContext) {
    const config = node.data.config || {}
    const toolId = config.toolId
    
    if (!toolId) {
      throw new Error('No tool selected for tool node')
    }

    // Prepare tool input from parameter values and context variables
    const toolInput: Record<string, any> = {}
    
    if (config.parameterValues) {
      Object.entries(config.parameterValues).forEach(([key, value]) => {
        // Support variable substitution from context
        if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
          const variableName = value.slice(2, -2).trim()
          toolInput[key] = context.variables[variableName] || value
        } else {
          toolInput[key] = value
        }
      })
    }

    return await this.toolService.executeTool(toolId, toolInput, context.userId)
  }

  private async executeRuleNode(node: WorkflowNode, context: ExecutionContext) {
    const config = node.data.config || {}
    const condition = config.condition || 'true'
    const action = config.action || 'continue'

    // Simple condition evaluation (in production, use a proper expression evaluator)
    let conditionResult = false
    try {
      // Basic string matching for demo
      if (condition.includes('input.contains')) {
        const searchTerm = condition.match(/contains\(['"](.+?)['"]\)/)?.[1]
        if (searchTerm) {
          const inputText = String(context.variables.input?.message || context.variables.input || '')
          conditionResult = inputText.toLowerCase().includes(searchTerm.toLowerCase())
        }
      } else if (condition === 'true') {
        conditionResult = true
      }
    } catch (error) {
      console.warn('Rule evaluation error:', error)
    }

    return {
      condition,
      result: conditionResult,
      action,
      message: conditionResult ? 'Condition met' : 'Condition not met'
    }
  }

  private async executeConnectorNode(node: WorkflowNode, context: ExecutionContext) {
    const config = node.data.config || {}
    const connectorType = config.type || 'webhook'
    const action = config.action || 'send'

    // Mock connector execution
    return {
      connector: connectorType,
      action,
      status: 'success',
      message: `${connectorType} ${action} executed successfully`,
      timestamp: new Date().toISOString()
    }
  }

  private async executeConditionNode(node: WorkflowNode, context: ExecutionContext) {
    // Similar to rule node but for branching logic
    return await this.executeRuleNode(node, context)
  }

  private async executeEndNode(node: WorkflowNode, context: ExecutionContext) {
    return {
      message: 'Workflow completed',
      finalOutput: context.variables,
      timestamp: new Date().toISOString()
    }
  }

  private async createExecutionRecord(executionId: string, agentId: string, userId: string, input: any) {
    try {
      const { error } = await supabase
        .from('workflow_executions')
        .insert({
          id: executionId,
          agent_id: agentId,
          user_id: userId,
          status: 'running',
          input_data: input,
          started_at: new Date().toISOString()
        })

      if (error) {
        console.error('Failed to create execution record:', error)
      }
    } catch (error) {
      console.error('Failed to create execution record:', error)
    }
  }

  private async updateExecutionRecord(executionId: string, updates: any) {
    try {
      const { error } = await supabase
        .from('workflow_executions')
        .update(updates)
        .eq('id', executionId)

      if (error) {
        console.error('Failed to update execution record:', error)
      }
    } catch (error) {
      console.error('Failed to update execution record:', error)
    }
  }

  private async createStepRecord(executionId: string, step: ExecutionStep) {
    try {
      const { error } = await supabase
        .from('workflow_execution_steps')
        .insert({
          execution_id: executionId,
          node_id: step.nodeId,
          node_type: step.nodeType,
          status: step.status,
          input_data: step.input,
          started_at: new Date(step.startTime).toISOString()
        })

      if (error) {
        console.error('Failed to create step record:', error)
      }
    } catch (error) {
      console.error('Failed to create step record:', error)
    }
  }

  private async updateStepRecord(executionId: string, step: ExecutionStep) {
    try {
      const { error } = await supabase
        .from('workflow_execution_steps')
        .update({
          status: step.status,
          output_data: step.output,
          error_message: step.error,
          execution_time_ms: step.endTime ? step.endTime - step.startTime : null,
          completed_at: step.endTime ? new Date(step.endTime).toISOString() : null
        })
        .eq('execution_id', executionId)
        .eq('node_id', step.nodeId)

      if (error) {
        console.error('Failed to update step record:', error)
      }
    } catch (error) {
      console.error('Failed to update step record:', error)
    }
  }
}
import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { WorkflowDefinition } from '@/types/agent'

export interface Agent {
  id: string
  user_id: string
  name: string
  description?: string
  type: 'llm' | 'hybrid' | 'rule-based' | 'event'
  status: 'draft' | 'active' | 'inactive' | 'deployed'
  workflow: WorkflowDefinition
  deployed_url?: string
  created_at: string
  updated_at: string
}

interface AgentStore {
  agents: Agent[]
  currentAgent: Agent | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchAgents: () => Promise<void>
  createAgent: (agentData: Partial<Agent>) => Promise<Agent>
  updateAgent: (id: string, updates: Partial<Agent>) => Promise<void>
  updateWorkflow: (workflow: WorkflowDefinition) => void
  deleteAgent: (id: string) => Promise<void>
  setCurrentAgent: (agent: Agent | null) => void
  deployAgent: (id: string) => Promise<string>
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: [],
  currentAgent: null,
  isLoading: false,
  error: null,

  fetchAgents: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      set({ agents: data || [], isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch agents',
        isLoading: false 
      })
    }
  },

  createAgent: async (agentData) => {
    set({ isLoading: true, error: null })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const newAgent = {
        user_id: user.id,
        name: agentData.name || 'Untitled Agent',
        description: agentData.description,
        type: agentData.type || 'llm',
        status: agentData.status || 'draft',
        workflow: agentData.workflow || {
          nodes: [],
          edges: [],
          settings: {
            timeout: 60,
            retries: 2,
            parallelism: 1,
            logging: true
          }
        }
      }

      const { data, error } = await supabase
        .from('agents')
        .insert([newAgent])
        .select()
        .single()

      if (error) throw error

      const agents = get().agents
      set({ 
        agents: [data, ...agents],
        isLoading: false 
      })

      return data
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create agent',
        isLoading: false 
      })
      throw error
    }
  },

  updateAgent: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('agents')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const agents = get().agents
      const updatedAgents = agents.map(agent => 
        agent.id === id ? { ...agent, ...data } : agent
      )

      set({ 
        agents: updatedAgents,
        currentAgent: get().currentAgent?.id === id ? { ...get().currentAgent!, ...data } : get().currentAgent,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update agent',
        isLoading: false 
      })
    }
  },

  updateWorkflow: (workflow) => {
    const currentAgent = get().currentAgent
    if (!currentAgent) return

    const updatedAgent = {
      ...currentAgent,
      workflow
    }

    // Update local state immediately
    set({ currentAgent: updatedAgent })

    // Update the agent in the agents array
    const agents = get().agents
    const updatedAgents = agents.map(agent => 
      agent.id === currentAgent.id ? updatedAgent : agent
    )
    set({ agents: updatedAgents })
  },

  deleteAgent: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id)

      if (error) throw error

      const agents = get().agents
      const filteredAgents = agents.filter(agent => agent.id !== id)

      set({ 
        agents: filteredAgents,
        currentAgent: get().currentAgent?.id === id ? null : get().currentAgent,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete agent',
        isLoading: false 
      })
    }
  },

  setCurrentAgent: (agent) => {
    set({ currentAgent: agent })
  },

  deployAgent: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const agent = get().agents.find(a => a.id === id)
      if (!agent) throw new Error('Agent not found')

      // Mock deployment - in a real app, this would deploy to a serverless platform
      const deployedUrl = `https://agent-${id.slice(0, 8)}.example.com`
      
      await get().updateAgent(id, { 
        status: 'deployed',
        deployed_url: deployedUrl
      })

      set({ isLoading: false })
      return deployedUrl
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to deploy agent',
        isLoading: false 
      })
      throw error
    }
  }
}))
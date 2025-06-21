import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { WorkflowBuilder } from '@/pages/WorkflowBuilder'
import { AgentLibrary } from '@/pages/AgentLibrary'
import { AgentBuilder } from '@/pages/AgentBuilder'
import { ModelMarketplace } from '@/pages/ModelMarketplace'
import { Analytics } from '@/pages/Analytics'
import { Settings } from '@/pages/Settings'
import { WorkflowExecutions } from '@/pages/WorkflowExecutions'
import { Tools } from '@/pages/Tools'
import { ToolBuilder } from '@/pages/ToolBuilder'
import { Toaster } from '@/components/ui/Toaster'
import { ToastProvider } from '@/components/ui/Toast'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <ToastProvider>
        <Toaster />
        <AuthGuard>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/builder" element={<WorkflowBuilder />} />
              <Route path="/builder/:agentId" element={<WorkflowBuilder />} />
              <Route path="/agents" element={<AgentLibrary />} />
              <Route path="/agents/new" element={<AgentBuilder />} />
              <Route path="/agents/edit/:agentId" element={<AgentBuilder />} />
              <Route path="/executions" element={<WorkflowExecutions />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/new" element={<ToolBuilder />} />
              <Route path="/tools/edit/:toolId" element={<ToolBuilder />} />
              <Route path="/marketplace" element={<ModelMarketplace />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </AuthGuard>
      </ToastProvider>
    </div>
  )
}

export default App
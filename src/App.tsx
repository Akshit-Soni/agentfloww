import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Layout } from '@/components/layout/Layout'
import { Landing } from '@/pages/Landing'
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
import { Templates } from '@/pages/Templates'
import { Toaster } from '@/components/ui/Toaster'
import { ToastProvider } from '@/components/ui/Toast'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <ToastProvider>
        <Toaster />
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthGuard />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <AuthGuard>
              <Layout>
                <Dashboard />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/builder" element={
            <AuthGuard>
              <Layout>
                <WorkflowBuilder />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/builder/:agentId" element={
            <AuthGuard>
              <Layout>
                <WorkflowBuilder />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/agents" element={
            <AuthGuard>
              <Layout>
                <AgentLibrary />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/agents/new" element={
            <AuthGuard>
              <Layout>
                <AgentBuilder />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/agents/edit/:agentId" element={
            <AuthGuard>
              <Layout>
                <AgentBuilder />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/executions" element={
            <AuthGuard>
              <Layout>
                <WorkflowExecutions />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/tools" element={
            <AuthGuard>
              <Layout>
                <Tools />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/tools/new" element={
            <AuthGuard>
              <Layout>
                <ToolBuilder />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/tools/edit/:toolId" element={
            <AuthGuard>
              <Layout>
                <ToolBuilder />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/templates" element={
            <AuthGuard>
              <Layout>
                <Templates />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/marketplace" element={
            <AuthGuard>
              <Layout>
                <ModelMarketplace />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/analytics" element={
            <AuthGuard>
              <Layout>
                <Analytics />
              </Layout>
            </AuthGuard>
          } />
          <Route path="/settings" element={
            <AuthGuard>
              <Layout>
                <Settings />
              </Layout>
            </AuthGuard>
          } />
        </Routes>
      </ToastProvider>
    </div>
  )
}

export default App
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Calendar,
  Filter
} from 'lucide-react'

export function Analytics() {
  const [timeRange, setTimeRange] = useState('7d')

  // Mock data for charts
  const executionData = [
    { name: 'Mon', executions: 12, success: 10, failed: 2 },
    { name: 'Tue', executions: 19, success: 17, failed: 2 },
    { name: 'Wed', executions: 15, success: 13, failed: 2 },
    { name: 'Thu', executions: 22, success: 20, failed: 2 },
    { name: 'Fri', executions: 28, success: 25, failed: 3 },
    { name: 'Sat', executions: 18, success: 16, failed: 2 },
    { name: 'Sun', executions: 14, success: 12, failed: 2 }
  ]

  const performanceData = [
    { name: 'Mon', avgTime: 1.2, p95Time: 2.1 },
    { name: 'Tue', avgTime: 1.1, p95Time: 1.9 },
    { name: 'Wed', avgTime: 1.3, p95Time: 2.3 },
    { name: 'Thu', avgTime: 1.0, p95Time: 1.8 },
    { name: 'Fri', avgTime: 1.4, p95Time: 2.5 },
    { name: 'Sat', avgTime: 1.2, p95Time: 2.0 },
    { name: 'Sun', avgTime: 1.1, p95Time: 1.9 }
  ]

  const agentUsageData = [
    { name: 'Customer Support', value: 35, color: '#3B82F6' },
    { name: 'Content Writer', value: 25, color: '#8B5CF6' },
    { name: 'Data Analyst', value: 20, color: '#10B981' },
    { name: 'Email Assistant', value: 15, color: '#F59E0B' },
    { name: 'Others', value: 5, color: '#6B7280' }
  ]

  const stats = [
    {
      title: 'Total Executions',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: Activity,
      description: 'vs last week'
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      description: 'vs last week'
    },
    {
      title: 'Avg Response Time',
      value: '1.2s',
      change: '-0.3s',
      trend: 'up',
      icon: Clock,
      description: 'vs last week'
    },
    {
      title: 'Error Rate',
      value: '5.8%',
      change: '-1.2%',
      trend: 'up',
      icon: AlertCircle,
      description: 'vs last week'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your AI agents' performance and usage
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stat.description}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Execution Trends</CardTitle>
            <CardDescription>
              Daily execution volume and success rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={executionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="success" stackId="a" fill="#10B981" name="Success" />
                <Bar dataKey="failed" stackId="a" fill="#EF4444" name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
            <CardDescription>
              Average and 95th percentile response times
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Average"
                />
                <Line 
                  type="monotone" 
                  dataKey="p95Time" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="95th Percentile"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agent Usage and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Usage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Usage Distribution</CardTitle>
            <CardDescription>
              Execution breakdown by agent type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agentUsageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {agentUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest agent executions and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  agent: 'Customer Support Agent',
                  action: 'Processed customer inquiry',
                  status: 'success',
                  time: '2 minutes ago'
                },
                {
                  agent: 'Content Writer',
                  action: 'Generated blog post',
                  status: 'success',
                  time: '5 minutes ago'
                },
                {
                  agent: 'Data Analyst',
                  action: 'Failed to fetch data',
                  status: 'error',
                  time: '8 minutes ago'
                },
                {
                  agent: 'Email Assistant',
                  action: 'Sent automated response',
                  status: 'success',
                  time: '12 minutes ago'
                },
                {
                  agent: 'Customer Support Agent',
                  action: 'Escalated to human agent',
                  status: 'warning',
                  time: '15 minutes ago'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'error' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.agent}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      activity.status === 'success' ? 'default' :
                      activity.status === 'error' ? 'destructive' :
                      'secondary'
                    }>
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
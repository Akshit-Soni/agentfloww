import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Search, Filter, Star, ExternalLink, Zap, Brain, Code, Image } from 'lucide-react'

interface Model {
  id: string
  name: string
  provider: string
  description: string
  type: 'text' | 'image' | 'code' | 'multimodal'
  pricing: string
  contextWindow: string
  capabilities: string[]
  rating: number
  isPopular: boolean
  apiEndpoint?: string
}

export function ModelMarketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterProvider, setFilterProvider] = useState<string>('all')

  const models: Model[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      description: 'Most capable GPT model with superior reasoning and broad knowledge',
      type: 'text',
      pricing: '$0.03/1K tokens',
      contextWindow: '8K tokens',
      capabilities: ['Text generation', 'Reasoning', 'Analysis', 'Code'],
      rating: 4.8,
      isPopular: true,
      apiEndpoint: 'https://api.openai.com/v1/chat/completions'
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      description: 'Faster and more cost-effective version of GPT-4 with larger context',
      type: 'text',
      pricing: '$0.01/1K tokens',
      contextWindow: '128K tokens',
      capabilities: ['Text generation', 'Large context', 'Fast responses'],
      rating: 4.7,
      isPopular: true,
      apiEndpoint: 'https://api.openai.com/v1/chat/completions'
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      description: 'Balanced model with strong performance across a wide range of tasks',
      type: 'text',
      pricing: '$0.015/1K tokens',
      contextWindow: '200K tokens',
      capabilities: ['Text generation', 'Analysis', 'Creative writing', 'Code'],
      rating: 4.6,
      isPopular: true,
      apiEndpoint: 'https://api.anthropic.com/v1/messages'
    },
    {
      id: 'claude-3-haiku',
      name: 'Claude 3 Haiku',
      provider: 'Anthropic',
      description: 'Fast and cost-effective model for simple tasks',
      type: 'text',
      pricing: '$0.0025/1K tokens',
      contextWindow: '200K tokens',
      capabilities: ['Text generation', 'Fast responses', 'Simple tasks'],
      rating: 4.4,
      isPopular: false
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      description: 'Google\'s most capable multimodal model',
      type: 'multimodal',
      pricing: '$0.001/1K tokens',
      contextWindow: '32K tokens',
      capabilities: ['Text', 'Images', 'Code', 'Multimodal reasoning'],
      rating: 4.5,
      isPopular: true,
      apiEndpoint: 'https://generativelanguage.googleapis.com/v1/models'
    },
    {
      id: 'dall-e-3',
      name: 'DALL-E 3',
      provider: 'OpenAI',
      description: 'Advanced image generation model with high quality outputs',
      type: 'image',
      pricing: '$0.04/image',
      contextWindow: 'N/A',
      capabilities: ['Image generation', 'Creative art', 'Photorealistic'],
      rating: 4.6,
      isPopular: true,
      apiEndpoint: 'https://api.openai.com/v1/images/generations'
    },
    {
      id: 'codex',
      name: 'Codex',
      provider: 'OpenAI',
      description: 'Specialized model for code generation and programming tasks',
      type: 'code',
      pricing: '$0.002/1K tokens',
      contextWindow: '8K tokens',
      capabilities: ['Code generation', 'Code completion', 'Programming'],
      rating: 4.3,
      isPopular: false
    }
  ]

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || model.type === filterType
    const matchesProvider = filterProvider === 'all' || model.provider === filterProvider
    return matchesSearch && matchesType && matchesProvider
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <Brain className="w-4 h-4" />
      case 'image': return <Image className="w-4 h-4" />
      case 'code': return <Code className="w-4 h-4" />
      case 'multimodal': return <Zap className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-800'
      case 'image': return 'bg-purple-100 text-purple-800'
      case 'code': return 'bg-green-100 text-green-800'
      case 'multimodal': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const providers = Array.from(new Set(models.map(m => m.provider)))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Model Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Discover and integrate AI models for your agents
          </p>
        </div>
        <Button variant="outline">
          <ExternalLink className="w-4 h-4 mr-2" />
          API Documentation
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All Types</option>
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="code">Code</option>
            <option value="multimodal">Multimodal</option>
          </select>
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All Providers</option>
            {providers.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <Card key={model.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(model.type)}
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  {model.isPopular && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-yellow-600">Popular</span>
                    </div>
                  )}
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {model.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Provider and Type */}
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{model.provider}</Badge>
                  <Badge className={getTypeColor(model.type)}>
                    {model.type}
                  </Badge>
                </div>

                {/* Pricing and Context */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Pricing:</span>
                    <div className="font-medium">{model.pricing}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Context:</span>
                    <div className="font-medium">{model.contextWindow}</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(model.rating)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {model.rating}/5
                  </span>
                </div>

                {/* Capabilities */}
                <div>
                  <span className="text-sm text-muted-foreground">Capabilities:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {model.capabilities.slice(0, 3).map((capability, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                    {model.capabilities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{model.capabilities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-2">
                  <Button className="flex-1">
                    <Zap className="w-4 h-4 mr-2" />
                    Integrate
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No models found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={() => {
            setSearchTerm('')
            setFilterType('all')
            setFilterProvider('all')
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
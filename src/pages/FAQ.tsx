import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  MessageSquare,
  Mail,
  Phone,
  BookOpen,
  Zap,
  Shield,
  CreditCard,
  Settings,
  Users
} from 'lucide-react'

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle, count: 24 },
    { id: 'getting-started', name: 'Getting Started', icon: Zap, count: 6 },
    { id: 'features', name: 'Features & Usage', icon: Settings, count: 8 },
    { id: 'billing', name: 'Billing & Pricing', icon: CreditCard, count: 4 },
    { id: 'security', name: 'Security & Privacy', icon: Shield, count: 3 },
    { id: 'integrations', name: 'Integrations', icon: BookOpen, count: 3 }
  ]

  const faqData = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I create my first AI agent?',
      answer: 'Creating your first AI agent is simple! Start by clicking "Create Agent" in your dashboard, choose from our pre-built templates or start from scratch, configure your agent\'s settings and workflow, then deploy it with one click. Our step-by-step wizard will guide you through the entire process.',
      popular: true
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'What programming knowledge do I need?',
      answer: 'No programming knowledge is required! agentfloww is designed for users of all technical levels. Our visual workflow builder uses drag-and-drop components, making it easy to create sophisticated AI agents without writing any code.',
      popular: true
    },
    {
      id: 3,
      category: 'getting-started',
      question: 'How long does it take to set up an agent?',
      answer: 'Most users can create and deploy their first agent in under 30 minutes using our templates. Custom agents may take longer depending on complexity, but our intuitive interface makes the process as quick as possible.',
      popular: false
    },
    {
      id: 4,
      category: 'features',
      question: 'What types of AI agents can I build?',
      answer: 'You can build various types of AI agents including customer support chatbots, content creation assistants, data analysis agents, workflow automation bots, lead qualification agents, and much more. Our platform supports both conversational and task-based agents.',
      popular: true
    },
    {
      id: 5,
      category: 'features',
      question: 'Can I integrate with my existing tools?',
      answer: 'Yes! agentfloww supports integrations with popular tools like Slack, Microsoft Teams, Salesforce, HubSpot, Gmail, Google Sheets, Zapier, and many more. We also provide REST APIs for custom integrations.',
      popular: true
    },
    {
      id: 6,
      category: 'features',
      question: 'How do I train my AI agent?',
      answer: 'Training happens automatically as your agent interacts with users. You can also upload knowledge bases, FAQs, and training data. Our platform uses advanced machine learning to continuously improve your agent\'s responses.',
      popular: false
    },
    {
      id: 7,
      category: 'features',
      question: 'Can I customize the agent\'s personality?',
      answer: 'Absolutely! You can define your agent\'s tone, personality, communication style, and brand voice. Set custom responses, conversation flows, and even add your company\'s specific terminology and guidelines.',
      popular: false
    },
    {
      id: 8,
      category: 'billing',
      question: 'What are the pricing plans?',
      answer: 'We offer three main plans: Starter ($99/month) for small teams, Professional ($299/month) for growing businesses, and Enterprise (custom pricing) for large organizations. All plans include a 14-day free trial with no credit card required.',
      popular: true
    },
    {
      id: 9,
      category: 'billing',
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, and at the next billing cycle for downgrades. We\'ll prorate any charges accordingly.',
      popular: false
    },
    {
      id: 10,
      category: 'billing',
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied with our service, contact our support team within 30 days of your purchase for a full refund.',
      popular: false
    },
    {
      id: 11,
      category: 'security',
      question: 'How secure is my data?',
      answer: 'We take security seriously. All data is encrypted in transit and at rest using industry-standard AES-256 encryption. We\'re SOC 2 Type II compliant and follow GDPR, HIPAA, and other privacy regulations.',
      popular: true
    },
    {
      id: 12,
      category: 'security',
      question: 'Where is my data stored?',
      answer: 'Your data is stored in secure, enterprise-grade data centers with multiple redundancies. We use AWS and Google Cloud infrastructure with data centers in the US, EU, and Asia-Pacific regions.',
      popular: false
    },
    {
      id: 13,
      category: 'integrations',
      question: 'How do I connect to external APIs?',
      answer: 'Use our API connector tool in the workflow builder. Simply provide the API endpoint, authentication details, and configure the data mapping. We support REST APIs, webhooks, and GraphQL endpoints.',
      popular: false
    },
    {
      id: 14,
      category: 'integrations',
      question: 'Can I use custom databases?',
      answer: 'Yes! You can connect to MySQL, PostgreSQL, MongoDB, and other databases. Use our database connector to set up secure connections and query your data directly from your agents.',
      popular: false
    }
  ]

  const popularQuestions = faqData.filter(item => item.popular).slice(0, 6)

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const quickLinks = [
    { title: 'Getting Started Guide', description: 'Complete guide to building your first agent', icon: Zap },
    { title: 'API Documentation', description: 'Technical documentation for developers', icon: BookOpen },
    { title: 'Video Tutorials', description: 'Step-by-step video walkthroughs', icon: Users },
    { title: 'Community Forum', description: 'Connect with other users and experts', icon: MessageSquare }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Frequently Asked
              <span className="text-primary block">Questions</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about agentfloww. 
              Can't find what you're looking for? Our support team is here to help.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Questions */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Popular Questions</h2>
            <p className="text-xl text-muted-foreground">
              The most frequently asked questions by our users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularQuestions.map((item) => (
              <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    onClick={() => toggleExpanded(item.id)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground leading-tight pr-4">
                      {item.question}
                    </h3>
                    {expandedItems.includes(item.id) ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  
                  {expandedItems.includes(item.id) && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main FAQ Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-3 rounded-md transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <category.icon className="w-4 h-4" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{category.name}</span>
                              <span className="text-xs opacity-75">({category.count})</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quickLinks.map((link, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors">
                        <link.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-foreground">{link.title}</h4>
                          <p className="text-xs text-muted-foreground">{link.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedCategory === 'all' ? 'All Questions' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-muted-foreground">
                  {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-4">
                {filteredFAQs.map((item) => (
                  <Card key={item.id} className="border shadow-sm">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className="w-full text-left p-6 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground pr-4">
                            {item.question}
                          </h3>
                          {expandedItems.includes(item.id) ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                      </button>
                      
                      {expandedItems.includes(item.id) && (
                        <div className="px-6 pb-6">
                          <div className="border-t border-border pt-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* No Results */}
              {filteredFAQs.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No questions found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or browse different categories
                  </p>
                  <Button onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}>
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Can't find the answer you're looking for? Our support team is here to help you succeed.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-8 h-8 text-primary-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-primary-foreground mb-2">Live Chat</h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  Get instant help from our support team
                </p>
                <Button variant="secondary" size="sm">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 text-primary-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-primary-foreground mb-2">Email Support</h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  Send us a detailed message
                </p>
                <Button variant="secondary" size="sm">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 text-primary-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-primary-foreground mb-2">Phone Support</h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  Speak directly with our experts
                </p>
                <Button variant="secondary" size="sm">
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
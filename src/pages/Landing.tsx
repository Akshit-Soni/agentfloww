import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ArrowRight, 
  Bot, 
  Workflow, 
  Zap, 
  Users, 
  CheckCircle, 
  Star,
  Play,
  BarChart3,
  Shield,
  Rocket,
  Brain,
  Settings,
  Globe
} from 'lucide-react'

export function Landing() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Bot,
      title: 'Intelligent AI Agents',
      description: 'Create sophisticated AI agents that understand context, learn from interactions, and deliver personalized experiences.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Workflow,
      title: 'Visual Workflow Builder',
      description: 'Design complex automation workflows with our intuitive drag-and-drop interface. No coding required.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Zap,
      title: 'Lightning Fast Deployment',
      description: 'Deploy your agents instantly to production with one click. Scale automatically based on demand.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Monitor performance, track user interactions, and optimize your agents with detailed insights.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Choose a Template',
      description: 'Start with pre-built templates or create from scratch',
      icon: Bot
    },
    {
      number: '02',
      title: 'Design Your Workflow',
      description: 'Use our visual builder to create intelligent workflows',
      icon: Workflow
    },
    {
      number: '03',
      title: 'Deploy & Monitor',
      description: 'Launch your agent and track its performance in real-time',
      icon: Rocket
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager at TechCorp',
      content: 'agentfloww transformed how we handle customer support. Our response time improved by 80% and customer satisfaction is at an all-time high.',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO at StartupXYZ',
      content: 'The visual workflow builder is incredibly intuitive. We built our first AI agent in under 30 minutes and deployed it the same day.',
      avatar: '👨‍💻',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'Operations Director',
      content: 'The analytics dashboard gives us insights we never had before. We can optimize our agents based on real user data.',
      avatar: '👩‍🔬',
      rating: 5
    }
  ]

  const stats = [
    { value: '10,000+', label: 'Active Agents' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50M+', label: 'Interactions' },
    { value: '500+', label: 'Companies' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              The Future of AI Automation
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Build Intelligent
              <span className="text-primary block">AI Agents</span>
              in Minutes
            </h1>
            
            <p className="text-xl text-mute-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Create, deploy, and manage sophisticated AI agents that automate your workflows, 
              enhance customer experiences, and drive business growth—all without writing a single line of code.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" onClick={() => navigate('/login')} className="text-lg px-8 py-4">
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Build Amazing AI Agents
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful features designed to help you create, deploy, and manage AI agents that deliver real business value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Features Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Enterprise Security</h3>
                <p className="text-muted-foreground">Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Global Scale</h3>
                <p className="text-muted-foreground">Deploy worldwide with automatic scaling and 99.9% uptime guarantee.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Advanced AI</h3>
                <p className="text-muted-foreground">Powered by the latest AI models including GPT-4, Claude, and custom models.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get Started in Three Simple Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From idea to deployment in minutes. Our intuitive platform makes AI agent creation accessible to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-primary/30 transform translate-x-1/2"></div>
                )}
                
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="text-sm font-bold text-primary mb-2">{step.number}</div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={() => navigate('/login')}>
              Start Your First Agent
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how companies are transforming their operations with agentfloww.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Join thousands of companies already using agentfloww to automate workflows, 
            enhance customer experiences, and drive growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/login')} className="text-lg px-8 py-4">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Schedule Demo
            </Button>
          </div>
          
          <p className="text-sm text-primary-foreground/70 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
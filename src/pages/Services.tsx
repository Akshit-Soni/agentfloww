import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  ArrowRight, 
  Bot, 
  Workflow, 
  Zap, 
  BarChart3,
  Shield,
  Globe,
  CheckCircle,
  Star,
  Users,
  Clock,
  Headphones,
  Code,
  Database,
  MessageSquare,
  Settings,
  Rocket
} from 'lucide-react'

export function Services() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('professional')

  const services = [
    {
      icon: Bot,
      title: 'AI Agent Development',
      description: 'Custom AI agents tailored to your specific business needs and workflows.',
      features: [
        'Custom agent design and development',
        'Integration with existing systems',
        'Advanced natural language processing',
        'Multi-channel deployment',
        'Ongoing optimization and training'
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      price: 'Starting at $2,500/month'
    },
    {
      icon: Workflow,
      title: 'Workflow Automation',
      description: 'Streamline complex business processes with intelligent automation.',
      features: [
        'Process analysis and optimization',
        'Visual workflow design',
        'API integrations',
        'Real-time monitoring',
        'Performance analytics'
      ],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      price: 'Starting at $1,500/month'
    },
    {
      icon: MessageSquare,
      title: 'Conversational AI',
      description: 'Advanced chatbots and virtual assistants for customer engagement.',
      features: [
        'Natural conversation flows',
        'Multi-language support',
        'Sentiment analysis',
        'Live chat handoff',
        'Knowledge base integration'
      ],
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      price: 'Starting at $800/month'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Comprehensive analytics and reporting for your AI implementations.',
      features: [
        'Real-time dashboards',
        'Performance metrics',
        'User behavior analysis',
        'ROI tracking',
        'Custom reporting'
      ],
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      price: 'Starting at $500/month'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Enterprise-grade security and compliance for your AI systems.',
      features: [
        'SOC 2 Type II compliance',
        'GDPR & HIPAA compliance',
        'Data encryption at rest and in transit',
        'Role-based access control',
        'Audit logs and monitoring'
      ],
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      price: 'Starting at $1,000/month'
    },
    {
      icon: Headphones,
      title: 'Professional Services',
      description: 'Expert consulting and implementation services for complex projects.',
      features: [
        'Strategic AI consulting',
        'Implementation planning',
        'Training and onboarding',
        'Change management',
        '24/7 technical support'
      ],
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      price: 'Custom pricing'
    }
  ]

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for small teams getting started with AI automation',
      features: [
        'Up to 3 AI agents',
        '1,000 monthly executions',
        'Basic workflow builder',
        'Email support',
        'Standard integrations',
        'Basic analytics'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$299',
      period: '/month',
      description: 'Ideal for growing businesses with advanced automation needs',
      features: [
        'Up to 10 AI agents',
        '10,000 monthly executions',
        'Advanced workflow builder',
        'Priority support',
        'Premium integrations',
        'Advanced analytics',
        'Custom templates',
        'API access'
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Tailored solutions for large organizations with complex requirements',
      features: [
        'Unlimited AI agents',
        'Unlimited executions',
        'Custom workflow builder',
        'Dedicated support',
        'Custom integrations',
        'Enterprise analytics',
        'White-label options',
        'SLA guarantees',
        'On-premise deployment'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ]

  const comparisonFeatures = [
    {
      category: 'Core Features',
      features: [
        { name: 'AI Agents', starter: '3', professional: '10', enterprise: 'Unlimited' },
        { name: 'Monthly Executions', starter: '1,000', professional: '10,000', enterprise: 'Unlimited' },
        { name: 'Workflow Builder', starter: 'Basic', professional: 'Advanced', enterprise: 'Custom' },
        { name: 'Integrations', starter: 'Standard', professional: 'Premium', enterprise: 'Custom' }
      ]
    },
    {
      category: 'Support & Analytics',
      features: [
        { name: 'Support', starter: 'Email', professional: 'Priority', enterprise: 'Dedicated' },
        { name: 'Analytics', starter: 'Basic', professional: 'Advanced', enterprise: 'Enterprise' },
        { name: 'API Access', starter: '❌', professional: '✅', enterprise: '✅' },
        { name: 'SLA', starter: '❌', professional: '❌', enterprise: '99.9%' }
      ]
    }
  ]

  const testimonials = [
    {
      name: 'Jennifer Martinez',
      role: 'VP of Operations, TechFlow',
      content: 'The AI agent development service transformed our customer support. Response times improved by 75% and customer satisfaction is at an all-time high.',
      avatar: '👩‍💼',
      rating: 5,
      service: 'AI Agent Development'
    },
    {
      name: 'Robert Chen',
      role: 'CTO, DataCorp',
      content: 'Their workflow automation service helped us eliminate manual processes that were taking hours each day. The ROI was evident within the first month.',
      avatar: '👨‍💻',
      rating: 5,
      service: 'Workflow Automation'
    },
    {
      name: 'Sarah Williams',
      role: 'Director of Customer Success',
      content: 'The conversational AI solution handles 80% of our customer inquiries automatically, allowing our team to focus on complex issues.',
      avatar: '👩‍🔬',
      rating: 5,
      service: 'Conversational AI'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Comprehensive AI
              <span className="text-primary block">Services & Solutions</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              From custom AI agent development to enterprise-grade automation solutions, 
              we provide everything you need to transform your business with artificial intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={() => navigate('/contact')}>
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive AI solutions designed to meet your unique business needs and drive measurable results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${service.bgColor} flex items-center justify-center mb-4`}>
                    <service.icon className={`w-6 h-6 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-2 mb-6 flex-1">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t pt-4">
                    <p className="text-lg font-semibold text-foreground mb-3">{service.price}</p>
                    <Button className="w-full">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include our core features with no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative border-2 ${plan.popular ? 'border-primary shadow-xl' : 'border-border'} hover:shadow-lg transition-shadow duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-4">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/contact')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-muted">
              <h3 className="text-xl font-semibold text-foreground">Feature Comparison</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-6 font-medium text-foreground">Features</th>
                    <th className="text-center py-4 px-6 font-medium text-foreground">Starter</th>
                    <th className="text-center py-4 px-6 font-medium text-foreground">Professional</th>
                    <th className="text-center py-4 px-6 font-medium text-foreground">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      <tr className="bg-muted/50">
                        <td colSpan={4} className="py-3 px-6 font-semibold text-foreground">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={featureIndex} className="border-b">
                          <td className="py-3 px-6 text-muted-foreground">{feature.name}</td>
                          <td className="py-3 px-6 text-center">{feature.starter}</td>
                          <td className="py-3 px-6 text-center">{feature.professional}</td>
                          <td className="py-3 px-6 text-center">{feature.enterprise}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real results from real customers who have transformed their businesses with our services.
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
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {testimonial.service}
                    </Badge>
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
            Let's discuss how our AI services can help you achieve your business goals and drive growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/contact')}>
              <Rocket className="w-5 h-5 mr-2" />
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Schedule Consultation
            </Button>
          </div>
          
          <p className="text-sm text-primary-foreground/70 mt-6">
            Free consultation • Custom pricing • 30-day money-back guarantee
          </p>
        </div>
      </section>
    </div>
  )
}
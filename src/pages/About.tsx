import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ArrowRight, 
  Users, 
  Target, 
  Award, 
  Globe,
  Heart,
  Lightbulb,
  Shield,
  Zap,
  Mail
} from 'lucide-react'

export function About() {
  const navigate = useNavigate()

  const team = [
    {
      name: 'Alex Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former AI researcher at Google with 10+ years in machine learning and enterprise software.',
      avatar: '👨‍💼',
      linkedin: '#'
    },
    {
      name: 'Sarah Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Microsoft engineer specializing in distributed systems and AI infrastructure.',
      avatar: '👩‍💻',
      linkedin: '#'
    },
    {
      name: 'Marcus Johnson',
      role: 'Head of Product',
      bio: 'Product leader with experience at Slack and Notion, passionate about user experience.',
      avatar: '👨‍🎨',
      linkedin: '#'
    },
    {
      name: 'Emily Watson',
      role: 'Head of Engineering',
      bio: 'Full-stack engineer and former tech lead at Stripe, expert in scalable architectures.',
      avatar: '👩‍🔬',
      linkedin: '#'
    },
    {
      name: 'David Kim',
      role: 'Head of AI Research',
      bio: 'PhD in Computer Science from Stanford, published researcher in natural language processing.',
      avatar: '👨‍🔬',
      linkedin: '#'
    },
    {
      name: 'Lisa Thompson',
      role: 'Head of Customer Success',
      bio: 'Customer experience expert with 8+ years helping companies scale their operations.',
      avatar: '👩‍💼',
      linkedin: '#'
    }
  ]

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We push the boundaries of what\'s possible with AI, constantly exploring new ways to solve complex problems.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Users,
      title: 'Customer Obsession',
      description: 'Every decision we make is driven by our commitment to delivering exceptional value to our customers.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'We build with security and privacy at the core, ensuring your data is always protected.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Heart,
      title: 'Inclusive Excellence',
      description: 'We believe diverse perspectives drive better solutions and create a more inclusive future.',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  const achievements = [
    {
      icon: Award,
      title: 'Best AI Platform 2024',
      description: 'TechCrunch Disrupt Winner',
      year: '2024'
    },
    {
      icon: Globe,
      title: 'Global Expansion',
      description: '50+ Countries Served',
      year: '2024'
    },
    {
      icon: Users,
      title: 'Customer Milestone',
      description: '10,000+ Active Users',
      year: '2024'
    },
    {
      icon: Zap,
      title: 'Series A Funding',
      description: '$25M Raised',
      year: '2023'
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
              Building the Future of
              <span className="text-primary block">AI Automation</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to democratize AI and make intelligent automation accessible to every business, 
              regardless of size or technical expertise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={() => navigate('/contact')}>
                Get in Touch
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                View Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                To empower every organization with intelligent AI agents that automate complex workflows, 
                enhance customer experiences, and drive unprecedented business growth.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that AI should be a force multiplier for human creativity and productivity, 
                not a replacement for human intelligence. Our platform bridges the gap between 
                cutting-edge AI capabilities and practical business applications.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A world where every business, from startups to enterprises, can harness the power of AI 
                to solve their unique challenges, improve efficiency, and create better experiences for their customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide everything we do and shape our company culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${value.bgColor} flex items-center justify-center mb-4`}>
                    <value.icon className={`w-6 h-6 ${value.color}`} />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Passionate experts from leading tech companies, united by our mission to democratize AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{member.avatar}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Achievements
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Milestones that mark our journey toward revolutionizing AI automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{achievement.title}</h3>
                <p className="text-muted-foreground mb-2">{achievement.description}</p>
                <span className="text-sm text-primary font-medium">{achievement.year}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Want to Join Our Mission?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            We're always looking for talented individuals who share our passion for AI and innovation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/contact')}>
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              View Careers
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
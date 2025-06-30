import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { BoltBadge } from '@/components/ui/BoltBadge'
import { 
  Zap, 
  Menu, 
  X,
  Twitter,
  Linkedin,
  Github,
  Globe
} from 'lucide-react'

interface LandingLayoutProps {
  children: React.ReactNode
}

export function LandingLayout({ children }: LandingLayoutProps) {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' }
  ]

  const socialLinks = [
    { icon: Twitter, name: 'Twitter', url: 'https://twitter.com/agentfloww' },
    { icon: Linkedin, name: 'LinkedIn', url: 'https://linkedin.com/company/agentfloww' },
    { icon: Github, name: 'GitHub', url: 'https://github.com/agentfloww' },
    { icon: Globe, name: 'Blog', url: '/blog' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">agentfloww</h1>
              </div>
              {/* Bolt Badge in Header */}
              <div className="ml-4">
                <BoltBadge />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/login')}>
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-white py-4">
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href)
                      setMobileMenuOpen(false)
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    {item.name}
                  </button>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                  <Button variant="ghost" onClick={() => navigate('/login')} className="justify-start">
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/login')} className="justify-start">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">agentfloww</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                The leading platform for building and deploying intelligent AI agents.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors"
                    title={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => navigate('/services')} className="hover:text-foreground transition-colors">Features</button></li>
                <li><button onClick={() => navigate('/templates')} className="hover:text-foreground transition-colors">Templates</button></li>
                <li><button onClick={() => navigate('/services')} className="hover:text-foreground transition-colors">Integrations</button></li>
                <li><button onClick={() => navigate('/services')} className="hover:text-foreground transition-colors">API</button></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => navigate('/about')} className="hover:text-foreground transition-colors">About</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-foreground transition-colors">Blog</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-foreground transition-colors">Careers</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-foreground transition-colors">Contact</button></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => navigate('/faq')} className="hover:text-foreground transition-colors">Documentation</button></li>
                <li><button onClick={() => navigate('/faq')} className="hover:text-foreground transition-colors">Help Center</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-foreground transition-colors">Community</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-foreground transition-colors">Status</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 agentfloww. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button 
                onClick={() => navigate('/privacy')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => navigate('/terms')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => navigate('/privacy')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
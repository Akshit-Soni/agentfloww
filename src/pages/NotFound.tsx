import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  Home, 
  ArrowLeft, 
  Search, 
  HelpCircle,
  Bot,
  Workflow,
  BookOpen
} from 'lucide-react'

export function NotFound() {
  const navigate = useNavigate()

  const quickLinks = [
    {
      title: 'Home',
      description: 'Go to the home page',
      icon: Home,
      action: () => navigate('/')
    },
    {
      title: 'Dashboard',
      description: 'Go to your dashboard',
      icon: Bot,
      action: () => navigate('/dashboard')
    },
    {
      title: 'Login',
      description: 'Sign in to your account',
      icon: Workflow,
      action: () => navigate('/login')
    },
    {
      title: 'Help Center',
      description: 'Find answers and support',
      icon: HelpCircle,
      action: () => navigate('/faq')
    }
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-primary/20 mb-4">404</div>
          <div className="relative">
            <Bot className="w-24 h-24 text-muted-foreground mx-auto opacity-50" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-muted-foreground">
            Don't worry, even our AI agents sometimes take wrong turns. 
            Let's get you back on track!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/')}>
            <Home className="w-5 h-5 mr-2" />
            Home Page
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Or try one of these popular pages:
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link, index) => (
              <Card key={index} className="border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={link.action}>
                <CardContent className="p-4 text-center">
                  <link.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">{link.title}</h3>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Search Suggestion */}
        <Card className="border-0 bg-muted/50">
          <CardContent className="p-6">
            <Search className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Still can't find what you're looking for?</h3>
            <p className="text-muted-foreground mb-4">
              Try searching our help center or contact our support team for assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/faq')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Search Help Center
              </Button>
              <Button variant="outline" onClick={() => navigate('/contact')}>
                <HelpCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
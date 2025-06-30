import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Github,
  Linkedin
} from 'lucide-react'

export function Contact() {
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addToast({
        type: 'success',
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We\'ll get back to you within 24 hours.'
      })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to send message. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'soniakshit15502@gmail.com',
      description: 'Send us an email anytime',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+91 9358841182',
      description: 'Mon-Fri from 8am to 6pm IST',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  const socialLinks = [
    { icon: Github, name: 'GitHub', url: 'https://github.com/Akshit-Soni/No-Code-Agent-Maker' },
    { icon: Linkedin, name: 'LinkedIn', url: 'https://www.linkedin.com/in/akshit-soni-627745232/' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Get in Touch
              <span className="text-primary block">We're Here to Help</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Have questions about our AI platform? Need help getting started? 
              Our team of experts is ready to assist you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the method that works best for you. We're committed to responding quickly and helpfully.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${info.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <info.icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <CardTitle className="text-xl">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-foreground mb-2">{info.details}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Inquiry Type</label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="press">Press & Media</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your inquiry"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    placeholder="Please provide details about your inquiry..."
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Office Locations & Hours */}
            <div className="space-y-8">
              {/* Office Locations */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Our Office</h3>
                <Card className="border shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-foreground">VIT Bhopal University</h4>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p>Kothri Kalan, Sehore</p>
                          <p>Madhya Pradesh, 466114</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <p>+91 9358841182</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <p>soniakshit15502@gmail.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Connect With Us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors"
                      title={social.name}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Find Us</h2>
            <p className="text-xl text-muted-foreground">
              Visit our office at VIT Bhopal University or connect with us virtually.
            </p>
          </div>

          {/* Mock Map */}
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive map would be integrated here</p>
              <p className="text-sm text-gray-500 mt-2">
                VIT Bhopal University<br />
                Kothri Kalan, Sehore, Madhya Pradesh, 466114
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
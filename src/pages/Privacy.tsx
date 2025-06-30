import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Globe, 
  Users,
  Mail,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react'

export function Privacy() {
  const lastUpdated = '2025-01-27'

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Database,
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect information you provide directly to us, such as when you create an account, use our services, or contact us. This may include your name, email address, company information, and payment details.'
        },
        {
          subtitle: 'Usage Information',
          text: 'We automatically collect information about how you use our services, including your interactions with AI agents, workflow executions, and platform features.'
        },
        {
          subtitle: 'Technical Information',
          text: 'We collect technical information such as your IP address, browser type, device information, and operating system to provide and improve our services.'
        }
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        {
          subtitle: 'Service Provision',
          text: 'We use your information to provide, maintain, and improve our AI agent platform, including processing your requests and providing customer support.'
        },
        {
          subtitle: 'Communication',
          text: 'We may use your contact information to send you service-related communications, updates about our platform, and respond to your inquiries.'
        },
        {
          subtitle: 'Analytics and Improvement',
          text: 'We analyze usage patterns to understand how our services are used and to improve functionality, performance, and user experience.'
        }
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      icon: Users,
      content: [
        {
          subtitle: 'Service Providers',
          text: 'We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, and customer support.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information if required by law, regulation, or legal process, or to protect the rights, property, or safety of agentfloww, our users, or others.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction, subject to appropriate confidentiality protections.'
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: [
        {
          subtitle: 'Encryption',
          text: 'We use industry-standard encryption to protect your data both in transit and at rest. All communications with our platform are secured using TLS encryption.'
        },
        {
          subtitle: 'Access Controls',
          text: 'We implement strict access controls and authentication measures to ensure that only authorized personnel can access your data.'
        },
        {
          subtitle: 'Security Monitoring',
          text: 'We continuously monitor our systems for security threats and vulnerabilities, and we regularly update our security measures to protect against new risks.'
        }
      ]
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: Calendar,
      content: [
        {
          subtitle: 'Retention Periods',
          text: 'We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements.'
        },
        {
          subtitle: 'Data Deletion',
          text: 'You may request deletion of your personal information at any time. We will delete your data within 30 days of your request, except where retention is required by law.'
        },
        {
          subtitle: 'Backup Data',
          text: 'Deleted data may remain in our backup systems for up to 90 days before being permanently removed from all systems.'
        }
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Rights and Choices',
      icon: Shield,
      content: [
        {
          subtitle: 'Access and Portability',
          text: 'You have the right to access your personal information and request a copy of your data in a portable format.'
        },
        {
          subtitle: 'Correction and Updates',
          text: 'You can update or correct your personal information through your account settings or by contacting our support team.'
        },
        {
          subtitle: 'Deletion and Restriction',
          text: 'You have the right to request deletion of your personal information or restriction of its processing, subject to certain legal limitations.'
        }
      ]
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      icon: Globe,
      content: [
        {
          subtitle: 'Global Operations',
          text: 'We operate globally and may transfer your information to countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.'
        },
        {
          subtitle: 'Adequacy Decisions',
          text: 'We transfer data to countries with adequacy decisions from relevant authorities or implement appropriate safeguards such as Standard Contractual Clauses.'
        },
        {
          subtitle: 'Data Processing Agreements',
          text: 'We enter into data processing agreements with our service providers to ensure your data is protected regardless of where it is processed.'
        }
      ]
    }
  ]

  const contactInfo = [
    {
      title: 'Data Protection Officer',
      email: 'privacy@agentfloww.com',
      description: 'For privacy-related inquiries and data protection matters'
    },
    {
      title: 'General Privacy Questions',
      email: 'legal@agentfloww.com',
      description: 'For general questions about this privacy policy'
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
              Privacy
              <span className="text-primary block">Policy</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              We are committed to protecting your privacy and ensuring the security of your personal information. 
              This policy explains how we collect, use, and safeguard your data.
            </p>
            
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last updated: {new Date(lastUpdated).toLocaleDateString()}
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <AlertCircle className="w-6 h-6 mr-3 text-primary" />
                Privacy Overview
              </CardTitle>
              <CardDescription className="text-base">
                Key points about how we handle your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Data Protection</h4>
                    <p className="text-sm text-muted-foreground">We use industry-standard encryption and security measures to protect your data.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Transparency</h4>
                    <p className="text-sm text-muted-foreground">We clearly explain what data we collect and how we use it.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Your Control</h4>
                    <p className="text-sm text-muted-foreground">You have full control over your data and can request access, updates, or deletion.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Compliance</h4>
                    <p className="text-sm text-muted-foreground">We comply with GDPR, CCPA, and other privacy regulations worldwide.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <Card key={section.id} className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <section.icon className="w-5 h-5 mr-3 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h4 className="font-semibold text-foreground mb-2">{item.subtitle}</h4>
                      <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Contact Us About Privacy</h2>
            <p className="text-xl text-muted-foreground">
              Have questions about this privacy policy or how we handle your data?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactInfo.map((contact, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{contact.title}</h3>
                  <p className="text-primary font-medium mb-2">{contact.email}</p>
                  <p className="text-sm text-muted-foreground">{contact.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="border-0 shadow-lg bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <FileText className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Need Our Data Processing Agreement?</h3>
                <p className="text-primary-foreground/90 text-sm mb-4">
                  Enterprise customers can request our Data Processing Agreement (DPA) for compliance purposes.
                </p>
                <a 
                  href="mailto:legal@agentfloww.com?subject=DPA Request"
                  className="inline-flex items-center text-sm font-medium hover:underline"
                >
                  Request DPA
                  <Mail className="w-4 h-4 ml-2" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Updates Notice */}
      <section className="py-12 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-primary-foreground mb-2">Policy Updates</h3>
          <p className="text-primary-foreground/90">
            We may update this privacy policy from time to time. We will notify you of any material changes 
            by email or through our platform. Your continued use of our services after such changes constitutes 
            acceptance of the updated policy.
          </p>
        </div>
      </section>
    </div>
  )
}
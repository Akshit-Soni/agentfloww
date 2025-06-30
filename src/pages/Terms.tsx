import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  FileText, 
  Scale, 
  Shield, 
  CreditCard, 
  AlertTriangle,
  Users,
  Globe,
  Calendar,
  Mail,
  Gavel
} from 'lucide-react'

export function Terms() {
  const lastUpdated = '2025-01-27'
  const effectiveDate = '2025-01-27'

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: FileText,
      content: [
        {
          text: 'By accessing or using the agentfloww platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.'
        },
        {
          text: 'These Terms apply to all visitors, users, and others who access or use the Service. By using our Service, you represent that you are at least 18 years old and have the legal capacity to enter into these Terms.'
        }
      ]
    },
    {
      id: 'service-description',
      title: 'Description of Service',
      icon: Globe,
      content: [
        {
          text: 'agentfloww provides a cloud-based platform for creating, deploying, and managing AI agents and automated workflows. Our Service includes web-based tools, APIs, integrations, and related documentation.'
        },
        {
          text: 'We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice to users. We may also impose limits on certain features or restrict access to parts of the Service.'
        }
      ]
    },
    {
      id: 'user-accounts',
      title: 'User Accounts and Registration',
      icon: Users,
      content: [
        {
          text: 'To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information as necessary.'
        },
        {
          text: 'You are responsible for safeguarding your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.'
        },
        {
          text: 'We reserve the right to suspend or terminate accounts that violate these Terms or are used for illegal or harmful activities.'
        }
      ]
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use Policy',
      icon: Shield,
      content: [
        {
          text: 'You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, overburden, or impair our servers or networks.'
        },
        {
          text: 'Prohibited activities include but are not limited to: violating laws or regulations, infringing intellectual property rights, transmitting malicious code, attempting to gain unauthorized access to systems, or using the Service to harass or harm others.'
        },
        {
          text: 'You may not use our Service to create AI agents that generate harmful, illegal, or inappropriate content, or that violate the rights of third parties.'
        }
      ]
    },
    {
      id: 'payment-terms',
      title: 'Payment and Billing',
      icon: CreditCard,
      content: [
        {
          text: 'Paid plans are billed in advance on a monthly or annual basis. All fees are non-refundable except as expressly stated in our refund policy.'
        },
        {
          text: 'You authorize us to charge your payment method for all fees owed. If payment fails, we may suspend your access to paid features until payment is resolved.'
        },
        {
          text: 'We may change our pricing with 30 days\' notice. Price changes will not affect your current billing cycle but will apply to subsequent renewals.'
        }
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      icon: Scale,
      content: [
        {
          text: 'The Service and its original content, features, and functionality are owned by agentfloww and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.'
        },
        {
          text: 'You retain ownership of any content you create using our Service. By using the Service, you grant us a limited license to use your content solely to provide and improve the Service.'
        },
        {
          text: 'You may not copy, modify, distribute, sell, or lease any part of our Service or included software, nor may you reverse engineer or attempt to extract the source code of that software.'
        }
      ]
    },
    {
      id: 'data-privacy',
      title: 'Data and Privacy',
      icon: Shield,
      content: [
        {
          text: 'Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service.'
        },
        {
          text: 'You are responsible for ensuring that any data you process through our Service complies with applicable data protection laws and regulations.'
        },
        {
          text: 'We implement appropriate technical and organizational measures to protect your data, but you acknowledge that no method of transmission over the internet is 100% secure.'
        }
      ]
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers and Limitations',
      icon: AlertTriangle,
      content: [
        {
          text: 'The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.'
        },
        {
          text: 'We do not warrant that the Service will be uninterrupted, error-free, or completely secure. You use the Service at your own risk.'
        },
        {
          text: 'To the maximum extent permitted by law, agentfloww shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities.'
        }
      ]
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: Gavel,
      content: [
        {
          text: 'You may terminate your account at any time by contacting our support team or through your account settings. Upon termination, your right to use the Service will cease immediately.'
        },
        {
          text: 'We may terminate or suspend your account immediately, without prior notice, if you breach these Terms or engage in conduct that we determine to be harmful to the Service or other users.'
        },
        {
          text: 'Upon termination, we will provide you with a reasonable opportunity to export your data, after which we may delete your account and associated data in accordance with our data retention policies.'
        }
      ]
    },
    {
      id: 'governing-law',
      title: 'Governing Law and Disputes',
      icon: Scale,
      content: [
        {
          text: 'These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.'
        },
        {
          text: 'Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.'
        },
        {
          text: 'You and agentfloww agree to waive any right to a jury trial or to participate in a class action lawsuit regarding any disputes related to the Service.'
        }
      ]
    }
  ]

  const keyPoints = [
    {
      icon: Users,
      title: 'Account Responsibility',
      description: 'You are responsible for your account security and all activities under your account.'
    },
    {
      icon: CreditCard,
      title: 'Billing Terms',
      description: 'Paid plans are billed in advance. All fees are non-refundable except as stated in our refund policy.'
    },
    {
      icon: Shield,
      title: 'Acceptable Use',
      description: 'Use our Service responsibly and in compliance with all applicable laws and regulations.'
    },
    {
      icon: Scale,
      title: 'Intellectual Property',
      description: 'You retain ownership of your content while granting us limited rights to provide the Service.'
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
              Terms of
              <span className="text-primary block">Service</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              These terms govern your use of the agentfloww platform. 
              Please read them carefully as they contain important information about your rights and obligations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Effective: {new Date(effectiveDate).toLocaleDateString()}
              </div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
                <FileText className="w-4 h-4 mr-2" />
                Last updated: {new Date(lastUpdated).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Points Overview */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Key Points</h2>
            <p className="text-xl text-muted-foreground">
              Important highlights from our Terms of Service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyPoints.map((point, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <point.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{point.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Terms */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <Card key={section.id} className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <section.icon className="w-5 h-5 mr-3 text-primary" />
                    {index + 1}. {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.content.map((item, itemIndex) => (
                    <p key={itemIndex} className="text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
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
            <h2 className="text-3xl font-bold text-foreground mb-4">Questions About These Terms?</h2>
            <p className="text-xl text-muted-foreground">
              Contact our legal team if you have any questions about these Terms of Service.
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-4">Legal Department</h3>
              <p className="text-muted-foreground mb-6">
                For questions about these Terms of Service, licensing, or legal matters
              </p>
              <div className="space-y-2">
                <p className="text-primary font-medium">legal@agentfloww.com</p>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 2-3 business days
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Updates Notice */}
      <section className="py-12 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-primary-foreground mb-2">Terms Updates</h3>
          <p className="text-primary-foreground/90">
            We may update these Terms of Service from time to time. We will notify you of any material changes 
            by email or through our platform at least 30 days before they take effect. Your continued use of 
            our Service after such changes constitutes acceptance of the updated Terms.
          </p>
        </div>
      </section>
    </div>
  )
}
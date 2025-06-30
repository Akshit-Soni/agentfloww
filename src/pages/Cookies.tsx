import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Cookie, 
  Shield, 
  Settings, 
  Clock, 
  Globe,
  Calendar,
  Mail,
  AlertCircle
} from 'lucide-react'

export function Cookies() {
  const lastUpdated = '2025-01-27'

  const cookieCategories = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      icon: Shield,
      description: 'These cookies are necessary for the website to function and cannot be switched off in our systems.',
      examples: [
        { name: 'session', purpose: 'Maintains your session state', duration: 'Session' },
        { name: 'csrf_token', purpose: 'Prevents cross-site request forgery attacks', duration: '1 hour' },
        { name: 'auth', purpose: 'Manages authentication state', duration: '30 days' }
      ],
      canDisable: false
    },
    {
      id: 'functional',
      title: 'Functional Cookies',
      icon: Settings,
      description: 'These cookies enable the website to provide enhanced functionality and personalization.',
      examples: [
        { name: 'preferences', purpose: 'Remembers your preferences and settings', duration: '90 days' },
        { name: 'language', purpose: 'Stores your preferred language', duration: '1 year' },
        { name: 'theme', purpose: 'Remembers your theme preference', duration: '1 year' }
      ],
      canDisable: true
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      icon: Clock,
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: [
        { name: '_ga', purpose: 'Google Analytics - Distinguishes users', duration: '2 years' },
        { name: '_gid', purpose: 'Google Analytics - Identifies user session', duration: '24 hours' },
        { name: '_gat', purpose: 'Google Analytics - Throttles request rate', duration: '1 minute' }
      ],
      canDisable: true
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      icon: Globe,
      description: 'These cookies are used to track visitors across websites to display relevant advertisements.',
      examples: [
        { name: '_fbp', purpose: 'Facebook Pixel - Identifies browsers for ad delivery', duration: '90 days' },
        { name: '_gcl_au', purpose: 'Google Adsense - Stores ad click information', duration: '90 days' },
        { name: 'IDE', purpose: 'DoubleClick - Used for targeted advertising', duration: '1 year' }
      ],
      canDisable: true
    }
  ]

  const thirdParties = [
    {
      name: 'Google Analytics',
      purpose: 'Web analytics service that tracks and reports website traffic',
      cookieNames: ['_ga', '_gid', '_gat'],
      privacyPolicy: 'https://policies.google.com/privacy'
    },
    {
      name: 'Facebook Pixel',
      purpose: 'Analytics tool that allows us to measure the effectiveness of our advertising',
      cookieNames: ['_fbp', 'fr'],
      privacyPolicy: 'https://www.facebook.com/policy.php'
    },
    {
      name: 'Intercom',
      purpose: 'Customer messaging platform for support and engagement',
      cookieNames: ['intercom-id-*', 'intercom-session-*'],
      privacyPolicy: 'https://www.intercom.com/legal/privacy'
    },
    {
      name: 'Stripe',
      purpose: 'Payment processing for subscriptions and transactions',
      cookieNames: ['__stripe_mid', '__stripe_sid'],
      privacyPolicy: 'https://stripe.com/privacy'
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
              Cookie
              <span className="text-primary block">Policy</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              This policy explains how we use cookies and similar technologies to recognize you when you visit our website.
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
                <Cookie className="w-6 h-6 mr-3 text-primary" />
                What Are Cookies?
              </CardTitle>
              <CardDescription className="text-base">
                Understanding how cookies work on our website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Cookies help us:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Remember your login details and preferences</li>
                <li>Understand how you use our website</li>
                <li>Improve your experience by personalizing our website</li>
                <li>Ensure the security of your account</li>
                <li>Provide you with relevant advertising</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We do not use cookies to collect personally identifiable information about you, 
                although we may combine information from your cookies with other personal information 
                you provide to us for the purposes outlined in our Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cookie Categories */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Types of Cookies We Use</h2>
            <p className="text-xl text-muted-foreground">
              We use different types of cookies for various purposes
            </p>
          </div>

          <div className="space-y-8">
            {cookieCategories.map((category) => (
              <Card key={category.id} className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <category.icon className="w-5 h-5 mr-3 text-primary" />
                    {category.title}
                    {!category.canDisable && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Required
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4 font-medium text-foreground">Name</th>
                          <th className="text-left py-2 px-4 font-medium text-foreground">Purpose</th>
                          <th className="text-left py-2 px-4 font-medium text-foreground">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.examples.map((cookie, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 px-4 text-sm font-mono">{cookie.name}</td>
                            <td className="py-2 px-4 text-sm text-muted-foreground">{cookie.purpose}</td>
                            <td className="py-2 px-4 text-sm text-muted-foreground">{cookie.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Third-Party Cookies */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Third-Party Cookies</h2>
            <p className="text-xl text-muted-foreground">
              Some cookies are placed by third-party services that appear on our pages
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  In addition to our own cookies, we may also use various third-party cookies to report usage statistics, 
                  deliver advertisements, and so on. These cookies may be placed when you visit our website or when you 
                  interact with certain features.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 font-medium text-foreground">Provider</th>
                        <th className="text-left py-2 px-4 font-medium text-foreground">Purpose</th>
                        <th className="text-left py-2 px-4 font-medium text-foreground">Cookie Names</th>
                        <th className="text-left py-2 px-4 font-medium text-foreground">Privacy Policy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {thirdParties.map((party, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4 font-medium">{party.name}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{party.purpose}</td>
                          <td className="py-3 px-4 text-sm font-mono">
                            {party.cookieNames.map((name, i) => (
                              <span key={i} className="block">{name}</span>
                            ))}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <a 
                              href={party.privacyPolicy} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              View Policy
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Managing Cookies */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Managing Your Cookies</h2>
            <p className="text-xl text-muted-foreground">
              How to control and delete cookies on your device
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Most web browsers allow you to control cookies through their settings preferences. 
                  However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, 
                  as it will no longer be personalized to you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Browser Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      You can manage cookies through your browser settings. Here are links to instructions for common browsers:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
                      <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
                      <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
                      <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Opt-Out Tools</h3>
                    <p className="text-sm text-muted-foreground">
                      You can also use these tools to opt out of certain types of cookies:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Digital Advertising Alliance</a></li>
                      <li><a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Network Advertising Initiative</a></li>
                      <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Your Online Choices (EU)</a></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">Important Note</h4>
                      <p className="text-sm text-yellow-700">
                        Please be aware that restricting cookies may impact the functionality of our website. 
                        Essential cookies cannot be disabled as they are necessary for the website to function properly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* GDPR Compliance */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">GDPR Compliance</h2>
            <p className="text-xl text-muted-foreground">
              How we comply with European data protection regulations
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  We are committed to complying with the General Data Protection Regulation (GDPR) and other applicable data protection laws. 
                  Our use of cookies complies with the ePrivacy Directive and GDPR in the following ways:
                </p>

                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Consent</h4>
                      <p className="text-sm text-muted-foreground">
                        We obtain your explicit consent before placing non-essential cookies on your device. 
                        You can withdraw your consent at any time through our cookie preferences tool.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Transparency</h4>
                      <p className="text-sm text-muted-foreground">
                        We provide clear and comprehensive information about the cookies we use, 
                        including their purpose, duration, and the third parties that may access them.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Data Subject Rights</h4>
                      <p className="text-sm text-muted-foreground">
                        We respect your rights under the GDPR, including the right to access, correct, delete, 
                        and object to the processing of your personal data collected through cookies.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Data Protection</h4>
                      <p className="text-sm text-muted-foreground">
                        We implement appropriate technical and organizational measures to protect the personal data 
                        collected through cookies against unauthorized access, alteration, or destruction.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Questions About Cookies?</h2>
            <p className="text-xl text-muted-foreground">
              Contact us if you have any questions about our cookie policy
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-4">Contact Our Privacy Team</h3>
              <p className="text-muted-foreground mb-6">
                If you have any questions about our use of cookies or this cookie policy, please contact us at:
              </p>
              <p className="text-primary font-medium text-lg mb-2">privacy@agentfloww.com</p>
              <p className="text-sm text-muted-foreground">
                We typically respond within 2-3 business days
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Updates Notice */}
      <section className="py-12 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-primary-foreground mb-2">Policy Updates</h3>
          <p className="text-primary-foreground/90">
            We may update this cookie policy from time to time to reflect changes in technology, regulation, or our business practices. 
            Any changes will be posted on this page with an updated revision date. We encourage you to periodically review this page 
            to stay informed about our use of cookies.
          </p>
        </div>
      </section>
    </div>
  )
}
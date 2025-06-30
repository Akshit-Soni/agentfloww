import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Zap,
  Mail,
  Bell
} from 'lucide-react'

export function Blog() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [email, setEmail] = useState('')

  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'ai-insights', name: 'AI Insights', count: 8 },
    { id: 'tutorials', name: 'Tutorials', count: 6 },
    { id: 'case-studies', name: 'Case Studies', count: 4 },
    { id: 'product-updates', name: 'Product Updates', count: 3 },
    { id: 'industry-news', name: 'Industry News', count: 3 }
  ]

  const featuredPost = {
    id: 1,
    title: 'The Future of AI Automation: Trends to Watch in 2025',
    excerpt: 'Explore the emerging trends in AI automation that will shape businesses in 2025 and beyond. From conversational AI to autonomous workflows.',
    content: 'As we move into 2025, artificial intelligence continues to revolutionize how businesses operate...',
    author: 'Dr. Sarah Chen',
    authorRole: 'Head of AI Research',
    authorAvatar: '👩‍🔬',
    publishedAt: '2025-01-25',
    readTime: '8 min read',
    category: 'AI Insights',
    tags: ['AI', 'Automation', 'Trends', 'Future'],
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true
  }

  const posts = [
    {
      id: 2,
      title: 'Building Your First AI Agent: A Step-by-Step Guide',
      excerpt: 'Learn how to create your first AI agent using agentfloww\'s visual workflow builder. Perfect for beginners.',
      author: 'Marcus Rodriguez',
      authorRole: 'Developer Advocate',
      authorAvatar: '👨‍💻',
      publishedAt: '2025-01-22',
      readTime: '12 min read',
      category: 'Tutorials',
      tags: ['Tutorial', 'Getting Started', 'AI Agents'],
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 3,
      title: 'How TechCorp Reduced Support Tickets by 80% with AI',
      excerpt: 'A detailed case study on how TechCorp implemented AI agents to transform their customer support operations.',
      author: 'Emily Watson',
      authorRole: 'Customer Success Manager',
      authorAvatar: '👩‍💼',
      publishedAt: '2025-01-20',
      readTime: '6 min read',
      category: 'Case Studies',
      tags: ['Case Study', 'Customer Support', 'ROI'],
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 4,
      title: 'New Features: Advanced Analytics and Custom Integrations',
      excerpt: 'Discover the latest features in agentfloww including enhanced analytics dashboard and custom API integrations.',
      author: 'Alex Chen',
      authorRole: 'Product Manager',
      authorAvatar: '👨‍💼',
      publishedAt: '2025-01-18',
      readTime: '4 min read',
      category: 'Product Updates',
      tags: ['Product Update', 'Analytics', 'Integrations'],
      image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 5,
      title: 'Understanding Natural Language Processing in AI Agents',
      excerpt: 'Deep dive into how NLP powers conversational AI and makes agents more intelligent and context-aware.',
      author: 'Dr. David Kim',
      authorRole: 'AI Researcher',
      authorAvatar: '👨‍🔬',
      publishedAt: '2025-01-15',
      readTime: '10 min read',
      category: 'AI Insights',
      tags: ['NLP', 'AI', 'Technology'],
      image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 6,
      title: 'AI Ethics: Building Responsible Automation Systems',
      excerpt: 'Exploring the ethical considerations and best practices for developing responsible AI automation systems.',
      author: 'Dr. Sarah Chen',
      authorRole: 'Head of AI Research',
      authorAvatar: '👩‍🔬',
      publishedAt: '2025-01-12',
      readTime: '7 min read',
      category: 'AI Insights',
      tags: ['Ethics', 'AI', 'Responsibility'],
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 7,
      title: 'Workflow Optimization: Best Practices for Maximum Efficiency',
      excerpt: 'Learn proven strategies to optimize your AI workflows for better performance and cost efficiency.',
      author: 'Lisa Thompson',
      authorRole: 'Solutions Architect',
      authorAvatar: '👩‍💼',
      publishedAt: '2025-01-10',
      readTime: '9 min read',
      category: 'Tutorials',
      tags: ['Optimization', 'Best Practices', 'Efficiency'],
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ]

  const recentPosts = posts.slice(0, 5)

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || post.category.toLowerCase().replace(' ', '-') === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              AI Insights & 
              <span className="text-primary block">Industry News</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Stay updated with the latest trends, tutorials, and insights in AI automation. 
              Learn from experts and discover how to maximize your AI implementations.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Article</h2>
          </div>

          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="outline">{featuredPost.category}</Badge>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{featuredPost.readTime}</span>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  {featuredPost.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{featuredPost.authorAvatar}</div>
                    <div>
                      <p className="font-medium text-foreground">{featuredPost.author}</p>
                      <p className="text-sm text-muted-foreground">{featuredPost.authorRole}</p>
                    </div>
                  </div>
                  
                  <Button>
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{category.name}</span>
                          <span className="text-xs opacity-75">({category.count})</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Recent Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                        <h4 className="font-medium text-sm leading-tight mb-2 hover:text-primary cursor-pointer">
                          {post.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    Stay Updated
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Get the latest AI insights delivered to your inbox
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNewsletterSignup} className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-primary-foreground text-foreground"
                      required
                    />
                    <Button 
                      type="submit" 
                      variant="secondary" 
                      className="w-full"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Subscribe
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Articles Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedCategory === 'all' ? 'All Articles' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-muted-foreground">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-3 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="text-lg">{post.authorAvatar}</div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{post.author}</p>
                            <p className="text-xs text-muted-foreground">{post.authorRole}</p>
                          </div>
                        </div>
                        
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              {filteredPosts.length > 0 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Articles
                  </Button>
                </div>
              )}

              {/* No Results */}
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, User, Clock, FileText, ArrowUpRight } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';
import ContentCard, { ContentItem } from '@/components/ContentCard';
import GlobalCTA from '@/components/GlobalCTA';
import LivestreamPlayer from '@/components/LivestreamPlayer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for demonstration
const recentContent: ContentItem[] = [
  {
    id: '1',
    title: 'Crypto Market Analysis - August Edition',
    description: 'Detailed analysis of the current crypto market trends and predictions for the coming month.',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop',
    date: 'Aug 15, 2023',
    duration: '45:22',
    views: 4500,
    brand: 'InsiderLife',
    tags: ['crypto', 'market analysis', 'bitcoin'],
    url: '#'
  },
  {
    id: '2',
    title: 'Tokenomics Fundamentals Guide',
    description: 'A comprehensive guide to understanding the basics of tokenomics and how it affects project valuation.',
    type: 'document',
    thumbnail: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop',
    date: 'July 28, 2023',
    brand: 'Tokenomix',
    tags: ['tokenomics', 'guide', 'fundamentals'],
    url: '#'
  },
  {
    id: '3',
    title: 'InsiderDAO Governance Framework',
    description: 'Learn how InsiderDAO governance works and how you can participate in community decision making.',
    type: 'article',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop',
    date: 'Aug 10, 2023',
    views: 3200,
    brand: 'InsiderDAO',
    tags: ['dao', 'governance', 'crypto'],
    url: '#'
  },
  {
    id: '4',
    title: 'Weekly Insider Live Market Update',
    description: 'Our weekly live session covering market updates, current trends, and trading opportunities.',
    type: 'livestream',
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=2940&auto=format&fit=crop',
    date: 'Aug 18, 2023',
    duration: '1:20:00',
    views: 2100,
    brand: 'InsiderLife',
    tags: ['livestream', 'market update', 'trading'],
    url: '#'
  }
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContent: 0,
    activeUsers: 0,
    livehours: 0,
    documents: 0
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate stats data
      setStats({
        totalContent: 458,
        activeUsers: 12547,
        livehours: 324,
        documents: 156
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <AnimatedTransition>
          <div className="container mx-auto px-4 sm:px-6">
            {/* Hero Section */}
            <section className="relative mb-16">
              <div className="hero-gradient absolute inset-0 rounded-2xl"></div>
              <div className="relative glass-card rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="flex flex-col lg:flex-row">
                  <div className="p-8 md:p-12 lg:w-1/2 flex flex-col justify-center">
                    <div className="inline-flex items-center px-3 py-1 mb-6 text-xs font-medium rounded-full bg-insider-100 dark:bg-insider-800 text-insider-700 dark:text-insider-300">
                      InsiderLife CMS
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                      Centralized Content Management
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                      Manage and distribute content across all InsiderLife properties with a powerful, AI-ready content management system.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/content">
                        <button className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-insider-600 rounded-lg hover:bg-insider-700 transition-colors">
                          Browse Content
                          <ArrowRight size={18} className="ml-2" />
                        </button>
                      </Link>
                      <Link to="/live">
                        <button className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-insider-700 dark:text-insider-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          View Live Events
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="lg:w-1/2 overflow-hidden">
                    {isLoading ? (
                      <div className="w-full h-full aspect-video bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                    ) : (
                      <LivestreamPlayer 
                        videoSrc="https://player.vimeo.com/external/444482736.hd.mp4?s=d5e9ed9ea40ba755e28512cce6c1ad00d92a0d14&profile_id=174"
                        poster="https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=1964&auto=format&fit=crop"
                        title="InsiderLife Platform Overview"
                        isLive={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>
            
            {/* Stats Cards */}
            <section className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="mr-4 p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <BarChart2 size={18} />
                      </div>
                      {isLoading ? (
                        <div className="h-9 w-20 rounded loading-shimmer"></div>
                      ) : (
                        <div className="text-3xl font-bold">{stats.totalContent}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="mr-4 p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        <User size={18} />
                      </div>
                      {isLoading ? (
                        <div className="h-9 w-20 rounded loading-shimmer"></div>
                      ) : (
                        <div className="text-3xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Live Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="mr-4 p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                        <Clock size={18} />
                      </div>
                      {isLoading ? (
                        <div className="h-9 w-20 rounded loading-shimmer"></div>
                      ) : (
                        <div className="text-3xl font-bold">{stats.livehours}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="mr-4 p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                        <FileText size={18} />
                      </div>
                      {isLoading ? (
                        <div className="h-9 w-20 rounded loading-shimmer"></div>
                      ) : (
                        <div className="text-3xl font-bold">{stats.documents}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            {/* Recent Content Section */}
            <section className="mb-16">
              <div className="mb-8 flex justify-between items-center">
                <h2 className="section-title">Recent Content</h2>
                <Link to="/content" className="flex items-center text-insider-600 hover:text-insider-700 dark:text-insider-400 dark:hover:text-insider-300 font-medium text-sm">
                  View All Content
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="aspect-[3/4] rounded-lg loading-shimmer"></div>
                  ))
                ) : (
                  recentContent.map(content => (
                    <ContentCard key={content.id} item={content} />
                  ))
                )}
              </div>
            </section>
            
            {/* Featured Content */}
            <section className="mb-16">
              <h2 className="section-title mb-8">Featured Content</h2>
              
              {isLoading ? (
                <div className="aspect-[16/7] rounded-lg loading-shimmer"></div>
              ) : (
                <ContentCard 
                  item={recentContent[0]} 
                  layout="featured" 
                />
              )}
            </section>
            
            {/* Brand Integration */}
            <section className="mb-16">
              <h2 className="section-title mb-8">Brand Integration</h2>
              
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="p-8 md:p-10">
                  <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    <div className="lg:w-1/2">
                      <div className="inline-flex items-center px-3 py-1 mb-4 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                        Multi-Brand Ecosystem
                      </div>
                      <h3 className="text-2xl font-semibold mb-4">
                        Power Multiple Properties from a Single Source
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        InsiderLife CMS enables seamless content distribution across all your brand properties. Tag content for specific brands and deliver cohesive experiences everywhere.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-insider-600"></div>
                          <span>InsiderLife</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                          <span>Tokenomix</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                          <span>InsiderDAO</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:w-1/2 flex justify-center">
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-insider-500 to-blue-500 rounded-lg blur opacity-30 animate-pulse-soft"></div>
                        <div className="relative grid grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="glass-card rounded-lg p-4 flex items-center space-x-3 hover:shadow-md transition-shadow">
                            <div className="w-3 h-3 rounded-full bg-insider-600"></div>
                            <span className="font-medium">InsiderLife.com</span>
                            <ArrowUpRight size={14} className="ml-auto text-gray-400" />
                          </div>
                          <div className="glass-card rounded-lg p-4 flex items-center space-x-3 hover:shadow-md transition-shadow">
                            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                            <span className="font-medium">Tokenomix.io</span>
                            <ArrowUpRight size={14} className="ml-auto text-gray-400" />
                          </div>
                          <div className="glass-card rounded-lg p-4 flex items-center space-x-3 hover:shadow-md transition-shadow">
                            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                            <span className="font-medium">InsiderDAO.com</span>
                            <ArrowUpRight size={14} className="ml-auto text-gray-400" />
                          </div>
                          <div className="glass-card rounded-lg p-4 flex items-center space-x-3 hover:shadow-md transition-shadow">
                            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                            <span className="font-medium">Future Brands</span>
                            <ArrowUpRight size={14} className="ml-auto text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* CTA Section */}
            <section>
              <GlobalCTA 
                id="dashboard-main"
                title="Ready to join InsiderLife Premium?"
                description="Get exclusive access to premium content, live events, and community features."
                buttonText="Upgrade Now"
                buttonUrl="#"
                type="inline"
                theme="primary"
              />
            </section>
          </div>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default Index;

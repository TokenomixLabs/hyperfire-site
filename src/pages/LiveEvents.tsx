import { useState, useEffect } from 'react';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import ContentCard, { ContentItem } from '@/components/content-card';
import LivestreamPlayer from '@/components/LivestreamPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import GlobalCTA from '@/components/GlobalCTA';

// Mock data for demonstration
const liveEvents: ContentItem[] = [
  {
    id: '1',
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
  },
  {
    id: '2',
    title: 'InsiderDAO Town Hall Meeting',
    description: 'Monthly town hall meeting discussing governance proposals and community initiatives.',
    type: 'livestream',
    thumbnail: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?q=80&w=2940&auto=format&fit=crop',
    date: 'Aug 20, 2023',
    duration: '1:15:00',
    views: 1800,
    brand: 'InsiderDAO',
    tags: ['dao', 'governance', 'community'],
    url: '#'
  },
];

const upcomingEvents = [
  {
    id: '1',
    title: 'AI Agent Development Workshop',
    description: 'Learn how to build and deploy AI agents for crypto trading and analysis.',
    date: 'September 5, 2023',
    time: '2:00 PM UTC',
    duration: '1.5 hours',
    host: 'John Smith',
    participants: 156,
    brand: 'InsiderLife',
    tags: ['workshop', 'ai', 'crypto trading'],
    isFeatured: true
  },
  {
    id: '2',
    title: 'Tokenomics Deep Dive: Sustainable Token Models',
    description: 'Exploring sustainable token models for long-term project success.',
    date: 'September 8, 2023',
    time: '3:30 PM UTC',
    duration: '2 hours',
    host: 'Sarah Johnson',
    participants: 108,
    brand: 'Tokenomix',
    tags: ['tokenomics', 'sustainability', 'token design'],
    isFeatured: false
  },
  {
    id: '3',
    title: 'InsiderDAO Governance Proposal Review',
    description: 'Reviewing and discussing new governance proposals for community voting.',
    date: 'September 12, 2023',
    time: '6:00 PM UTC',
    duration: '1 hour',
    host: 'Michael Chen',
    participants: 87,
    brand: 'InsiderDAO',
    tags: ['dao', 'governance', 'voting'],
    isFeatured: false
  },
  {
    id: '4',
    title: 'Crypto Market Outlook: Q4 2023',
    description: 'Analyzing market trends and making predictions for the final quarter of 2023.',
    date: 'September 15, 2023',
    time: '4:00 PM UTC',
    duration: '2 hours',
    host: 'Alex Williams',
    participants: 189,
    brand: 'InsiderLife',
    tags: ['market analysis', 'predictions', 'trends'],
    isFeatured: true
  }
];

const pastEvents: ContentItem[] = [
  {
    id: '3',
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
    id: '4',
    title: 'Understanding DeFi Liquidity Pools',
    description: 'Deep dive into DeFi liquidity pools, impermanent loss, and yield farming strategies.',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=2924&auto=format&fit=crop',
    date: 'Aug 5, 2023',
    duration: '38:15',
    views: 3800,
    brand: 'Tokenomix',
    tags: ['defi', 'liquidity', 'yield farming'],
    url: '#'
  },
  {
    id: '5',
    title: 'NFT Market Opportunities',
    description: 'Exploring the evolving NFT landscape and identifying new market opportunities.',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1646483236548-3f0374822fdd?q=80&w=2832&auto=format&fit=crop',
    date: 'Aug 12, 2023',
    duration: '52:30',
    views: 2900,
    brand: 'InsiderLife',
    tags: ['nft', 'opportunities', 'digital art'],
    url: '#'
  },
  {
    id: '6',
    title: 'Tokenomix Launch Event',
    description: 'Official launch event for the Tokenomix platform with special guests and announcements.',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1550565118-3a14e8d0386f?q=80&w=2940&auto=format&fit=crop',
    date: 'July 28, 2023',
    duration: '1:15:45',
    views: 5200,
    brand: 'Tokenomix',
    tags: ['launch', 'announcement', 'platform'],
    url: '#'
  }
];

const LiveEvents = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredEvent, setFeaturedEvent] = useState(liveEvents[0]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'insiderlife':
        return 'bg-insider-600 text-white';
      case 'tokenomix':
        return 'bg-blue-600 text-white';
      case 'insiderdao':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <AnimatedTransition>
          <div className="container mx-auto px-4 sm:px-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Live Events</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Watch live streams and upcoming events across all InsiderLife properties
              </p>
            </div>
            
            {/* Live Now Section */}
            <section className="mb-16">
              <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 mr-3">
                    <span className="animate-pulse h-3 w-3 rounded-full bg-white"></span>
                  </div>
                  <h2 className="text-2xl font-semibold">Live Now</h2>
                </div>
              </div>
              
              {isLoading ? (
                <div className="aspect-video w-full rounded-lg loading-shimmer"></div>
              ) : liveEvents.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <LivestreamPlayer 
                      videoSrc="https://player.vimeo.com/external/444482736.hd.mp4?s=d5e9ed9ea40ba755e28512cce6c1ad00d92a0d14&profile_id=174"
                      poster={featuredEvent.thumbnail}
                      title={featuredEvent.title}
                      isLive={true}
                      autoPlay={true}
                    />
                  </div>
                  <div className="glass-card rounded-lg p-6 flex flex-col">
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="default" className={getBrandColor(featuredEvent.brand)}>
                          {featuredEvent.brand}
                        </Badge>
                        <Badge variant="outline" className="bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>
                          Live
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{featuredEvent.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {featuredEvent.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {featuredEvent.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <Separator className="mb-4" />
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Calendar size={16} className="mr-2" />
                        {featuredEvent.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <Clock size={16} className="mr-2" />
                        {featuredEvent.duration}
                      </div>
                      
                      {liveEvents.length > 1 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Also Live:</h4>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => setFeaturedEvent(liveEvents.find(e => e.id !== featuredEvent.id) || liveEvents[0])}
                          >
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse mr-3"></div>
                            <span className="truncate">
                              {liveEvents.find(e => e.id !== featuredEvent.id)?.title}
                            </span>
                          </Button>
                        </div>
                      )}
                      
                      <Button className="w-full">
                        Join the Discussion
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-lg p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">There are no live events at the moment.</p>
                  <p className="mb-4">Check the upcoming events below or browse our past recordings.</p>
                  <Button>View Upcoming Events</Button>
                </div>
              )}
            </section>
            
            {/* Upcoming Events Section */}
            <section className="mb-16">
              <div className="mb-8 flex justify-between items-center">
                <h2 className="section-title">Upcoming Events</h2>
                <Button variant="outline" className="text-insider-600 hover:text-insider-700 dark:text-insider-400 dark:hover:text-insider-300">
                  View Calendar
                </Button>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Array(2).fill(0).map((_, i) => (
                    <div key={i} className="h-48 rounded-lg loading-shimmer"></div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Featured Upcoming Events */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {upcomingEvents
                      .filter(event => event.isFeatured)
                      .map(event => (
                        <div 
                          key={event.id} 
                          className="glass-card rounded-lg p-6 flex flex-col border border-gray-200 dark:border-gray-800 group hover:shadow-lg transition-shadow"
                        >
                          <div className="mb-6">
                            <div className="flex items-center space-x-2 mb-3">
                              <Badge variant="default" className={getBrandColor(event.brand)}>
                                {event.brand}
                              </Badge>
                              <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50">
                                Featured
                              </Badge>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              {event.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {event.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-auto">
                            <Separator className="mb-4" />
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</span>
                                <div className="flex items-center">
                                  <Calendar size={16} className="mr-2 text-gray-400" />
                                  <span>{event.date}</span>
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time</span>
                                <div className="flex items-center">
                                  <Clock size={16} className="mr-2 text-gray-400" />
                                  <span>{event.time}</span>
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</span>
                                <span>{event.duration}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Host</span>
                                <span>{event.host}</span>
                              </div>
                            </div>
                            <Button className="w-full group-hover:bg-insider-700 transition-colors">
                              Set Reminder
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                
                  {/* Other Upcoming Events */}
                  <div className="glass-card rounded-lg overflow-hidden">
                    <div className="grid divide-y divide-gray-200 dark:divide-gray-800">
                      {upcomingEvents
                        .filter(event => !event.isFeatured)
                        .map(event => (
                          <div 
                            key={event.id} 
                            className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                          >
                            <div className="md:col-span-2 flex flex-col">
                              <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date & Time</span>
                              <div className="flex items-center mb-1">
                                <Calendar size={16} className="mr-2 text-gray-400" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock size={16} className="mr-2 text-gray-400" />
                                <span>{event.time}</span>
                              </div>
                            </div>
                            
                            <div className="md:col-span-7">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="default" className={getBrandColor(event.brand)}>
                                  {event.brand}
                                </Badge>
                              </div>
                              <h3 className="font-semibold mb-2">{event.title}</h3>
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                {event.description}
                              </p>
                              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>Host: {event.host}</span>
                                <span>•</span>
                                <span className="flex items-center">
                                  <Users size={14} className="mr-1" />
                                  {event.participants} registered
                                </span>
                              </div>
                            </div>
                            
                            <div className="md:col-span-3 flex items-center">
                              <Button className="w-full">
                                Register Now
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </section>
            
            {/* Past Events Section */}
            <section className="mb-16">
              <div className="mb-8 flex justify-between items-center">
                <h2 className="section-title">Past Events</h2>
                <Button 
                  variant="outline" 
                  className="text-insider-600 hover:text-insider-700 dark:text-insider-400 dark:hover:text-insider-300"
                  asChild
                >
                  <a href="/content" className="flex items-center">
                    View All
                    <ArrowRight size={16} className="ml-2" />
                  </a>
                </Button>
              </div>
              
              <Tabs defaultValue="all">
                <TabsList className="glass-card mb-6">
                  <TabsTrigger value="all">All Brands</TabsTrigger>
                  <TabsTrigger value="insiderlife">InsiderLife</TabsTrigger>
                  <TabsTrigger value="tokenomix">Tokenomix</TabsTrigger>
                  <TabsTrigger value="insiderdao">InsiderDAO</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="aspect-video rounded-lg loading-shimmer"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {pastEvents.map(event => (
                        <ContentCard 
                          key={event.id} 
                          item={event} 
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="insiderlife">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Array(2).fill(0).map((_, i) => (
                        <div key={i} className="aspect-video rounded-lg loading-shimmer"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {pastEvents
                        .filter(event => event.brand.toLowerCase() === 'insiderlife')
                        .map(event => (
                          <ContentCard 
                            key={event.id} 
                            item={event} 
                          />
                        ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="tokenomix">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Array(2).fill(0).map((_, i) => (
                        <div key={i} className="aspect-video rounded-lg loading-shimmer"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {pastEvents
                        .filter(event => event.brand.toLowerCase() === 'tokenomix')
                        .map(event => (
                          <ContentCard 
                            key={event.id} 
                            item={event} 
                          />
                        ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="insiderdao">
                  <div className="py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No past events found for InsiderDAO.</p>
                    <p className="mb-6">Check out upcoming InsiderDAO events or browse other brands.</p>
                    <Button>View Upcoming Events</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </section>
            
            {/* CTA Section */}
            <section className="mt-16">
              <GlobalCTA 
                id="live-events-footer"
                title="Never Miss a Live Event"
                description="Subscribe to notifications and stay updated on all InsiderLife events."
                buttonText="Subscribe to Notifications"
                buttonUrl="#"
                type="banner"
                theme="primary"
                position="bottom"
              />
            </section>
          </div>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default LiveEvents;

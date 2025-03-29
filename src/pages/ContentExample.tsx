
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ContentCTA } from '@/types/referral';
import ContentCTAContainer from '@/components/content/ContentCTAContainer';
import AnimatedTransition from '@/components/AnimatedTransition';
import { ReferralProvider } from '@/context/ReferralContext';

// Mock content data
const mockContent = {
  id: "article-123",
  title: "The Future of Cryptocurrency Trading",
  content: `
  # The Future of Cryptocurrency Trading

  Cryptocurrency trading has evolved significantly over the past decade. What started as a niche activity has now become mainstream, with millions of traders worldwide participating in crypto markets daily.

  ## Market Evolution

  The cryptocurrency market has matured in many ways:
  - Increased institutional adoption
  - Better regulatory frameworks
  - More sophisticated trading tools
  - Deeper liquidity pools
  - Advanced derivative products

  However, challenges remain, including volatility, security concerns, and the need for better education among retail traders.

  ## Technology Advancements

  New technologies are constantly reshaping how people trade cryptocurrencies:
  
  - AI-powered trading tools that analyze market sentiment
  - Decentralized exchanges with better security features
  - Layer-2 solutions reducing transaction costs
  - Cross-chain bridges enabling interoperability

  These technologies are making trading more accessible and efficient than ever before.

  ## Community-Driven Strategies

  One of the most interesting developments has been the rise of community-driven trading strategies. Groups like InsiderDAO are creating collaborative environments where traders share insights, strategies, and signals.

  This "wisdom of the crowd" approach has proven remarkably effective, particularly in volatile market conditions.

  ## Learning Path for New Traders

  If you're new to cryptocurrency trading, the learning curve can seem steep. Here's a simplified path to get started:

  1. Understand blockchain fundamentals
  2. Learn market analysis techniques
  3. Practice with small amounts
  4. Join supportive communities
  5. Develop a risk management strategy

  The most successful traders are those who continuously educate themselves and adapt to changing market conditions.
  `,
  author: "Alex Thompson",
  publishedDate: "2023-07-15",
  tags: ["cryptocurrency", "trading", "blockchain", "investing"],
  // Content-specific CTAs with proper types
  ctas: [
    {
      id: "content-cta-1",
      contentId: "article-123",
      campaignId: "insiderdao",
      buttonText: "Join InsiderDAO Trading Community",
      description: "Get access to exclusive trading signals and strategies",
      theme: "primary" as const,
      placement: "card" as const,
      position: "bottom" as const
    },
    {
      id: "content-cta-2",
      contentId: "article-123",
      campaignId: "aifc",
      buttonText: "Learn AI Trading Strategies",
      description: "Master AI-powered trading with our comprehensive course",
      theme: "default" as const,
      placement: "inline" as const,
      position: "bottom" as const
    }
  ]
};

const ContentExample = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const [content, setContent] = useState(mockContent);
  const [contentCTAs, setContentCTAs] = useState<ContentCTA[]>([]);

  useEffect(() => {
    // In a real app, fetch content based on contentId
    console.log(`Loading content with ID: ${contentId || 'default'}`);
    
    // Use mock data for this example
    setContent(mockContent);
    
    // Explicitly cast to ContentCTA[] to ensure type safety
    setContentCTAs(mockContent.ctas as ContentCTA[]);
  }, [contentId]);

  return (
    <ReferralProvider>
      <AnimatedTransition className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
            <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span>By {content.author}</span>
              <span className="mx-2">•</span>
              <span>{new Date(content.publishedDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                {content.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{paragraph.replace('# ', '')}</h1>;
                  } else if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{paragraph.replace('## ', '')}</h2>;
                  } else if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').filter(item => item.startsWith('- '));
                    return (
                      <ul key={index} className="list-disc pl-5 my-4">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  } else if (paragraph.startsWith('1. ')) {
                    const items = paragraph.split('\n').filter(item => /^\d+\.\s/.test(item));
                    return (
                      <ol key={index} className="list-decimal pl-5 my-4">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item.replace(/^\d+\.\s/, '')}</li>
                        ))}
                      </ol>
                    );
                  } else if (paragraph.trim() !== '') {
                    return <p key={index} className="my-4">{paragraph}</p>;
                  }
                  return null;
                })}
              </div>
              
              {/* Content CTAs */}
              <ContentCTAContainer 
                contentTitle={content.title}
                contentCTAs={contentCTAs}
              />
            </CardContent>
          </Card>
        </div>
      </AnimatedTransition>
    </ReferralProvider>
  );
};

export default ContentExample;

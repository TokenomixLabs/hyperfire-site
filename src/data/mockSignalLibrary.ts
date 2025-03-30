
import { SignalLibraryItem } from '@/types/signalLibrary';

// Mock data for the signal library
export const mockSignalLibrary: SignalLibraryItem[] = [
  {
    id: "signal-1",
    name: "AI Freedom Roadmap",
    slug: "ai-freedom-roadmap",
    description: "Master AI tools and build your freedom business in 5 simple steps",
    contentType: "mixed",
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featuredImageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    createdBy: "admin",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    updatedAt: new Date().toISOString(),
    published: true,
    steps: [
      {
        id: "step-1",
        title: "Understanding AI Tools for Business",
        content: "# AI Tools For Your Freedom Business\n\nIn this first step, we'll explore the fundamentals of AI tools and how they can revolutionize your business operations.\n\n## Key AI Categories to Know\n\n- Content Creation: Tools that generate text, images, and videos\n- Data Analysis: AI systems that process and interpret large datasets\n- Customer Interaction: Chatbots and virtual assistants\n- Process Automation: Systems that handle repetitive tasks\n\n## Why AI Matters for Freedom Seekers\n\nLeveraging AI tools allows you to:\n\n1. Accomplish more with less human resources\n2. Scale your business without proportionally scaling work hours\n3. Focus on high-value creative tasks while automating the mundane\n4. Create a location-independent business that works for you",
        videoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 0,
        ctas: [
          {
            id: "cta-1",
            contentId: "step-1",
            campaignId: "aifc",
            buttonText: "Join AI Freedom Code",
            description: "Get access to our complete AI toolkit and training library",
            theme: "primary",
            placement: "banner",
            position: "bottom"
          }
        ]
      },
      {
        id: "step-2",
        title: "Setting Up Your AI Tech Stack",
        content: "# Building Your AI Tech Stack\n\nNow that you understand the power of AI, it's time to set up your optimal tech stack.\n\n## Essential AI Tools for Every Business\n\n- Content Generation: GPT-4 for writing, MidJourney for images\n- Automation: Zapier or Make.com with AI integrations\n- Research: Perplexity AI or similar research assistants\n- Community Management: AI-enhanced community platforms\n\n## How to Choose the Right Tools\n\nConsider these factors when building your stack:\n\n1. Your specific business model and needs\n2. Budget constraints vs. time savings\n3. Learning curve and integration capabilities\n4. Scalability as your business grows",
        mediaUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        order: 1,
        ctas: []
      },
      {
        id: "step-3",
        title: "Creating Systems for AI Implementation",
        content: "# Systems Thinking for AI Integration\n\nThe key to leveraging AI effectively is to build proper systems around these powerful tools.\n\n## The System Components\n\n- Input Optimization: Learning to craft effective prompts\n- Output Processing: Methods to refine and enhance AI outputs\n- Quality Control: Human oversight and verification processes\n- Continuous Improvement: Feedback loops and iterative enhancement\n\n## Building Your First AI System\n\nFollow these steps to create your first operational AI system:\n\n1. Identify a repetitive, time-consuming task in your business\n2. Map the current process and decision points\n3. Determine which parts can be automated with AI\n4. Create prompt templates and verification checkpoints\n5. Test, measure results, and refine",
        order: 2,
        ctas: [
          {
            id: "cta-2",
            contentId: "step-3",
            campaignId: "insiderlife",
            buttonText: "Get Our AI Prompt Library",
            description: "Download our collection of 100+ effective AI prompts for business",
            theme: "primary",
            placement: "inline",
            position: "top"
          }
        ]
      },
      {
        id: "step-4",
        title: "Monetizing Your AI Skills",
        content: "# Turning AI Skills Into Income\n\nWith your AI knowledge and systems in place, it's time to monetize these valuable skills.\n\n## Business Models Amplified by AI\n\n- Digital Product Creation: Use AI to create and enhance products\n- Service Delivery: Leverage AI to deliver premium services efficiently\n- Agency Model: Offer AI implementation as a service to other businesses\n- Education: Teach others how to use AI effectively\n\n## Case Study: The AI Freedom Business\n\nHere's how one entrepreneur built a 6-figure business using AI tools:\n\n1. Created an AI-enhanced content creation agency\n2. Used AI to handle 80% of content production\n3. Employed human editors for quality control and personalization\n4. Scaled to serve 50+ clients with a small team\n5. Achieved location independence and time freedom",
        videoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 3,
        ctas: [
          {
            id: "cta-3",
            contentId: "step-4",
            campaignId: "insiderdao",
            buttonText: "Join Our AI Business Mastermind",
            description: "Connect with other AI-powered entrepreneurs in our private community",
            theme: "primary",
            placement: "banner",
            position: "bottom"
          }
        ]
      },
      {
        id: "step-5",
        title: "Scaling Your AI Freedom Business",
        content: "# Scaling With AI Power\n\nThe final step is to scale your business using AI as a force multiplier.\n\n## Scaling Principles for AI Businesses\n\n- Automation First: Continuously identify new automation opportunities\n- Front-Loading Work: Create systems that require decreasing human input over time\n- Vertical Integration: Use AI to expand into complementary offerings\n- Team Augmentation: Train team members to become AI power users\n\n## Your 90-Day Scaling Plan\n\nImplement this 90-day plan to scale your AI-powered business:\n\n1. Days 1-30: Audit current processes and identify next-level automation opportunities\n2. Days 31-60: Build advanced prompt libraries and documentation for team use\n3. Days 61-90: Train team members and implement new AI-enhanced workflows\n\nBy the end of this period, you should see significant increases in output capacity while maintaining or reducing human hours required.",
        mediaUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        order: 4,
        ctas: [
          {
            id: "cta-4",
            contentId: "step-5",
            campaignId: "aifc",
            buttonText: "Apply for AI Freedom Code",
            description: "Take your AI skills to the next level with our comprehensive program",
            theme: "primary",
            placement: "banner",
            position: "bottom"
          }
        ]
      }
    ],
    isDuplicated: false,
    tags: ["AI", "Business", "Freedom"],
    duplicationsCount: 78,
    featured: true,
    aiSummary: {
      summary: "A comprehensive guide to leveraging AI tools for your freedom business.",
      guardianAware: true,
      guardianCommentary: "This series is essential for anyone looking to start in the AI space."
    },
    stats: {
      views: 1456,
      ctaClicks: 328,
      conversions: 42,
      shares: 86
    }
  },
  {
    id: "signal-2",
    name: "Crypto Investing Fundamentals",
    slug: "crypto-investing-fundamentals",
    description: "Learn the foundational principles of cryptocurrency investing",
    contentType: "video",
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featuredImageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    createdBy: "admin",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    updatedAt: new Date().toISOString(),
    published: true,
    steps: [
      {
        id: "crypto-step-1",
        title: "Introduction to Cryptocurrency",
        content: "# Welcome to Crypto Fundamentals\n\nThis step will introduce you to the world of cryptocurrency and blockchain technology.\n\n## What You'll Learn\n\n- The origins and purpose of Bitcoin\n- How blockchain technology works\n- Different types of cryptocurrencies\n- Why crypto matters for financial sovereignty",
        videoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 0,
        ctas: []
      },
      {
        id: "crypto-step-2",
        title: "Setting Up Your First Crypto Wallet",
        content: "# Creating Your Crypto Wallet\n\nLet's set up your first cryptocurrency wallet for secure storage.\n\n## Types of Wallets\n\n- Hot wallets (online)\n- Cold storage (hardware wallets)\n- Paper wallets\n- Mobile wallets\n\n## Step-by-Step Setup Guide\n\n1. Choose the right wallet type for your needs\n2. Download or purchase your selected wallet\n3. Follow the initialization process\n4. Secure your seed phrase properly\n5. Test with a small amount first",
        videoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 1,
        ctas: [
          {
            id: "crypto-cta-1",
            contentId: "crypto-step-2",
            campaignId: "insiderdao",
            buttonText: "Join InsiderDAO",
            description: "Get access to our premium crypto signals and analysis",
            theme: "primary",
            placement: "banner",
            position: "bottom"
          }
        ]
      },
      {
        id: "crypto-step-3",
        title: "Understanding Market Cycles",
        content: "# Crypto Market Cycles\n\nLearning to recognize and navigate market cycles is essential for successful investing.\n\n## The Four Phases\n\n- Accumulation: Smart money entering\n- Mark-up: Public awareness and price increases\n- Distribution: Smart money exiting\n- Mark-down: Declining prices and sentiment\n\n## Indicators to Watch\n\n1. Volume profiles during different phases\n2. Social media sentiment analysis\n3. Long-term moving averages\n4. Fundamental project developments",
        videoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 2,
        ctas: []
      }
    ],
    isDuplicated: false,
    tags: ["Crypto", "Investing", "Finance"],
    duplicationsCount: 56,
    featured: false,
    stats: {
      views: 2387,
      ctaClicks: 542,
      conversions: 78,
      shares: 134
    }
  },
  {
    id: "signal-3",
    name: "Digital Sovereignty Guide",
    slug: "digital-sovereignty-guide",
    description: "Take control of your digital life and protect your privacy online",
    contentType: "article",
    thumbnailUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featuredImageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    createdBy: "admin",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date().toISOString(),
    published: true,
    steps: [
      {
        id: "sovereignty-step-1",
        title: "The Case for Digital Sovereignty",
        content: "# Why Digital Sovereignty Matters\n\nThis step explores why taking control of your digital life is more important than ever.\n\n## The Current Landscape\n\n- Corporate data harvesting at unprecedented scale\n- Government surveillance capabilities\n- Digital censorship and platform control\n- Financial tracking and restrictions\n\n## The Benefits of Digital Sovereignty\n\n1. Protection from censorship and deplatforming\n2. Control over your personal data\n3. Financial privacy and autonomy\n4. Reduced vulnerability to hacking and identity theft",
        mediaUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        order: 0,
        ctas: []
      },
      {
        id: "sovereignty-step-2",
        title: "Secure Communications Setup",
        content: "# Securing Your Communications\n\nLet's set up secure, private communication channels that protect your conversations.\n\n## Recommended Tools\n\n- Signal: For encrypted messaging and calls\n- ProtonMail: For secure email communications\n- Jitsi Meet: For private video conferencing\n- Session: For metadata-resistant messaging\n\n## Implementation Guide\n\n1. Download and install the recommended apps\n2. Configure proper security settings\n3. Create new accounts with minimal personal information\n4. Migrate important contacts to secure platforms\n5. Establish good security habits",
        order: 1,
        ctas: [
          {
            id: "sovereignty-cta-1",
            contentId: "sovereignty-step-2",
            campaignId: "insiderlife",
            buttonText: "Get Our Privacy Toolkit",
            description: "Download our comprehensive guide to digital privacy tools",
            theme: "primary",
            placement: "inline",
            position: "top"
          }
        ]
      },
      {
        id: "sovereignty-step-3",
        title: "Financial Sovereignty Basics",
        content: "# Taking Control of Your Financial Life\n\nFinancial sovereignty is a critical component of overall digital freedom.\n\n## Key Components\n\n- Self-custody of assets where possible\n- Privacy-preserving payment methods\n- Diversification across systems and jurisdictions\n- Minimal financial footprint\n\n## Getting Started\n\n1. Establish a basic cryptocurrency position\n2. Learn to use privacy-preserving financial tools\n3. Reduce dependence on surveilled payment systems\n4. Create a resilient financial structure",
        mediaUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        order: 2,
        ctas: [
          {
            id: "sovereignty-cta-2",
            contentId: "sovereignty-step-3",
            campaignId: "insiderdao",
            buttonText: "Join Our Financial Sovereignty Course",
            description: "Master the tools and strategies for financial freedom",
            theme: "primary",
            placement: "banner",
            position: "bottom"
          }
        ]
      },
      {
        id: "sovereignty-step-4",
        title: "Online Identity Protection",
        content: "# Protecting Your Digital Identity\n\nThis step covers the essentials of maintaining a secure online identity.\n\n## Core Principles\n\n- Compartmentalization of identities\n- Minimizing personal information sharing\n- Using strong authentication methods\n- Managing your digital footprint\n\n## Action Steps\n\n1. Audit your current online presence\n2. Set up identity-specific email accounts\n3. Configure a password manager\n4. Implement two-factor authentication\n5. Begin sanitizing your existing profiles",
        order: 3,
        ctas: []
      }
    ],
    isDuplicated: false,
    tags: ["Sovereignty", "Privacy", "Security"],
    duplicationsCount: 34,
    featured: true,
    aiSummary: {
      summary: "A practical guide to achieving digital privacy and sovereignty in the modern surveillance economy.",
      guardianAware: true,
      guardianCommentary: "This series contains essential knowledge for preserving your freedom in the digital age."
    },
    stats: {
      views: 1854,
      ctaClicks: 423,
      conversions: 62,
      shares: 97
    }
  },
  {
    id: "signal-4",
    name: "Content Creator's Launchpad",
    slug: "content-creator-launchpad",
    description: "Launch your content creation career with our proven system",
    contentType: "mixed",
    thumbnailUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featuredImageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    createdBy: "admin",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    updatedAt: new Date().toISOString(),
    published: true,
    steps: [
      {
        id: "creator-step-1",
        title: "Finding Your Content Niche",
        content: "# Discovering Your Perfect Niche\n\nThis first step will help you identify the ideal content niche for your creator journey.\n\n## Why Niching Down Matters\n\n- Establishes your expertise more quickly\n- Makes content creation decisions easier\n- Helps you find your audience faster\n- Creates a clearer monetization path\n\n## Niche Selection Framework\n\n1. List your passions, skills, and knowledge areas\n2. Research market demand and competition\n3. Identify underserved audience segments\n4. Evaluate monetization potential\n5. Test concepts before fully committing",
        videoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 0,
        ctas: []
      },
      {
        id: "creator-step-2",
        title: "Building Your Content Engine",
        content: "# Creating Your Content Production System\n\nNow let's build a sustainable system for consistent content creation.\n\n## The Content Engine Components\n\n- Idea generation and capture process\n- Content calendar and scheduling\n- Production workflow and templates\n- Distribution and promotion protocols\n- Analytics and feedback loops\n\n## Implementing Your Engine\n\n1. Set up your idea capture system\n2. Create content templates and workflows\n3. Establish your minimum viable production schedule\n4. Build your content promotion checklist\n5. Configure analytics tracking",
        mediaUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        order: 1,
        ctas: [
          {
            id: "creator-cta-1",
            contentId: "creator-step-2",
            campaignId: "societi",
            buttonText: "Try Societi Pro",
            description: "Optimize your social media workflow with our AI-powered platform",
            theme: "primary",
            placement: "banner",
            position: "bottom"
          }
        ]
      },
      {
        id: "creator-step-3",
        title: "Monetization Strategies",
        content: "# Content Monetization Blueprint\n\nExplore the various paths to monetizing your content and audience.\n\n## Revenue Streams for Creators\n\n- Digital products and courses\n- Coaching and consulting\n- Membership communities\n- Affiliate marketing\n- Sponsored content\n- Platform monetization (ads, etc.)\n\n## Choosing Your Path\n\n1. Evaluate each model against your niche and audience\n2. Start with the lowest friction option\n3. Build a diversified revenue portfolio over time\n4. Focus on value creation first, monetization second",
        videoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        order: 2,
        ctas: []
      }
    ],
    isDuplicated: false,
    tags: ["Content Creation", "Business", "Marketing"],
    duplicationsCount: 42,
    featured: false,
    stats: {
      views: 1342,
      ctaClicks: 275,
      conversions: 38,
      shares: 67
    }
  },
  {
    id: "signal-5",
    name: "Social Media Optimization",
    slug: "social-media-optimization",
    description: "Maximize your social media presence with data-driven strategies",
    contentType: "article",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    featuredImageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    createdBy: "admin",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date().toISOString(),
    published: true,
    steps: [
      {
        id: "social-step-1",
        title: "Social Media Audit",
        content: "# Auditing Your Social Media Presence\n\nBefore optimizing, we need to assess your current social media performance.\n\n## Audit Components\n\n- Profile completeness and branding\n- Content performance analysis\n- Audience demographics and engagement\n- Competitor benchmarking\n- Platform-specific metrics review\n\n## Conducting Your Audit\n\n1. Gather data from each active platform\n2. Analyze top and bottom performing content\n3. Identify audience engagement patterns\n4. Benchmark against industry standards\n5. Document findings and opportunity areas",
        order: 0,
        ctas: []
      },
      {
        id: "social-step-2",
        title: "Content Strategy Development",
        content: "# Building Your Social Media Content Strategy\n\nNow let's create a strategic framework for your social media content.\n\n## Strategy Elements\n\n- Content pillars and themes\n- Platform-specific approaches\n- Content mix and formats\n- Posting frequency and timing\n- Voice and brand guidelines\n\n## Creating Your Strategy\n\n1. Define 3-5 content pillars based on audience interests\n2. Map content types to each platform's strengths\n3. Develop your content calendar template\n4. Create batch production processes\n5. Establish measurement protocols",
        mediaUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
        order: 1,
        ctas: [
          {
            id: "social-cta-1",
            contentId: "social-step-2",
            campaignId: "societi",
            buttonText: "Try Societi's Strategy Tool",
            description: "Plan your content strategy with our AI-powered assistant",
            theme: "primary",
            placement: "inline",
            position: "top"
          }
        ]
      },
      {
        id: "social-step-3",
        title: "Growth Tactics",
        content: "# Proven Social Media Growth Tactics\n\nImplement these tested methods to grow your audience and engagement.\n\n## Platform-Agnostic Growth Tactics\n\n- Collaboration and partnerships\n- Community engagement strategies\n- Content repurposing frameworks\n- Trend leveraging approaches\n- Engagement-bait content formats\n\n## Implementation Guide\n\n1. Select 2-3 tactics to focus on initially\n2. Create implementation processes for each\n3. Test and measure results\n4. Double down on what works\n5. Systematize successful approaches",
        order: 2,
        ctas: []
      }
    ],
    isDuplicated: false,
    tags: ["Social Media", "Marketing", "Growth"],
    duplicationsCount: 27,
    featured: false,
    stats: {
      views: 975,
      ctaClicks: 183,
      conversions: 29,
      shares: 52
    }
  }
];

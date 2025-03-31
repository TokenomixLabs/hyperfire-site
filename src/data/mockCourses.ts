import { Course, CourseModule, CourseLevel, CourseCategory } from '@/types/courses';

// Helper function to create a course module
const createModule = (
  id: string,
  courseId: string,
  title: string,
  description: string,
  duration: number,
  order: number
): CourseModule => ({
  id,
  courseId,
  title,
  description,
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder video URL
  duration,
  order,
  resources: [],
});

// Mock courses data
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    slug: 'ai-freedom-basics',
    title: 'AI Freedom Basics: Getting Started with AI',
    description: 'Learn the fundamentals of AI and how to use it to gain more freedom in your life and business.',
    summary: 'A comprehensive introduction to AI tools and techniques for beginners.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800',
    format: 'video',
    category: ['AI', 'Technology'],
    level: 'Beginner',
    creator: {
      id: 'user-1',
      name: 'Alex Morrison',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    modules: [
      createModule(
        'module-1-1',
        'course-1',
        'Introduction to AI Freedom',
        'Discover how AI can help you reclaim your time and energy.',
        1800,
        1
      ),
    ],
    totalDuration: 1800,
    createdAt: '2023-08-15T00:00:00Z',
    updatedAt: '2023-08-15T00:00:00Z',
    publishedAt: '2023-08-16T00:00:00Z',
    isPublished: true,
    isGated: false,
    accessLevel: 'free',
    tags: ['AI', 'Freedom', 'Basics'],
    viewCount: 1245,
    completionCount: 876,
  },
  {
    id: 'course-2',
    slug: 'building-wealth-with-ai',
    title: 'Building Wealth with AI: Advanced Strategies',
    description: 'Learn how to leverage AI to create multiple income streams and build wealth.',
    summary: 'Advanced strategies for using AI to build wealth and create passive income streams.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=800',
    format: 'series',
    category: ['AI', 'Business', 'Personal Growth'],
    level: 'Advanced',
    creator: {
      id: 'user-2',
      name: 'Sarah Johnson',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    modules: [
      createModule(
        'module-2-1',
        'course-2',
        'The AI Wealth Mindset',
        'Develop the right mindset for using AI to build wealth.',
        2400,
        1
      ),
      createModule(
        'module-2-2',
        'course-2',
        'AI Tools for Passive Income',
        'Discover the best AI tools for creating passive income streams.',
        1800,
        2
      ),
      createModule(
        'module-2-3',
        'course-2',
        'Scaling Your AI Business',
        'Learn how to scale your AI-powered business for maximum growth.',
        2100,
        3
      ),
    ],
    totalDuration: 6300,
    createdAt: '2023-09-10T00:00:00Z',
    updatedAt: '2023-09-15T00:00:00Z',
    publishedAt: '2023-09-20T00:00:00Z',
    isPublished: true,
    isGated: true,
    accessLevel: 'premium',
    tags: ['AI', 'Wealth', 'Business'],
    viewCount: 735,
    completionCount: 412,
  },
  {
    id: 'course-3',
    slug: 'sovereignty-in-digital-age',
    title: 'Digital Sovereignty: Protecting Your Freedom',
    description: 'Learn how to maintain your sovereignty and freedom in the digital age.',
    summary: 'Essential strategies for maintaining personal sovereignty in an increasingly digital world.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800',
    format: 'series',
    category: ['Sovereignty', 'Technology'],
    level: 'Intermediate',
    creator: {
      id: 'user-3',
      name: 'David Park',
      avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    modules: [
      createModule(
        'module-3-1',
        'course-3',
        'The Sovereignty Mindset',
        'Develop the right mindset for maintaining sovereignty in the digital age.',
        1800,
        1
      ),
      createModule(
        'module-3-2',
        'course-3',
        'Digital Privacy Fundamentals',
        'Learn the basics of digital privacy and how to protect your data.',
        2100,
        2
      ),
      createModule(
        'module-3-3',
        'course-3',
        'Sovereign Financial Systems',
        'Discover financial systems that support sovereignty and freedom.',
        1900,
        3
      ),
      createModule(
        'module-3-4',
        'course-3',
        'Building a Sovereign Lifestyle',
        'Practical steps to build a lifestyle based on sovereignty principles.',
        2400,
        4
      ),
    ],
    totalDuration: 8200,
    createdAt: '2023-07-05T00:00:00Z',
    updatedAt: '2023-07-10T00:00:00Z',
    publishedAt: '2023-07-15T00:00:00Z',
    isPublished: true,
    isGated: true,
    accessLevel: 'vip',
    tags: ['Sovereignty', 'Digital', 'Freedom'],
    viewCount: 962,
    completionCount: 587,
  },
  {
    id: 'course-4',
    slug: 'marketing-with-ai-tools',
    title: 'Marketing Automation with AI Tools',
    description: 'Learn how to automate your marketing efforts using AI tools and strategies.',
    summary: 'Practical guide to using AI for automating and enhancing marketing campaigns.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800',
    format: 'video',
    category: ['Marketing', 'AI', 'Business'],
    level: 'Intermediate',
    creator: {
      id: 'user-2',
      name: 'Sarah Johnson',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    modules: [
      createModule(
        'module-4-1',
        'course-4',
        'AI-Powered Marketing Automation',
        'Learn how to use AI to automate your marketing efforts.',
        2700,
        1
      ),
    ],
    totalDuration: 2700,
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2023-10-05T00:00:00Z',
    publishedAt: '2023-10-10T00:00:00Z',
    isPublished: true,
    isGated: false,
    accessLevel: 'free',
    tags: ['Marketing', 'AI', 'Automation'],
    viewCount: 528,
    completionCount: 341,
  },
  {
    id: 'course-5',
    slug: 'business-growth-strategies',
    title: 'Business Growth Strategies: Scaling with Technology',
    description: 'Learn how to use technology to scale your business and achieve sustainable growth.',
    summary: 'Strategic approaches to scaling your business using modern technology and systems.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800',
    format: 'series',
    category: ['Business', 'Technology'],
    level: 'Advanced',
    creator: {
      id: 'user-1',
      name: 'Alex Morrison',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    modules: [
      createModule(
        'module-5-1',
        'course-5',
        'Growth Mindset for Business',
        'Develop the right mindset for scaling your business.',
        1800,
        1
      ),
      createModule(
        'module-5-2',
        'course-5',
        'Systems for Scale',
        'Learn how to create systems that enable sustainable growth.',
        2100,
        2
      ),
      createModule(
        'module-5-3',
        'course-5',
        'Technology Stack for Growth',
        'Discover the ideal technology stack for scaling your business.',
        1900,
        3
      ),
    ],
    totalDuration: 5800,
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2023-06-20T00:00:00Z',
    publishedAt: '2023-06-25T00:00:00Z',
    isPublished: true,
    isGated: true,
    accessLevel: 'premium',
    tags: ['Business', 'Growth', 'Technology'],
    viewCount: 815,
    completionCount: 496,
  },
  {
    id: 'course-6',
    slug: 'personal-development-fundamentals',
    title: 'Personal Development Fundamentals',
    description: 'Learn the core principles of personal development for success in all areas of life.',
    summary: 'Essential personal development concepts and practices for a fulfilling life.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800',
    format: 'video',
    category: ['Personal Growth'],
    level: 'All Levels',
    creator: {
      id: 'user-3',
      name: 'David Park',
      avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    modules: [
      createModule(
        'module-6-1',
        'course-6',
        'The Foundations of Personal Growth',
        'Discover the core principles that drive personal development.',
        3000,
        1
      ),
    ],
    totalDuration: 3000,
    createdAt: '2023-11-01T00:00:00Z',
    updatedAt: '2023-11-05T00:00:00Z',
    publishedAt: '2023-11-10T00:00:00Z',
    isPublished: true,
    isGated: false,
    accessLevel: 'free',
    tags: ['Personal Growth', 'Development', 'Mindset'],
    viewCount: 642,
    completionCount: 417,
  },
];

// Add more mock courses as needed
for (let i = 7; i <= 15; i++) {
  const isSeries = i % 3 === 0;
  const isGated = i % 4 === 0;
  const accessLevel = isGated ? (i % 2 === 0 ? 'premium' : 'vip') : 'free';
  
  const modules: CourseModule[] = [];
  const moduleCount = isSeries ? Math.floor(Math.random() * 4) + 2 : 1;
  let totalDuration = 0;
  
  for (let j = 1; j <= moduleCount; j++) {
    const duration = Math.floor(Math.random() * 1800) + 1200; // 20-50 minutes
    totalDuration += duration;
    
    modules.push(createModule(
      `module-${i}-${j}`,
      `course-${i}`,
      `Module ${j}: Sample Module Title`,
      `This is a sample module description for course ${i}, module ${j}.`,
      duration,
      j
    ));
  }
  
  const categories: string[] = [];
  const allCategories = ['AI', 'Business', 'Sovereignty', 'Marketing', 'Technology', 'Personal Growth'];
  const categoryCount = Math.floor(Math.random() * 2) + 1;
  
  for (let c = 0; c < categoryCount; c++) {
    const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
    if (!categories.includes(randomCategory)) {
      categories.push(randomCategory);
    }
  }
  
  const courseLevels: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  
  mockCourses.push({
    id: `course-${i}`,
    slug: `sample-course-${i}`,
    title: `Sample Course ${i}`,
    description: `This is a detailed description for sample course ${i}.`,
    summary: `A brief summary for sample course ${i}.`,
    thumbnailUrl: `https://picsum.photos/seed/course${i}/800/600`,
    format: isSeries ? 'series' : 'video',
    category: categories as CourseCategory[],
    level: courseLevels[Math.floor(Math.random() * courseLevels.length)],
    creator: {
      id: `user-${(i % 3) + 1}`,
      name: ['Alex Morrison', 'Sarah Johnson', 'David Park'][(i % 3)],
      avatarUrl: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${Math.floor(Math.random() * 50) + 10}.jpg`,
    },
    modules,
    totalDuration,
    createdAt: new Date(Date.now() - i * 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - i * 86400000 * 8).toISOString(),
    publishedAt: new Date(Date.now() - i * 86400000 * 7).toISOString(),
    isPublished: true,
    isGated,
    accessLevel: accessLevel as any,
    tags: [`Tag${i}`, `Sample${i}`],
    viewCount: Math.floor(Math.random() * 1000) + 100,
    completionCount: Math.floor(Math.random() * 800) + 50,
  });
}


// Course Types
export type CourseFormat = 'video' | 'series';
export type CourseCategory = 'AI' | 'Business' | 'Sovereignty' | 'Marketing' | 'Technology' | 'Personal Growth';
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type CourseAccess = 'free' | 'vip' | 'premium';

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number; // in seconds
  order: number;
  resources?: CourseResource[];
  isCompleted?: boolean;
  guardianCommentary?: string;
  isVisible?: boolean;
  pdfUrl?: string;
  audioUrl?: string;
  ctaId?: string;
  viewCount?: number;
  completionCount?: number;
}

export interface CourseResource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'file' | 'audio';
  url: string;
  description?: string;
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  completedModules: string[]; // module IDs
  lastAccessedAt: string;
  lastModuleId: string;
  isCompleted: boolean;
  percentComplete: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  summary: string;
  thumbnailUrl: string;
  format: CourseFormat;
  category: CourseCategory[];
  level: CourseLevel;
  creator: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  modules: CourseModule[];
  totalDuration: number; // in seconds
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  isPublished: boolean;
  isGated: boolean;
  accessLevel: CourseAccess;
  ctaIds?: string[]; // IDs of CTAs to show on this course
  tags?: string[];
  progress?: CourseProgress; // User-specific progress data
  viewCount: number;
  completionCount: number;
  ctaClickCount?: number;
  previewVideoUrl?: string;
  lockedMessage?: string;
}

export interface CourseFilters {
  search?: string;
  categories?: CourseCategory[];
  level?: CourseLevel;
  format?: CourseFormat;
  access?: CourseAccess[];
  tags?: string[];
}

export interface CourseSortOption {
  label: string;
  value: 'newest' | 'popular' | 'title' | 'duration';
  direction: 'asc' | 'desc';
}

export interface CourseAnalyticsData {
  courseId: string;
  viewsOverTime: {
    date: string;
    count: number;
  }[];
  completionsOverTime: {
    date: string;
    count: number;
  }[];
  moduleViews: {
    moduleId: string;
    moduleName: string;
    views: number;
  }[];
  moduleCompletions: {
    moduleId: string;
    moduleName: string;
    completions: number;
  }[];
  ctaClicks: {
    ctaId: string;
    ctaName: string;
    clicks: number;
  }[];
  avgCompletionRate: number;
  totalViews: number;
  totalCompletions: number;
  totalCtaClicks: number;
}

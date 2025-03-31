
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
}

export interface CourseResource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'file';
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

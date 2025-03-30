
import { SignalSeriesWithStats } from './signal';

export interface AISummary {
  summary: string;
  guardianAware: boolean;
  guardianCommentary?: string;
}

export interface SignalLibraryItem extends SignalSeriesWithStats {
  aiSummary?: AISummary;
  duplicationsCount: number;
  featured: boolean;
}

export interface DuplicatedSignalWithStats {
  id: string;
  originalSeriesId: string;
  userId: string;
  name: string;
  createdAt: string;
  customIntro?: string;
  uniqueUrl: string;
  stats: {
    views: number;
    shares: number;
    referrals: number;
    ctaClicks: number;
  }
}

export type SignalLibraryView = 'grid' | 'list';
export type SignalLibrarySortBy = 'featured' | 'date' | 'views' | 'duplications';

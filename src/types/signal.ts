
import { ContentCTA } from "./referral";
import { ReferralPlatform } from "@/context/ReferralContext";

export type SignalContentType = 'video' | 'article' | 'mixed';

export interface SignalStep {
  id: string;
  title: string;
  content: string;
  videoEmbed?: string;
  mediaUrl?: string;
  order: number;
  ctas: ContentCTA[];
}

export interface SignalSeries {
  id: string;
  name: string;
  slug: string;
  description: string;
  contentType: SignalContentType;
  thumbnailUrl?: string;
  featuredImageUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  steps: SignalStep[];
  isDuplicated: boolean;
  originalSeriesId?: string;
  tags?: string[];
}

export interface SignalStats {
  views: number;
  ctaClicks: number;
  conversions: number;
  shares: number;
}

export interface SignalSeriesWithStats extends SignalSeries {
  stats: SignalStats;
}

export interface DuplicatedSignal {
  id: string;
  originalId: string;
  userId: string;
  name: string;
  createdAt: string;
  stats: SignalStats;
}

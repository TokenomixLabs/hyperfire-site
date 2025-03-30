
import { SignalSeries } from "./signal";
import { User } from "./user";

export type ThreadTag = 'Vision' | 'Win' | 'Question' | 'Announcement' | 'Resource' | 'Discussion';

export type ReactionType = 'fire' | 'thanks' | 'lightbulb' | 'heart' | 'laugh' | 'wow';

export interface Reaction {
  id: string;
  userId: string;
  type: ReactionType;
  createdAt: string;
}

export interface Reply {
  id: string;
  threadId: string;
  parentReplyId?: string;
  content: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
  reactions: Reaction[];
  mediaUrls: string[];
  videoEmbeds: string[];
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
  tags: ThreadTag[];
  signalSeriesId?: string;
  signalSeries?: SignalSeries;
  previewImageUrl?: string;
  isPinned: boolean;
  isLocked: boolean;
  guardianAware: boolean;
  ctaId?: string;
  replies: Reply[];
  reactions: Reaction[];
  mediaUrls: string[];
  videoEmbeds: string[];
  viewCount: number;
}

export interface ThreadListItem {
  id: string;
  title: string;
  previewContent: string;
  authorId: string;
  author?: User;
  createdAt: string;
  tags: ThreadTag[];
  previewImageUrl?: string;
  isPinned: boolean;
  replyCount: number;
  reactionCount: number;
  viewCount: number;
}

export type ThreadSortOption = 'latest' | 'popular' | 'trending';

export type ThreadFilterOption = 'all' | ThreadTag | 'pinned';

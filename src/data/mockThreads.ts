
import { Thread, ThreadListItem, ThreadTag } from "@/types/signalboard";

export const mockTags: ThreadTag[] = [
  'Vision',
  'Win',
  'Question',
  'Announcement',
  'Resource',
  'Discussion'
];

export const mockThreads: Thread[] = [
  {
    id: "thread-1",
    title: "Welcome to SignalBoard: The Future of Sovereign Discussion",
    content: `<h2>Welcome to our community!</h2><p>This is the place where we'll share ideas, celebrate wins, and help each other grow. SignalBoard is designed for high-quality, sovereign discussions.</p><p>Feel free to introduce yourself below!</p><img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c" alt="Community" /><p>Looking forward to connecting with all of you!</p>`,
    authorId: "user-1",
    author: {
      id: "user-1",
      name: "Alex Morrison",
      email: "alex@example.com",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    createdAt: "2023-06-15T12:00:00Z",
    updatedAt: "2023-06-15T12:00:00Z",
    tags: ['Announcement', 'Vision'],
    isPinned: true,
    isLocked: false,
    guardianAware: true,
    mediaUrls: ["https://images.unsplash.com/photo-1522071820081-009f0129c71c"],
    videoEmbeds: [],
    replies: [
      {
        id: "reply-1",
        threadId: "thread-1",
        content: "This is amazing! I've been looking for a community like this for a long time.",
        authorId: "user-2",
        author: {
          id: "user-2",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        createdAt: "2023-06-15T14:30:00Z",
        updatedAt: "2023-06-15T14:30:00Z",
        reactions: [
          {
            id: "reaction-1",
            userId: "user-1",
            type: "heart",
            createdAt: "2023-06-15T15:00:00Z"
          }
        ],
        mediaUrls: [],
        videoEmbeds: []
      }
    ],
    reactions: [
      {
        id: "reaction-2",
        userId: "user-3",
        type: "fire",
        createdAt: "2023-06-15T16:00:00Z"
      },
      {
        id: "reaction-3",
        userId: "user-2",
        type: "thanks",
        createdAt: "2023-06-15T17:00:00Z"
      }
    ],
    viewCount: 156
  },
  {
    id: "thread-2",
    title: "How I Generated $10k with Signal Series in Just 14 Days",
    content: `<p>I wanted to share my recent win with everyone here!</p><h3>The Strategy</h3><p>I duplicated the AI Freedom Code signal series and shared it with my audience on Twitter. Here's the breakdown:</p><ul><li>Day 1-3: 240 visitors</li><li>Day 4-7: 560 visitors</li><li>Day 8-14: 900+ visitors</li></ul><p>The conversion rate was approximately 4.2%, which led to $10,450 in commission payouts!</p><p>I'm happy to answer any questions about my approach.</p>`,
    authorId: "user-4",
    author: {
      id: "user-4",
      name: "Michael Chen",
      email: "michael@example.com",
      avatarUrl: "https://randomuser.me/api/portraits/men/64.jpg",
    },
    createdAt: "2023-06-18T09:15:00Z",
    updatedAt: "2023-06-18T09:15:00Z",
    tags: ['Win'],
    signalSeriesId: "series-1",
    isPinned: false,
    isLocked: false,
    guardianAware: true,
    previewImageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    mediaUrls: ["https://images.unsplash.com/photo-1499750310107-5fef28a66643"],
    videoEmbeds: [],
    replies: [],
    reactions: [
      {
        id: "reaction-4",
        userId: "user-1",
        type: "fire",
        createdAt: "2023-06-18T10:00:00Z"
      },
      {
        id: "reaction-5",
        userId: "user-2",
        type: "fire",
        createdAt: "2023-06-18T11:30:00Z"
      },
      {
        id: "reaction-6",
        userId: "user-3",
        type: "wow",
        createdAt: "2023-06-18T12:45:00Z"
      }
    ],
    viewCount: 89
  },
  {
    id: "thread-3",
    title: "Question: Best Platform to Share Signal Series?",
    content: `<p>I'm new to SignalFire and wanting to get the most out of the Signal Series feature. Where have you found the most success sharing your duplicated series?</p><p>I've tried:</p><ol><li>Twitter - Some engagement but limited reach</li><li>LinkedIn - Decent results but slow conversion</li><li>Email list (small, ~500 people) - Best results so far</li></ol><p>What's working for everyone else? Any platforms I'm overlooking?</p>`,
    authorId: "user-5",
    author: {
      id: "user-5",
      name: "Emma Wilson",
      email: "emma@example.com",
      avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    createdAt: "2023-06-20T16:40:00Z",
    updatedAt: "2023-06-20T16:40:00Z",
    tags: ['Question'],
    isPinned: false,
    isLocked: false,
    guardianAware: false,
    mediaUrls: [],
    videoEmbeds: [],
    replies: [
      {
        id: "reply-2",
        threadId: "thread-3",
        content: "I've had great success with Instagram stories, believe it or not. The key is to create a compelling visual that teases the value in the series, then use the 'swipe up' feature (if you have 10k+ followers) or the link in bio approach.",
        authorId: "user-3",
        author: {
          id: "user-3",
          name: "David Park",
          email: "david@example.com",
          avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
        },
        createdAt: "2023-06-20T17:15:00Z",
        updatedAt: "2023-06-20T17:15:00Z",
        reactions: [],
        mediaUrls: [],
        videoEmbeds: []
      }
    ],
    reactions: [
      {
        id: "reaction-7",
        userId: "user-4",
        type: "lightbulb",
        createdAt: "2023-06-20T18:10:00Z"
      }
    ],
    viewCount: 42
  }
];

export const getThreadListItems = (): ThreadListItem[] => {
  return mockThreads.map(thread => ({
    id: thread.id,
    title: thread.title,
    previewContent: thread.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
    authorId: thread.authorId,
    author: thread.author,
    createdAt: thread.createdAt,
    tags: thread.tags,
    previewImageUrl: thread.previewImageUrl,
    isPinned: thread.isPinned,
    replyCount: thread.replies.length,
    reactionCount: thread.reactions.length,
    viewCount: thread.viewCount
  }));
};

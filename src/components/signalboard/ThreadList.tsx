
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThreadListItem, ThreadSortOption, ThreadFilterOption } from '@/types/signalboard';
import { getThreadListItems, mockTags } from '@/data/mockThreads';
import { 
  MessageCircle, 
  Heart, 
  Eye, 
  Clock, 
  TrendingUp,
  Pin,
  Filter
} from 'lucide-react';
import ThreadListItemCard from './ThreadListItemCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ThreadList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [threads, setThreads] = useState<ThreadListItem[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<ThreadListItem[]>([]);
  
  const tagFilter = searchParams.get('tag') as ThreadFilterOption || 'all';
  const sortOption = searchParams.get('sort') as ThreadSortOption || 'latest';
  
  useEffect(() => {
    // In a real app, this would be an API call
    const threadListItems = getThreadListItems();
    setThreads(threadListItems);
  }, []);
  
  useEffect(() => {
    let filtered = [...threads];
    
    // Apply tag filter
    if (tagFilter && tagFilter !== 'all') {
      if (tagFilter === 'pinned') {
        filtered = filtered.filter(thread => thread.isPinned);
      } else {
        filtered = filtered.filter(thread => thread.tags.includes(tagFilter as any));
      }
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'latest':
        filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered = filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'trending':
        filtered = filtered.sort((a, b) => (b.reactionCount + b.replyCount) - (a.reactionCount + a.replyCount));
        break;
      default:
        break;
    }
    
    // Pinned threads always appear at the top
    filtered = [
      ...filtered.filter(thread => thread.isPinned),
      ...filtered.filter(thread => !thread.isPinned)
    ];
    
    setFilteredThreads(filtered);
  }, [threads, tagFilter, sortOption]);
  
  const handleSortChange = (sort: ThreadSortOption) => {
    searchParams.set('sort', sort);
    setSearchParams(searchParams);
  };
  
  const handleTagFilter = (tag: ThreadFilterOption) => {
    if (tag === 'all') {
      searchParams.delete('tag');
    } else {
      searchParams.set('tag', tag);
    }
    setSearchParams(searchParams);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">SignalBoard</h1>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleTagFilter('all')}>
                All Threads
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTagFilter('pinned')}>
                <Pin className="h-4 w-4 mr-2" />
                Pinned Threads
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {mockTags.map(tag => (
                <DropdownMenuItem key={tag} onClick={() => handleTagFilter(tag)}>
                  {tag}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {sortOption === 'latest' && <Clock className="h-4 w-4" />}
                {sortOption === 'popular' && <Eye className="h-4 w-4" />}
                {sortOption === 'trending' && <TrendingUp className="h-4 w-4" />}
                Sort: {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSortChange('latest')}>
                <Clock className="h-4 w-4 mr-2" />
                Latest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('popular')}>
                <Eye className="h-4 w-4 mr-2" />
                Popular
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('trending')}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {tagFilter !== 'all' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          <div className="inline-flex items-center px-2.5 py-1 rounded-md text-sm bg-primary/10 text-primary">
            {tagFilter}
            <button 
              className="ml-2 hover:text-primary/80"
              onClick={() => handleTagFilter('all')}
              aria-label="Clear filter"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {filteredThreads.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-medium mb-2">No threads found</h3>
              <p className="text-muted-foreground mb-4">
                {tagFilter !== 'all' 
                  ? `There are no threads with the tag "${tagFilter}"`
                  : "No threads have been created yet"}
              </p>
              <Button>
                Create the First Thread
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredThreads.map(thread => (
            <ThreadListItemCard key={thread.id} thread={thread} />
          ))
        )}
      </div>
    </div>
  );
};

export default ThreadList;

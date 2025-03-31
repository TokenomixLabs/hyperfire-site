
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, Bookmark, TrendingUp, Clock, Tag } from 'lucide-react';
import { mockTags } from '@/data/mockThreads';
import ActivitySidebar from '../activity/ActivitySidebar';

const SignalBoardSidebar = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="space-y-6">
      {isAuthenticated && (
        <Card>
          <CardContent className="p-4">
            <Button className="w-full gap-2" size="lg">
              <PlusCircle className="h-4 w-4" />
              Create New Thread
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="p-4 pt-6">
          <h3 className="text-lg font-semibold mb-4">Browse Threads</h3>
          
          <nav className="space-y-2">
            <Link to="/signalboard" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              <Clock className="h-4 w-4" />
              <span>Latest Threads</span>
            </Link>
            
            <Link to="/signalboard?sort=popular" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              <TrendingUp className="h-4 w-4" />
              <span>Popular Now</span>
            </Link>
            
            {isAuthenticated && (
              <Link to="/signalboard/bookmarks" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                <Bookmark className="h-4 w-4" />
                <span>My Bookmarks</span>
              </Link>
            )}
          </nav>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 pt-6">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          
          <div className="flex flex-wrap gap-2">
            {mockTags.map(tag => (
              <Link 
                key={tag}
                to={`/signalboard?tag=${tag}`}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <ActivitySidebar />
    </div>
  );
};

export default SignalBoardSidebar;

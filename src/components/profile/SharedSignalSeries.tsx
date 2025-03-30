
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, BarChart, UserPlus, ArrowUpDown } from 'lucide-react';

interface SharedSignalSeriesProps {
  series: any[]; // Will be typed properly when we know the structure
}

const SharedSignalSeries: React.FC<SharedSignalSeriesProps> = ({ series }) => {
  const [sortBy, setSortBy] = useState<'recent' | 'impact'>('recent');
  
  const sortedSeries = [...series].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // Sort by impact (conversion rate)
      const aImpact = a.stats.conversions / (a.stats.views || 1);
      const bImpact = b.stats.conversions / (b.stats.views || 1);
      return bImpact - aImpact;
    }
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSortBy(sortBy === 'recent' ? 'impact' : 'recent')}
          className="text-sm"
        >
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort by {sortBy === 'recent' ? 'Most Recent' : 'Most Impactful'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSeries.length > 0 ? (
          sortedSeries.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div 
                className="h-40 bg-cover bg-center" 
                style={{ backgroundImage: `url(${item.thumbnailUrl || '/placeholder.svg'})` }}
              />
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.name}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" /> {item.stats.views}
                  </div>
                  <div className="flex items-center">
                    <BarChart className="w-4 h-4 mr-1" /> {item.stats.ctaClicks}
                  </div>
                  <div className="flex items-center">
                    <UserPlus className="w-4 h-4 mr-1" /> {item.stats.conversions}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => window.open(`/s/${item.slug}?ref=${item.createdBy}`, '_blank')}
                >
                  View Signal
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            No signal series shared yet
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedSignalSeries;

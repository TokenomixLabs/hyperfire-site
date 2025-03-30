
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, BarChart2, Copy, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AnimatedTransition from "@/components/AnimatedTransition";
import { SignalSeriesWithStats } from '@/types/signal';
import SignalSeriesCreator from '@/components/signal/admin/SignalSeriesCreator';
import SignalSeriesList from '@/components/signal/admin/SignalSeriesList';
import SignalSeriesStats from '@/components/signal/admin/SignalSeriesStats';

// Mock data for demo purposes
const mockSignalSeries: SignalSeriesWithStats[] = [
  {
    id: "signal-1",
    name: "AI Freedom Roadmap",
    slug: "ai-freedom-roadmap",
    description: "Master AI tools and build your freedom business in 5 simple steps",
    contentType: "mixed",
    thumbnailUrl: "/thumbnails/ai-freedom.jpg",
    featuredImageUrl: "/featured/ai-freedom-banner.jpg",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    steps: [],
    isDuplicated: false,
    stats: {
      views: 1456,
      ctaClicks: 328,
      conversions: 42,
      shares: 86
    }
  },
  {
    id: "signal-2",
    name: "Crypto Investing Fundamentals",
    slug: "crypto-investing-fundamentals",
    description: "Learn the foundational principles of cryptocurrency investing",
    contentType: "video",
    thumbnailUrl: "/thumbnails/crypto-basics.jpg",
    featuredImageUrl: "/featured/crypto-banner.jpg",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    steps: [],
    isDuplicated: false,
    stats: {
      views: 2387,
      ctaClicks: 542,
      conversions: 78,
      shares: 134
    }
  }
];

const SignalSeriesAdmin = () => {
  const [activeTab, setActiveTab] = useState("all-series");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingSeries, setEditingSeries] = useState<SignalSeriesWithStats | null>(null);
  const [series, setSeries] = useState<SignalSeriesWithStats[]>(mockSignalSeries);

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setActiveTab("create");
  };

  const handleEdit = (seriesId: string) => {
    const seriesItem = series.find(item => item.id === seriesId);
    if (seriesItem) {
      setEditingSeries(seriesItem);
      setActiveTab("create");
    }
  };

  const handleDuplicate = (seriesId: string) => {
    const seriesItem = series.find(item => item.id === seriesId);
    if (seriesItem) {
      const duplicated = {
        ...seriesItem,
        id: `duplicate-${seriesItem.id}`,
        name: `${seriesItem.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDuplicated: true,
        originalSeriesId: seriesItem.id,
        stats: {
          views: 0,
          ctaClicks: 0,
          conversions: 0,
          shares: 0
        }
      };
      setSeries([...series, duplicated]);
    }
  };

  const handleDelete = (seriesId: string) => {
    setSeries(series.filter(item => item.id !== seriesId));
  };

  const handleSaveSeries = (savedSeries: SignalSeriesWithStats) => {
    if (editingSeries) {
      // Update existing
      setSeries(series.map(item => 
        item.id === savedSeries.id ? savedSeries : item
      ));
      setEditingSeries(null);
    } else {
      // Add new
      setSeries([...series, {
        ...savedSeries,
        id: `signal-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stats: {
          views: 0,
          ctaClicks: 0,
          conversions: 0,
          shares: 0
        }
      }]);
    }
    setIsCreatingNew(false);
    setActiveTab("all-series");
  };

  const handleCancel = () => {
    setIsCreatingNew(false);
    setEditingSeries(null);
    setActiveTab("all-series");
  };

  return (
    <AnimatedTransition className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Signal Series Management</h1>
        <Button onClick={handleCreateNew} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" /> Create New Series
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="all-series">All Series</TabsTrigger>
          <TabsTrigger value="stats">Performance Stats</TabsTrigger>
          <TabsTrigger value="create">Create/Edit Series</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-series">
          <SignalSeriesList 
            series={series}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="stats">
          <SignalSeriesStats series={series} />
        </TabsContent>
        
        <TabsContent value="create">
          <SignalSeriesCreator 
            editingSeries={editingSeries}
            onSave={handleSaveSeries}
            onCancel={handleCancel}
          />
        </TabsContent>
      </Tabs>
    </AnimatedTransition>
  );
};

export default SignalSeriesAdmin;

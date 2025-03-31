
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Search, Eye, Edit, Trash2, BarChart2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import AnimatedTransition from "@/components/AnimatedTransition";
import { useToast } from "@/hooks/use-toast";
import { Funnel } from '@/types/funnel';

export default function Funnels() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data - in a real app this would come from an API
  const mockFunnels: Funnel[] = [
    {
      id: 'funnel-1',
      slug: 'vip-invitation',
      title: 'VIP Insider Access',
      description: 'Exclusive funnel for VIP members',
      steps: [],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-10T00:00:00Z',
      createdBy: 'admin_user',
      isPublished: true,
      visibility: 'public',
      customRoute: '/vip-invite',
      trackingId: 'funnel_vip_123',
      stats: {
        visits: 1240,
        ctaClicks: 680,
        conversions: 142,
        referralSignups: 89,
        completionRate: 42.5,
        stepStats: []
      }
    },
    {
      id: 'funnel-2',
      slug: 'course-preview',
      title: 'AI Course Preview',
      description: 'Funnel for AI course preview and sign-up',
      steps: [],
      createdAt: '2023-02-15T00:00:00Z',
      updatedAt: '2023-02-20T00:00:00Z',
      createdBy: 'admin_user',
      isPublished: true,
      visibility: 'public',
      customRoute: '/ai-preview',
      trackingId: 'funnel_ai_course',
      stats: {
        visits: 2450,
        ctaClicks: 1200,
        conversions: 310,
        referralSignups: 105,
        completionRate: 56.8,
        stepStats: []
      }
    },
    {
      id: 'funnel-3',
      slug: 'affiliate-program',
      title: 'Affiliate Partner Program',
      description: 'Onboarding funnel for new affiliate partners',
      steps: [],
      createdAt: '2023-03-10T00:00:00Z',
      updatedAt: '2023-03-15T00:00:00Z',
      createdBy: 'admin_user',
      isPublished: false,
      visibility: 'private',
      trackingId: 'funnel_affiliate',
      stats: {
        visits: 180,
        ctaClicks: 75,
        conversions: 12,
        referralSignups: 8,
        completionRate: 34.2,
        stepStats: []
      }
    }
  ];
  
  const handleGoBack = () => {
    navigate('/admin');
  };
  
  const handleCreateFunnel = () => {
    navigate('/admin/funnels/new');
  };
  
  const handleEditFunnel = (funnelId: string) => {
    navigate(`/admin/funnels/${funnelId}`);
  };
  
  const handlePreviewFunnel = (funnel: Funnel) => {
    const url = funnel.customRoute || `/funnels/${funnel.slug}`;
    // In a real app, this would open the funnel in a new tab
    toast({
      title: "Funnel Preview",
      description: `Opening preview for ${funnel.title} at ${url}`,
    });
  };
  
  const handleViewStats = (funnelId: string) => {
    navigate(`/admin/funnels/${funnelId}?tab=stats`);
  };
  
  const handleDeleteFunnel = (funnelId: string) => {
    // In a real app, this would open a confirmation dialog and then delete the funnel
    toast({
      title: "Delete not implemented",
      description: "This would delete the funnel in a real application.",
    });
  };
  
  // Filter funnels based on search query and status filter
  const filteredFunnels = mockFunnels
    .filter(funnel => 
      funnel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      funnel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      funnel.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(funnel => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'published') return funnel.isPublished;
      if (statusFilter === 'draft') return !funnel.isPublished;
      return true;
    });
  
  return (
    <AnimatedTransition className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Referral Funnels</h1>
        </div>
        
        <Button 
          onClick={handleCreateFunnel}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Funnel
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search funnels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Funnels</SelectItem>
                  <SelectItem value="published">Published Only</SelectItem>
                  <SelectItem value="draft">Drafts Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funnel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Custom Route</TableHead>
                <TableHead className="text-right">Visits</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFunnels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No funnels found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredFunnels.map((funnel) => (
                  <TableRow key={funnel.id}>
                    <TableCell>
                      <div className="font-medium">{funnel.title}</div>
                      <div className="text-sm text-muted-foreground">{funnel.slug}</div>
                    </TableCell>
                    <TableCell>
                      {funnel.isPublished ? (
                        <Badge variant="default" className="bg-green-500">Published</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {funnel.visibility === 'public' ? 'Public' : 
                         funnel.visibility === 'private' ? 'Private' : 'Unlisted'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {funnel.customRoute || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {funnel.stats?.visits.toLocaleString() || '0'}
                    </TableCell>
                    <TableCell className="text-right">
                      {funnel.stats?.conversions.toLocaleString() || '0'}
                      {funnel.stats && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({((funnel.stats.conversions / funnel.stats.visits) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePreviewFunnel(funnel)}
                          title="Preview Funnel"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewStats(funnel.id)}
                          title="View Stats"
                        >
                          <BarChart2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditFunnel(funnel.id)}
                          title="Edit Funnel"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteFunnel(funnel.id)}
                          title="Delete Funnel"
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AnimatedTransition>
  );
}

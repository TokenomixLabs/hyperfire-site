import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, HelpCircle, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lead } from '@/types/autoresponder';
import { leadsTable } from '@/utils/supabaseHelpers';

const ReferredLeadsList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeads = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const { data, error } = await leadsTable()
          .select('*')
          .eq('referrer_user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setLeads(data as Lead[]);
      } catch (error) {
        console.error('Error fetching leads:', error);
        toast({
          title: 'Failed to load leads',
          description: 'There was an error loading your referred leads.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeads();
  }, [user, toast]);

  const getESPStatusBadge = (status: string | null, provider: string | null) => {
    if (!status) return null;
    
    switch (status) {
      case 'synced':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
            Synced to {provider || 'ESP'}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
            Sync pending
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
            Sync failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Referred Leads</CardTitle>
          <CardDescription>People who have signed up through your referral links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (leads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Referred Leads</CardTitle>
          <CardDescription>People who have signed up through your referral links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-slate-100 p-3 mb-4">
              <Inbox className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium">No Leads Yet</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md">
              Share your referral links to start capturing leads. They'll appear here when people sign up.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Your Referred Leads</CardTitle>
        <CardDescription>People who have signed up through your referral links</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    <span className="mr-1">ESP Status</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Whether the lead has been synced to your email service provider (ESP)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    {`${lead.first_name} ${lead.last_name || ''}`}
                  </TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>
                    {getESPStatusBadge(lead.esp_status, lead.esp_provider)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferredLeadsList;

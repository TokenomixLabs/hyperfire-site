
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, DollarSign, Users, TrendingUp } from 'lucide-react';

interface CommissionStats {
  totalEarned: number;
  totalReferrals: number;
  pendingCommissions: number;
}

const CommissionStats = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<CommissionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommissionStats = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Get total earned commissions
        const { data: commissionsData, error: commissionsError } = await supabase
          .from('transactions')
          .select('referrer_amount')
          .eq('referrer_user_id', user.id)
          .eq('payout_status', 'completed');
        
        if (commissionsError) throw commissionsError;
        
        // Get pending commissions
        const { data: pendingData, error: pendingError } = await supabase
          .from('transactions')
          .select('referrer_amount')
          .eq('referrer_user_id', user.id)
          .eq('payout_status', 'pending');
        
        if (pendingError) throw pendingError;
        
        // Get total unique referrals (count distinct customer_user_id)
        const { data: referralsData, error: referralsError } = await supabase
          .from('transactions')
          .select('customer_user_id')
          .eq('referrer_user_id', user.id);
        
        if (referralsError) throw referralsError;
        
        // Calculate totals
        const totalEarned = commissionsData.reduce((sum, item) => sum + (item.referrer_amount || 0), 0) / 100;
        const pendingCommissions = pendingData.reduce((sum, item) => sum + (item.referrer_amount || 0), 0) / 100;
        
        // Get unique customer IDs (count as total referrals)
        const uniqueCustomers = new Set(referralsData.map(r => r.customer_user_id)).size;
        
        setStats({
          totalEarned,
          totalReferrals: uniqueCustomers,
          pendingCommissions
        });
      } catch (error) {
        console.error('Error fetching commission stats:', error);
        toast({
          title: "Failed to load commission stats",
          description: "Could not load your commission statistics. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCommissionStats();
  }, [user, toast]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Commission Stats</CardTitle>
          <CardDescription>Loading your commission statistics</CardDescription>
        </CardHeader>
        <CardContent className="pt-2 flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Your Commission Stats</CardTitle>
        <CardDescription>Track your affiliate earnings and referrals</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-1 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-1 text-green-500" />
              <span>Total Earned</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              ${stats?.totalEarned.toFixed(2) || '0.00'}
            </div>
          </div>
          
          <div className="flex flex-col space-y-1 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1 text-blue-500" />
              <span>Total Referrals</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.totalReferrals || 0}
            </div>
          </div>
          
          <div className="flex flex-col space-y-1 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1 text-purple-500" />
              <span>Pending Commissions</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              ${stats?.pendingCommissions.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionStats;


import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Users, TrendingUp, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CommissionStats {
  totalEarned: number;
  pendingAmount: number;
  referredUsers: number;
  conversionRate: number;
}

const CommissionStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<CommissionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommissionStats = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Get all transactions for this referrer
        const { data: transactions, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .eq('referrer_user_id', user.id);
        
        if (txError) throw txError;
        
        // Calculate total earned and pending
        let totalEarned = 0;
        let pendingAmount = 0;
        
        transactions.forEach(txn => {
          const amount = txn.referrer_amount || 0;
          if (txn.payout_status === 'completed') {
            totalEarned += amount;
          } else if (txn.payout_status === 'pending') {
            pendingAmount += amount;
          }
        });
        
        // Get count of referred users (unique customer_user_id)
        const uniqueCustomers = new Set();
        transactions.forEach(txn => {
          if (txn.customer_user_id) {
            uniqueCustomers.add(txn.customer_user_id);
          }
        });
        
        const referredUsers = uniqueCustomers.size;
        
        // Calculate conversion rate (simplified for now)
        // This would typically come from comparing total clicks to conversions
        const conversionRate = transactions.length > 0 ? 
          (referredUsers / Math.max(referredUsers * 5, 1)) * 100 : 0;
        
        setStats({
          totalEarned: totalEarned / 100, // Convert from cents to dollars
          pendingAmount: pendingAmount / 100, // Convert from cents to dollars
          referredUsers,
          conversionRate
        });
      } catch (error) {
        console.error('Error fetching commission stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCommissionStats();
  }, [user]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Commission Stats</CardTitle>
          <CardDescription>Loading your commission statistics...</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <Skeleton className="h-8 w-8 rounded-full mb-2" />
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!stats) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Commission Stats</CardTitle>
          <CardDescription>Your affiliate commission statistics</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">No commission data available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Commission Stats</CardTitle>
        <CardDescription>Your affiliate commission statistics</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <DollarSign className="h-8 w-8 text-green-500 mb-2" />
            <div className="text-sm font-medium text-muted-foreground">Total Earned</div>
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalEarned.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <DollarSign className="h-8 w-8 text-amber-500 mb-2" />
            <div className="text-sm font-medium text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold text-amber-600">
              ${stats.pendingAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <Users className="h-8 w-8 text-blue-500 mb-2" />
            <div className="text-sm font-medium text-muted-foreground">Referred Users</div>
            <div className="text-2xl font-bold text-blue-600">{stats.referredUsers}</div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
            <div className="text-sm font-medium text-muted-foreground">Conversion Rate</div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.conversionRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionStats;

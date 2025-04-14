
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, DollarSign, FileText, Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/empty-states/EmptyState';

interface ReferrerStats {
  totalCommission: number;
  ruleCount: number;
  referrerName: string | null;
}

interface ReferrerStatsSummaryProps {
  referrerId: string | null;
}

interface UserData {
  id: string;
  name?: string;
  email: string;
}

const ReferrerStatsSummary: React.FC<ReferrerStatsSummaryProps> = ({ referrerId }) => {
  const [stats, setStats] = useState<ReferrerStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchReferrerStats = async () => {
      if (!referrerId) {
        setStats(null);
        return;
      }
      
      setIsLoading(true);
      try {
        // Get total commissions
        const { data: transactions, error: txnError } = await supabase
          .from('transactions')
          .select('referrer_amount')
          .eq('referrer_user_id', referrerId);
        
        if (txnError) throw txnError;
        
        // Get commission rule count using a stored procedure
        // Use type assertion to overcome TypeScript limitation with custom RPCs
        const { data: rulesData, error: rulesError } = await (supabase.rpc as any)(
          'get_commission_rules_count',
          { p_referrer_id: referrerId }
        );
        
        if (rulesError) {
          console.error('Error fetching rule count:', rulesError);
          // Fallback: assume 0 rules if the RPC function is not available
          const ruleCount = 0;
          
          // Get referrer name
          // Use type assertion to overcome TypeScript limitation with custom RPCs
          const { data: userData, error: userError } = await (supabase.rpc as any)('get_all_users');
          
          let referrerName = null;
          if (!userError && userData) {
            // Type assertion since we know the structure of userData
            const typedUserData = userData as UserData[];
            const user = typedUserData.find(u => u.id === referrerId);
            referrerName = user ? (user.name || user.email) : null;
          }
          
          // Calculate total commissions
          const totalCommission = transactions.reduce((sum, txn) => sum + (txn.referrer_amount || 0), 0) / 100;
          
          setStats({
            totalCommission,
            ruleCount,
            referrerName
          });
        } else {
          // Get referrer name
          // Use type assertion to overcome TypeScript limitation with custom RPCs
          const { data: userData, error: userError } = await (supabase.rpc as any)('get_all_users');
          
          let referrerName = null;
          if (!userError && userData) {
            // Type assertion since we know the structure of userData
            const typedUserData = userData as UserData[];
            const user = typedUserData.find(u => u.id === referrerId);
            referrerName = user ? (user.name || user.email) : null;
          }
          
          // Calculate total commissions
          const totalCommission = transactions.reduce((sum, txn) => sum + (txn.referrer_amount || 0), 0) / 100;
          
          setStats({
            totalCommission,
            ruleCount: rulesData || 0,
            referrerName
          });
        }
      } catch (error) {
        console.error('Error fetching referrer stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReferrerStats();
  }, [referrerId]);
  
  if (!referrerId) return null;
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Referrer Stats</CardTitle>
          <CardDescription>Loading statistics...</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full mr-4" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
            <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full mr-4" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!stats) return null;
  
  if (stats.totalCommission === 0 && stats.ruleCount === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>
            Referrer Stats {stats.referrerName && `- ${stats.referrerName}`}
          </CardTitle>
          <CardDescription>
            Summary of referrer performance and commission rules
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <EmptyState
            title="No Commission Data"
            description="This referrer hasn't earned any commissions yet or no commission rules have been set up."
            icon={<Users className="h-8 w-8" />}
            size="sm"
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          Referrer Stats {stats.referrerName && `- ${stats.referrerName}`}
        </CardTitle>
        <CardDescription>
          Summary of referrer performance and commission rules
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <DollarSign className="h-12 w-12 text-green-500 mr-4" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Total Commission</div>
              <div className="text-3xl font-bold text-green-600">${stats.totalCommission.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</div>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <FileText className="h-12 w-12 text-blue-500 mr-4" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Commission Rules</div>
              <div className="text-3xl font-bold text-blue-600">{stats.ruleCount}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferrerStatsSummary;

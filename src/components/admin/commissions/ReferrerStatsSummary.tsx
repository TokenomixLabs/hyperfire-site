
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, DollarSign, FileText } from 'lucide-react';

interface ReferrerStats {
  totalCommission: number;
  ruleCount: number;
  referrerName: string | null;
}

interface ReferrerStatsSummaryProps {
  referrerId: string | null;
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
        
        // Get commission rule count
        const { data: rules, error: rulesError } = await supabase
          .from('commission_rules')
          .select('id')
          .eq('referrer_id', referrerId);
        
        if (rulesError) throw rulesError;
        
        // Get referrer name
        const { data: userData, error: userError } = await supabase.rpc('get_all_users');
        
        let referrerName = null;
        if (!userError && userData) {
          const user = userData.find((u: any) => u.id === referrerId);
          referrerName = user ? (user.name || user.email) : null;
        }
        
        // Calculate total commissions
        const totalCommission = transactions.reduce((sum, txn) => sum + (txn.referrer_amount || 0), 0) / 100;
        
        setStats({
          totalCommission,
          ruleCount: rules.length,
          referrerName
        });
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
        <CardContent className="pt-2 flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  if (!stats) return null;
  
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
              <div className="text-3xl font-bold text-green-600">${stats.totalCommission.toFixed(2)}</div>
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

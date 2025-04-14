
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { Loader2, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/empty-states/EmptyState';

interface TransactionMetadata {
  customer_email?: string;
  line_items?: Array<{
    description?: string;
    amount?: number;
  }>;
  [key: string]: any;
}

interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  currency: string;
  referrer_amount: number;
  payout_status: string;
  metadata: TransactionMetadata | null;
  customer_email?: string;
  product_name?: string;
  funnel_id?: string;
}

interface RawTransaction {
  id: string;
  created_at: string;
  amount: number;
  currency: string;
  referrer_amount: number;
  payout_status: string;
  metadata: any;
  funnel_id?: string;
  [key: string]: any;
}

const ReferralTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('referrer_user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        const processedTransactions: Transaction[] = (data as RawTransaction[]).map(txn => {
          let metadataObj: TransactionMetadata | null = null;
          
          if (txn.metadata) {
            if (typeof txn.metadata === 'string') {
              try {
                metadataObj = JSON.parse(txn.metadata);
              } catch (e) {
                metadataObj = null;
              }
            } else {
              metadataObj = txn.metadata;
            }
          }
          
          const customerEmail = metadataObj?.customer_email || 'Anonymous';
          
          const lineItems = metadataObj?.line_items || [];
          const productName = lineItems[0]?.description || 'Product Purchase';
          
          return {
            ...txn,
            customer_email: customerEmail,
            product_name: productName,
            metadata: metadataObj
          };
        });
        
        setTransactions(processedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [user]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Referrals</CardTitle>
          <CardDescription>Loading your recent referrals</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Referrals</CardTitle>
          <CardDescription>Your most recent referral transactions</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <EmptyState
            title="No Referrals Yet"
            description="Share your referral link with your network to start earning commissions."
            icon={<Users className="h-8 w-8" />}
            size="md"
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Referrals</CardTitle>
        <CardDescription>Your most recent referral transactions</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium">
                    {format(parseISO(txn.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate" title={txn.customer_email}>
                    {txn.customer_email}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={txn.product_name}>
                    {txn.product_name}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${(txn.referrer_amount / 100).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {txn.payout_status === 'completed' ? (
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                        Paid
                      </Badge>
                    ) : txn.payout_status === 'pending' ? (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        Pending
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                        Failed
                      </Badge>
                    )}
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

export default ReferralTransactions;

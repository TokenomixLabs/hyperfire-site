
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { Loader2 } from 'lucide-react';

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
        
        // Process transactions to format data nicely
        const processedTransactions = data.map(txn => {
          // Extract customer email from metadata if available
          const metadataObj = typeof txn.metadata === 'string' ? JSON.parse(txn.metadata) : txn.metadata;
          const customerEmail = metadataObj?.customer_email || 'Anonymous';
          
          // Extract product name from metadata if available
          const lineItems = metadataObj?.line_items || [];
          const productName = lineItems[0]?.description || 'Product Purchase';
          
          return {
            ...txn,
            customer_email: customerEmail,
            product_name: productName
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
        <CardContent className="pt-2 flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">You haven't received any referrals yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Share your referral link to start earning commissions!
            </p>
          </div>
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

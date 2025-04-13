
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Check, 
  RefreshCw, 
  Search, 
  ChevronDown, 
  FileText, 
  User,
  ArrowUpRight,
  Timer,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { StripePaymentWithReferral } from '@/types/stripe';

// Mock data for payments
const mockPayments: StripePaymentWithReferral[] = [
  {
    id: 'py_1AbcDef123456',
    amount: 4900,
    currency: 'usd',
    status: 'succeeded',
    created: 1681234567,
    customer: 'cus_AbcDef123456',
    description: 'Premium Subscription - Monthly',
    payment_method_details: {
      card: {
        brand: 'visa',
        last4: '4242',
        exp_month: 12,
        exp_year: 2025
      }
    },
    referralInfo: {
      referrerId: '1',
      referrerName: 'John Smith',
      platformOrigin: 'insiderlife',
      commissionRate: 80,
      commissionAmount: 3920,
      transferId: 'tr_1AbcDef123456'
    }
  },
  {
    id: 'py_2AbcDef123456',
    amount: 19900,
    currency: 'usd',
    status: 'succeeded',
    created: 1684234567,
    customer: 'cus_XyzDef123456',
    description: 'VIP Subscription - Monthly',
    payment_method_details: {
      card: {
        brand: 'mastercard',
        last4: '5555',
        exp_month: 6,
        exp_year: 2024
      }
    },
    referralInfo: {
      referrerId: '3',
      referrerName: 'Michael Brown',
      platformOrigin: 'insiderdao',
      commissionRate: 85,
      commissionAmount: 16915,
      transferId: 'tr_2AbcDef123456'
    }
  },
  {
    id: 'py_3AbcDef123456',
    amount: 4900,
    currency: 'usd',
    status: 'succeeded',
    created: 1682234567,
    customer: 'cus_GhiDef123456',
    description: 'Premium Subscription - Monthly',
    payment_method_details: {
      card: {
        brand: 'amex',
        last4: '0005',
        exp_month: 4,
        exp_year: 2026
      }
    }
  },
  {
    id: 'py_4AbcDef123456',
    amount: 9900,
    currency: 'usd',
    status: 'pending',
    created: 1685234567,
    customer: 'cus_JklDef123456',
    description: 'Digital Product - Crypto Signal Package',
    referralInfo: {
      referrerId: '2',
      referrerName: 'Sarah Johnson',
      platformOrigin: 'societi',
      commissionRate: 75,
      commissionAmount: 7425,
      transferId: null // Transfer pending
    }
  }
];

const PaymentsManager = () => {
  const [payments, setPayments] = useState<StripePaymentWithReferral[]>(mockPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };
  
  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Refreshed",
        description: "Payments list has been refreshed.",
      });
      
    } catch (error) {
      console.error("Error refreshing payments:", error);
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing the payments list.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleIssueRefund = async (paymentId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPayments(prev => 
        prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, refunded: true, refunded_amount: payment.amount }
            : payment
        )
      );
      
      toast({
        title: "Refund Issued",
        description: `Payment ${paymentId} has been refunded.`,
      });
      
    } catch (error) {
      console.error("Error issuing refund:", error);
      toast({
        title: "Refund Failed",
        description: "There was an error issuing the refund.",
        variant: "destructive"
      });
    }
  };
  
  const filteredPayments = searchQuery
    ? payments.filter(payment => 
        payment.id.includes(searchQuery) ||
        payment.customer.includes(searchQuery) ||
        payment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.referralInfo?.referrerName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : payments;
  
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency.toUpperCase() 
    }).format(amount / 100);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment History</span>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </CardTitle>
        <CardDescription>
          View and manage payments and commissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            placeholder="Search by payment ID, customer, or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Referral</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className={payment.refunded ? 'bg-gray-50 text-muted-foreground' : ''}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium truncate max-w-[150px]">
                        {payment.description || 'Payment'}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">{payment.id}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(payment.created * 1000), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm truncate max-w-[150px]">{payment.customer}</div>
                    {payment.payment_method_details?.card && (
                      <div className="text-xs text-muted-foreground">
                        {payment.payment_method_details.card.brand.toUpperCase()} •••• {payment.payment_method_details.card.last4}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {formatAmount(payment.amount, payment.currency)}
                    </div>
                    {payment.refunded && (
                      <div className="text-xs text-red-500">
                        Refunded: {formatAmount(payment.refunded_amount || payment.amount, payment.currency)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {payment.referralInfo ? (
                      <div className="flex flex-col">
                        <span className="text-sm">{payment.referralInfo.referrerName}</span>
                        <span className="text-xs text-muted-foreground">
                          Commission: {formatAmount(payment.referralInfo.commissionAmount || 0, payment.currency)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Rate: {payment.referralInfo.commissionRate}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No referral</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {payment.refunded ? (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Refunded
                      </Badge>
                    ) : payment.status === 'succeeded' ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Check className="mr-1 h-3 w-3" /> Completed
                      </Badge>
                    ) : payment.status === 'pending' ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Timer className="mr-1 h-3 w-3" /> Pending
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <AlertTriangle className="mr-1 h-3 w-3" /> Failed
                      </Badge>
                    )}
                    
                    {payment.referralInfo?.transferId ? (
                      <div className="text-xs text-green-600 mt-1">
                        Commission paid
                      </div>
                    ) : payment.referralInfo ? (
                      <div className="text-xs text-amber-600 mt-1">
                        Commission pending
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0">
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => console.log('View details')}
                          className="cursor-pointer"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => console.log('View customer')}
                          className="cursor-pointer"
                        >
                          <User className="mr-2 h-4 w-4" />
                          View Customer
                        </DropdownMenuItem>
                        {payment.referralInfo?.transferId && (
                          <DropdownMenuItem 
                            onClick={() => console.log('View transfer')}
                            className="cursor-pointer"
                          >
                            <ArrowUpRight className="mr-2 h-4 w-4" />
                            View Transfer
                          </DropdownMenuItem>
                        )}
                        {!payment.refunded && payment.status === 'succeeded' && (
                          <DropdownMenuItem 
                            onClick={() => handleIssueRefund(payment.id)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                          >
                            Issue Refund
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No payments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentsManager;

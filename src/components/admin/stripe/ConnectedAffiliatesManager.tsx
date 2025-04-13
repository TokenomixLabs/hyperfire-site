
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  Search, 
  RefreshCw, 
  ChevronDown, 
  User,
  Tag
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

// Mock data for connected affiliates
const mockAffiliates = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    stripeAccountId: 'acct_1AbCdEfGhIjKlMnO',
    stripeAccountStatus: 'active',
    commissionRate: 80,
    stripeAccountDetails: {
      chargesEnabled: true,
      payoutsEnabled: true,
      detailsSubmitted: true,
      lastVerificationDate: '2023-05-15T10:00:00Z'
    },
    createdAt: '2023-01-10T08:30:00Z',
    totalEarned: 2450.75,
    totalReferrals: 24
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    stripeAccountId: 'acct_2AbCdEfGhIjKlMnO',
    stripeAccountStatus: 'pending',
    commissionRate: 75,
    stripeAccountDetails: {
      chargesEnabled: false,
      payoutsEnabled: false,
      detailsSubmitted: true,
      lastVerificationDate: '2023-06-20T14:45:00Z'
    },
    createdAt: '2023-02-15T11:20:00Z',
    totalEarned: 875.50,
    totalReferrals: 12
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    stripeAccountId: 'acct_3AbCdEfGhIjKlMnO',
    stripeAccountStatus: 'active',
    commissionRate: 85,
    stripeAccountDetails: {
      chargesEnabled: true,
      payoutsEnabled: true,
      detailsSubmitted: true,
      lastVerificationDate: '2023-04-10T09:15:00Z'
    },
    createdAt: '2023-01-05T16:40:00Z',
    totalEarned: 5125.25,
    totalReferrals: 47
  }
];

const ConnectedAffiliatesManager = () => {
  const [affiliates, setAffiliates] = useState(mockAffiliates);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would filter from the API
    // For now, we'll just filter the mock data
    
    console.log("Searching for:", searchQuery);
  };
  
  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Refreshed",
        description: "Connected affiliates list has been refreshed.",
      });
      
    } catch (error) {
      console.error("Error refreshing affiliates:", error);
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing the affiliates list.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateCommissionRate = (affiliateId: string, newRate: number) => {
    setAffiliates(prev => 
      prev.map(affiliate => 
        affiliate.id === affiliateId 
          ? { ...affiliate, commissionRate: newRate }
          : affiliate
      )
    );
    
    toast({
      title: "Commission Rate Updated",
      description: `Commission rate has been set to ${newRate}%.`,
    });
  };
  
  const filteredAffiliates = searchQuery 
    ? affiliates.filter(affiliate => 
        affiliate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        affiliate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        affiliate.stripeAccountId.includes(searchQuery)
      )
    : affiliates;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Connected Affiliates</span>
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
          Manage affiliate accounts connected via Stripe Connect
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            placeholder="Search by name, email or account ID"
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
                <TableHead>Affiliate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead className="hidden md:table-cell">Connected On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAffiliates.map((affiliate) => (
                <TableRow key={affiliate.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{affiliate.name}</span>
                      <span className="text-sm text-muted-foreground">{affiliate.email}</span>
                      <span className="text-xs font-mono text-muted-foreground">{affiliate.stripeAccountId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {affiliate.stripeAccountStatus === 'active' && affiliate.stripeAccountDetails.chargesEnabled ? (
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                        <AlertTriangle className="mr-1 h-3 w-3" /> Pending
                      </Badge>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {affiliate.totalReferrals} referrals
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{affiliate.commissionRate}%</div>
                    <div className="text-xs text-muted-foreground">
                      ${affiliate.totalEarned.toFixed(2)} earned
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(affiliate.createdAt), 'MMM d, yyyy')}
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
                          onClick={() => window.open(`https://dashboard.stripe.com/connect/accounts/${affiliate.stripeAccountId}`, '_blank')}
                          className="cursor-pointer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View in Stripe
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => console.log('View profile')}
                          className="cursor-pointer"
                        >
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateCommissionRate(affiliate.id, 90)}
                          className="cursor-pointer"
                        >
                          <Tag className="mr-2 h-4 w-4" />
                          Set Commission (90%)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateCommissionRate(affiliate.id, 80)}
                          className="cursor-pointer"
                        >
                          <Tag className="mr-2 h-4 w-4" />
                          Set Commission (80%)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateCommissionRate(affiliate.id, 70)}
                          className="cursor-pointer"
                        >
                          <Tag className="mr-2 h-4 w-4" />
                          Set Commission (70%)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAffiliates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No affiliates found
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

export default ConnectedAffiliatesManager;

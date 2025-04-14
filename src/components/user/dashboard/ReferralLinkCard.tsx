
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ReferralLinkCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Create the referral link based on user ID
  const referralLink = user ? `https://hyperfire.io/?referrer=${user.id}` : '';
  
  const handleCopy = async () => {
    if (!referralLink) return;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Referral link copied to clipboard",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <LinkIcon className="mr-2 h-5 w-5 text-blue-500" />
          Your Referral Link
        </CardTitle>
        <CardDescription>
          Share this link with others to earn commission
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex space-x-2">
          <Input
            value={referralLink}
            readOnly
            className="font-mono text-sm"
          />
          <Button 
            onClick={handleCopy}
            variant="outline"
            size="icon"
            className={copied ? "bg-green-50 text-green-700 border-green-200" : ""}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          When someone signs up through your link, you'll earn commission on their purchases.
        </p>
      </CardContent>
    </Card>
  );
};

export default ReferralLinkCard;

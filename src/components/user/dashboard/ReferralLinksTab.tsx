
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Copy, BarChart2, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReferralPlatform } from "@/context/ReferralContext";

interface ReferralLink {
  platform: ReferralPlatform;
  url: string;
  isSet: boolean;
}

interface ReferralLinksTabProps {
  referralLinks: ReferralLink[];
  updateReferralLink: (platform: ReferralPlatform, url: string) => void;
}

// Helper to get platform display name
const getPlatformDisplayName = (platform: ReferralPlatform): string => {
  switch (platform) {
    case 'insiderlife': return 'InsiderLife';
    case 'insiderdao': return 'InsiderDAO';
    case 'societi': return 'Societi';
    case 'aifc': return 'AI Freedom Code';
    default: return platform;
  }
};

// Helper to get platform help URL
const getPlatformHelpUrl = (platform: ReferralPlatform): string => {
  switch (platform) {
    case 'insiderdao': return 'https://insiderdao.com/referrals';
    case 'societi': return 'https://societi.com/get-referral-link';
    case 'aifc': return 'https://aifc.com/referral-program';
    default: return '#';
  }
};

// Helper to get platform instructions
const getPlatformInstructions = (platform: ReferralPlatform): string => {
  switch (platform) {
    case 'insiderdao': return 'Log in to InsiderDAO, go to Profile > Referrals, and copy your unique link';
    case 'societi': return 'Visit the Societi Partner dashboard, navigate to Referrals tab, and copy your link';
    case 'aifc': return 'Go to AI Freedom Code members area > Affiliate Program and copy your custom link';
    default: return '';
  }
};

const ReferralLinksTab = ({ referralLinks, updateReferralLink }: ReferralLinksTabProps) => {
  const [referralInputs, setReferralInputs] = useState<Record<ReferralPlatform, string>>(
    referralLinks.reduce((acc, link) => ({
      ...acc,
      [link.platform]: link.url
    }), {} as Record<ReferralPlatform, string>)
  );
  
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopyLink = (link: string, type: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: `${type} referral link copied to clipboard`,
    });
  };

  const handleUpdateReferralLink = (platform: ReferralPlatform) => {
    const url = referralInputs[platform];
    
    // Simple validation for referral links
    if (url && !url.includes('ref=') && !url.includes('referral=')) {
      toast({
        title: "Invalid referral link",
        description: "The link doesn't appear to be a valid referral link. It should contain 'ref=' or 'referral=' parameter.",
        variant: "destructive"
      });
      return;
    }
    
    updateReferralLink(platform, url);
    
    toast({
      title: `${getPlatformDisplayName(platform)} Link Updated`,
      description: `Your ${getPlatformDisplayName(platform)} referral link has been saved`,
    });
  };
  
  const handleInputChange = (platform: ReferralPlatform, value: string) => {
    setReferralInputs(prev => ({
      ...prev,
      [platform]: value
    }));
  };
  
  const toggleExpandInfo = (platform: ReferralPlatform) => {
    if (expandedInfo === platform) {
      setExpandedInfo(null);
    } else {
      setExpandedInfo(platform);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activate Your Signal Engine</CardTitle>
        <CardDescription>
          Set up your referral links across all platforms to maximize your impact
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {referralLinks.map(link => (
          <div key={link.platform} className="space-y-3 pb-5 border-b last:border-b-0 last:pb-0">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center">
                <h3 className="font-medium">{getPlatformDisplayName(link.platform)} Referral Link</h3>
                {link.isSet ? (
                  <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-500">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Saved
                  </span>
                ) : (
                  <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Not Set
                  </span>
                )}
              </div>
              
              {link.platform !== 'insiderlife' && (
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a 
                          href={getPlatformHelpUrl(link.platform)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                        >
                          Get Link
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Learn how to get your {getPlatformDisplayName(link.platform)} referral link</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpandInfo(link.platform)}
                    className="text-sm text-muted-foreground flex items-center"
                  >
                    <Info className="h-3.5 w-3.5 mr-1" />
                    Help
                  </Button>
                </div>
              )}
            </div>
            
            {expandedInfo === link.platform && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm text-blue-700 dark:text-blue-300 my-2">
                <h4 className="font-medium mb-1">How to get your {getPlatformDisplayName(link.platform)} referral link:</h4>
                <p>{getPlatformInstructions(link.platform)}</p>
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-1.5">
              <Input 
                id={`${link.platform}-link`}
                value={referralInputs[link.platform] || ''}
                onChange={(e) => handleInputChange(link.platform, e.target.value)}
                className="font-mono text-sm"
                placeholder={`Enter ${getPlatformDisplayName(link.platform)} referral link`}
                readOnly={link.platform === 'insiderlife'} // InsiderLife link is auto-generated
              />
              
              <div className="flex space-x-2">
                {link.isSet && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleCopyLink(link.url, getPlatformDisplayName(link.platform))}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
                
                {link.platform !== 'insiderlife' && (
                  referralInputs[link.platform] !== link.url ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateReferralLink(link.platform)}
                    >
                      Save
                    </Button>
                  ) : null
                )}
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-1.5">
              {link.platform === 'insiderlife' 
                ? 'Your InsiderLife link is automatically generated and added to all content you share.'
                : `Use this link to track your ${getPlatformDisplayName(link.platform)} referrals.`}
            </p>
          </div>
        ))}
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-6">
          <h3 className="font-medium text-blue-700 dark:text-blue-400 flex items-center">
            <BarChart2 className="h-5 w-5 mr-2" />
            Signal Amplification Guide
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
            Your links are automatically added when you share content. When content includes a CTA for a specific platform 
            (like InsiderDAO), your personal referral link for that platform will be used to give you credit for conversions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralLinksTab;

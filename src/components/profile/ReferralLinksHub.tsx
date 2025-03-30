
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { ReferralPlatform } from '@/context/ReferralContext';

interface ReferralLinksHubProps {
  referralLinks?: Record<ReferralPlatform, string>;
}

const ReferralLinksHub: React.FC<ReferralLinksHubProps> = ({ referralLinks = {} }) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  const platformInfo: Record<ReferralPlatform, { name: string, color: string }> = {
    insiderlife: { name: 'Insider Life', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    insiderdao: { name: 'Insider DAO', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    societi: { name: 'Societi', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    aifc: { name: 'AI Freedom Code', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2000);
  };
  
  const activeLinks = Object.entries(referralLinks).filter(([_, url]) => url && url.trim() !== '') as [ReferralPlatform, string][];

  return (
    <div className="space-y-4">
      {activeLinks.length > 0 ? (
        activeLinks.map(([platform, url]) => (
          <Card key={platform} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                <div>
                  <Badge variant="secondary" className={platformInfo[platform as ReferralPlatform].color}>
                    {platformInfo[platform as ReferralPlatform].name}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(url)}
                    className="h-8 px-2"
                  >
                    {copiedLink === url ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(url, '_blank')}
                    className="h-8 px-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 break-all p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                {url}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No referral links set up yet
        </div>
      )}
    </div>
  );
};

export default ReferralLinksHub;

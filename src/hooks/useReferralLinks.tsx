
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ReferralLink } from '@/types/referral';
import { ReferralPlatform } from '@/context/ReferralContext';

export const useReferralLinks = () => {
  const { toast } = useToast();
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([
    { platform: 'insiderlife' as ReferralPlatform, url: "insiderlife.com/?ref=your-username", isSet: true },
    { platform: 'insiderdao' as ReferralPlatform, url: "insiderdao.com/?ref=your-username", isSet: true },
    { platform: 'societi' as ReferralPlatform, url: "societi.com/?ref=your-username", isSet: true },
    { platform: 'aifc' as ReferralPlatform, url: "aifc.com/?ref=your-username", isSet: true }
  ]);

  // Load saved referral links from localStorage if available
  useEffect(() => {
    try {
      const savedLinks = localStorage.getItem('referralLinks');
      if (savedLinks) {
        setReferralLinks(JSON.parse(savedLinks));
      }
    } catch (error) {
      console.error('Failed to load saved referral links:', error);
    }
  }, []);

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: "Link Copied",
        description: "Referral link copied to clipboard!",
        duration: 3000,
      });
    });
  };

  const updateReferralLink = (platform: ReferralPlatform, url: string) => {
    const updatedLinks = referralLinks.map(link => 
      link.platform === platform 
        ? { ...link, url, isSet: url.trim() !== '' } 
        : link
    );
    
    setReferralLinks(updatedLinks);
    
    try {
      localStorage.setItem('referralLinks', JSON.stringify(updatedLinks));
      toast({
        title: "Link Updated",
        description: `Your ${platform} referral link has been updated.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to save referral links:', error);
      toast({
        title: "Error",
        description: "Failed to save your referral link. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return {
    referralLinks,
    handleCopyLink,
    updateReferralLink
  };
};

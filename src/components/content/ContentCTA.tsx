
import React, { useEffect, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReferral } from '@/context/ReferralContext';
import { ReferralPlatform } from '@/context/ReferralContext';
import { ContentCTA as ContentCTAType } from '@/types/referral';
import useReferralTracking from '@/hooks/useReferralTracking';

interface ContentCTAProps {
  cta: ContentCTAType;
  contentTitle: string; // For tracking purposes
  campaignName: string;
  platformId: ReferralPlatform;
  dismissible?: boolean;
}

const ContentCTA: React.FC<ContentCTAProps> = ({
  cta,
  contentTitle,
  campaignName,
  platformId,
  dismissible = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const storageKey = `content-cta-dismissed-${cta.id}`;
  const { referralLinks, trackClick, userReferralCode, referrer } = useReferral();
  const { getCurrentReferrer, getReferralPlatform } = useReferralTracking();

  useEffect(() => {
    if (dismissible) {
      const isDismissed = localStorage.getItem(storageKey) === 'true';
      setIsVisible(!isDismissed);
    }
  }, [dismissible, storageKey]);

  const handleDismiss = () => {
    if (dismissible) {
      localStorage.setItem(storageKey, 'true');
      setIsVisible(false);
    }
  };

  const handleButtonClick = () => {
    trackClick(`${contentTitle}-${cta.id}`, platformId);
  };
  
  const getReferralUrl = () => {
    // Priority 1: If viewer came from a referral link, use the referrer's link
    const currentReferrer = getCurrentReferrer();
    const referralPlatform = getReferralPlatform();
    
    // Check if the CTA is for the same platform the user was referred from
    if (currentReferrer && referralPlatform === platformId) {
      // Use the referrer's link for this platform
      return `https://${platformId}.com/?ref=${currentReferrer}`;
    }
    
    // Priority 2: If viewer is logged in and has a link for this platform, use it
    if (userReferralCode) {
      const link = referralLinks.find(l => l.platform === platformId);
      if (link && link.isSet) {
        return link.url;
      }
      
      // If user has a code but no specific link for this platform, 
      // create a default one using their referral code
      return `https://${platformId}.com/?ref=${userReferralCode}`;
    }
    
    // Priority 3: Fallback to default admin link
    return `https://${platformId}.com/`;
  };

  const getBrandStyles = () => {
    switch (platformId) {
      case 'insiderlife':
        return 'from-insider-600 to-insider-800 border-insider-500';
      case 'insiderdao':
        return 'from-purple-600 to-purple-800 border-purple-500';
      case 'societi':
        return 'from-green-600 to-green-800 border-green-500';
      case 'aifc':
        return 'from-orange-600 to-orange-800 border-orange-500';
      default:
        return 'from-gray-700 to-gray-900 border-gray-600';
    }
  };

  const getThemeStyles = () => {
    switch (cta.theme) {
      case 'primary':
        return `bg-gradient-to-r ${getBrandStyles()} text-white`;
      case 'minimal':
        return 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100';
      default:
        return 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800';
    }
  };

  if (!isVisible) return null;

  // Render different layouts based on placement
  switch (cta.placement) {
    case 'banner':
      return (
        <div 
          className={`my-6 relative transition-all duration-500 shadow-md ${
            isVisible ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
          }`}
        >
          <div className={`py-4 px-4 sm:px-6 ${getThemeStyles()} border dark:border rounded-md`}>
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-4 sm:mb-0 text-center sm:text-left">
                <h3 className="font-semibold">{cta.buttonText}</h3>
                <p className="text-sm opacity-90 mt-1">{cta.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  className={`transition-all ${cta.theme === 'primary' ? 'bg-white text-insider-700 hover:bg-gray-100' : 'bg-insider-600 hover:bg-insider-700 text-white'}`}
                  asChild
                  onClick={handleButtonClick}
                >
                  <a href={getReferralUrl()} target="_blank" rel="noreferrer" className="flex items-center">
                    {cta.buttonText}
                    <ChevronRight size={16} className="ml-1.5" />
                  </a>
                </Button>
                {dismissible && (
                  <button 
                    onClick={handleDismiss}
                    className="rounded-full p-2 hover:bg-gray-200/20 dark:hover:bg-gray-700/20 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'card':
      return (
        <div className={`my-6 rounded-lg overflow-hidden transition-all duration-300 border ${getThemeStyles()}`}>
          {dismissible && (
            <div className="flex justify-end p-2">
              <button 
                onClick={handleDismiss}
                className="rounded-full p-1 hover:bg-gray-200/20 dark:hover:bg-gray-700/20 transition-colors"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="p-5">
            <h3 className="font-semibold mb-2">{cta.buttonText}</h3>
            <p className="text-sm opacity-90 mb-4">{cta.description}</p>
            <Button 
              className={`w-full justify-center transition-all ${cta.theme === 'primary' ? 'bg-white text-insider-700 hover:bg-gray-100' : 'bg-insider-600 hover:bg-insider-700 text-white'}`}
              asChild
              onClick={handleButtonClick}
            >
              <a href={getReferralUrl()} target="_blank" rel="noreferrer" className="flex items-center">
                {cta.buttonText}
                <ChevronRight size={16} className="ml-1.5" />
              </a>
            </Button>
          </div>
        </div>
      );
    
    case 'inline':
    default:
      return (
        <div className={`my-6 rounded-lg p-4 transition-all duration-300 flex items-center space-x-4 border ${getThemeStyles()}`}>
          <div className="flex-1">
            <h3 className="font-semibold">{cta.buttonText}</h3>
            <p className="text-sm opacity-90 mt-1">{cta.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              className={`transition-all ${cta.theme === 'primary' ? 'bg-white text-insider-700 hover:bg-gray-100' : 'bg-insider-600 hover:bg-insider-700 text-white'}`}
              asChild
              onClick={handleButtonClick}
            >
              <a href={getReferralUrl()} target="_blank" rel="noreferrer" className="flex items-center">
                {cta.buttonText}
                <ChevronRight size={16} className="ml-1.5" />
              </a>
            </Button>
            {dismissible && (
              <button 
                onClick={handleDismiss}
                className="rounded-full p-2 hover:bg-gray-200/20 dark:hover:bg-gray-700/20 transition-colors"
                aria-label="Dismiss"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      );
  }
};

export default ContentCTA;

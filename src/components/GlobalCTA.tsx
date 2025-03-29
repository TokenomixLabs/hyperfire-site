import { useEffect, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReferral } from '@/context/ReferralContext';
import { ReferralPlatform } from '@/context/ReferralContext';

export interface CTAProps {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  type: 'banner' | 'card' | 'inline';
  dismissible?: boolean;
  brand?: string;
  theme?: 'default' | 'primary' | 'minimal';
  position?: 'top' | 'bottom';
}

const GlobalCTA: React.FC<CTAProps> = ({
  id,
  title,
  description,
  buttonText,
  buttonUrl,
  type = 'banner',
  dismissible = true,
  brand = 'insiderlife',
  theme = 'default',
  position = 'bottom',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const storageKey = `cta-dismissed-${id}`;
  const { referralLinks, trackClick, generateReferralLink } = useReferral();

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

  const getBrandStyles = () => {
    switch (brand.toLowerCase()) {
      case 'insiderlife':
        return 'from-insider-600 to-insider-800 border-insider-500';
      case 'tokenomix':
        return 'from-blue-600 to-blue-800 border-blue-500';
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
    switch (theme) {
      case 'primary':
        return `bg-gradient-to-r ${getBrandStyles()} text-white`;
      case 'minimal':
        return 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100';
      default:
        return 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800';
    }
  };
  
  const handleButtonClick = () => {
    trackClick(id, brand as ReferralPlatform);
  };
  
  const getReferralUrl = () => {
    const platform = brand as ReferralPlatform;
    const link = referralLinks.find(l => l.platform === platform);
    
    if (link && link.isSet) {
      return generateReferralLink(buttonUrl, platform);
    }
    
    return buttonUrl;
  };

  if (!isVisible) return null;

  if (type === 'banner') {
    return (
      <div 
        className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-40 transition-all duration-500 shadow-lg ${
          isVisible ? 'translate-y-0' : position === 'top' ? '-translate-y-full' : 'translate-y-full'
        }`}
      >
        <div className={`py-4 px-4 sm:px-6 ${getThemeStyles()} border-t dark:border-t border-b dark:border-b`}>
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0 text-center sm:text-left">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm opacity-90 mt-1">{description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                className={`transition-all ${theme === 'primary' ? 'bg-white text-insider-700 hover:bg-gray-100' : 'bg-insider-600 hover:bg-insider-700 text-white'}`}
                asChild
                onClick={handleButtonClick}
              >
                <a href={getReferralUrl()} target="_blank" rel="noreferrer" className="flex items-center">
                  {buttonText}
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
  }

  if (type === 'card') {
    return (
      <div className={`rounded-lg overflow-hidden transition-all duration-300 border ${getThemeStyles()}`}>
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
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-sm opacity-90 mb-4">{description}</p>
          <Button 
            className={`w-full justify-center transition-all ${theme === 'primary' ? 'bg-white text-insider-700 hover:bg-gray-100' : 'bg-insider-600 hover:bg-insider-700 text-white'}`}
            asChild
            onClick={handleButtonClick}
          >
            <a href={getReferralUrl()} target="_blank" rel="noreferrer" className="flex items-center">
              {buttonText}
              <ChevronRight size={16} className="ml-1.5" />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-4 transition-all duration-300 flex items-center space-x-4 border ${getThemeStyles()}`}>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm opacity-90 mt-1">{description}</p>
      </div>
      <div className="flex items-center space-x-3">
        <Button 
          className={`transition-all ${theme === 'primary' ? 'bg-white text-insider-700 hover:bg-gray-100' : 'bg-insider-600 hover:bg-insider-700 text-white'}`}
          asChild
          onClick={handleButtonClick}
        >
          <a href={getReferralUrl()} target="_blank" rel="noreferrer" className="flex items-center">
            {buttonText}
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
};

export default GlobalCTA;

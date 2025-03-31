
import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMembership } from '@/context/MembershipContext';
import { TierLevel } from '@/types/membership';

interface UpgradeOverlayProps {
  title?: string;
  description?: string;
  requiredTier: TierLevel;
  children?: React.ReactNode;
  variant?: 'full' | 'inline' | 'modal';
  className?: string;
}

export const UpgradeOverlay: React.FC<UpgradeOverlayProps> = ({
  title,
  description,
  requiredTier,
  children,
  variant = 'full',
  className = '',
}) => {
  const { currentTier, tiers, getUpgradeUrl } = useMembership();
  
  // If user has access, just show the children
  if (tiers[currentTier].order >= tiers[requiredTier].order) {
    return <>{children}</>;
  }
  
  const requiredTierName = tiers[requiredTier].name;
  const requiredTierColor = tiers[requiredTier].color;
  
  const defaultTitle = `${requiredTierName} Access Required`;
  const defaultDescription = `Upgrade to ${requiredTierName} to unlock this feature.`;
  
  if (variant === 'inline') {
    return (
      <div className={`rounded-lg border p-4 bg-gray-50 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-8 h-8 rounded-full ${requiredTierColor} flex items-center justify-center`}>
            <Lock className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-medium">{title || defaultTitle}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{description || defaultDescription}</p>
        <Button 
          className={`${requiredTierColor} hover:opacity-90 text-white`}
          onClick={() => window.location.href = getUpgradeUrl(requiredTier)}
        >
          Upgrade to {requiredTierName} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  if (variant === 'modal') {
    return (
      <div className={`rounded-lg bg-white dark:bg-gray-800 shadow-lg p-6 max-w-md mx-auto ${className}`}>
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full ${requiredTierColor} mx-auto flex items-center justify-center mb-4`}>
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">{title || defaultTitle}</h2>
          <p className="text-muted-foreground mb-6">{description || defaultDescription}</p>
          <Button 
            className={`${requiredTierColor} hover:opacity-90 text-white w-full`}
            onClick={() => window.location.href = getUpgradeUrl(requiredTier)}
          >
            Upgrade to {requiredTierName}
          </Button>
        </div>
      </div>
    );
  }
  
  // Default: Full overlay
  return (
    <div className={`relative ${className}`}>
      {/* Blurred content */}
      <div className="opacity-20 blur-sm pointer-events-none">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm rounded-lg">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className={`w-16 h-16 rounded-full ${requiredTierColor} mx-auto flex items-center justify-center mb-4`}>
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">{title || defaultTitle}</h2>
          <p className="text-muted-foreground mb-6">{description || defaultDescription}</p>
          <Button 
            className={`${requiredTierColor} hover:opacity-90 text-white`}
            onClick={() => window.location.href = getUpgradeUrl(requiredTier)}
            size="lg"
          >
            Upgrade to {requiredTierName}
          </Button>
        </div>
      </div>
    </div>
  );
};

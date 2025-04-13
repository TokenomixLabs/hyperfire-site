
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMembership } from '@/context/MembershipContext';
import StripePricingModal from './StripePricingModal';
import { TierLevel } from '@/types/membership';

interface UpgradeButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  requiredTier?: TierLevel;
  showIcon?: boolean;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const UpgradeButton: React.FC<UpgradeButtonProps> = ({
  variant = 'default',
  size = 'default',
  requiredTier = 'premium',
  showIcon = true,
  fullWidth = false,
  className = '',
  children
}) => {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const { user } = useAuth();
  const { currentTier } = useMembership();
  
  // Convert required tier to the lowest tier that would satisfy the requirement
  const targetTier: 'premium' | 'vip' = 
    requiredTier === 'free' ? 'premium' :
    requiredTier === 'premium' ? 'premium' : 'vip';

  // If user already has required tier, don't show upgrade button
  const tierSatisfied = 
    (currentTier === 'premium' && (requiredTier === 'free' || requiredTier === 'premium')) ||
    (currentTier === 'vip' || currentTier === 'pro' || currentTier === 'lifetime' || currentTier === 'founders');

  if (tierSatisfied) {
    return <>{children}</>;
  }

  const openPricingModal = () => {
    setIsPricingOpen(true);
  };
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${fullWidth ? 'w-full' : ''} ${className}`}
        onClick={openPricingModal}
      >
        {showIcon && (targetTier === 'premium' ? (
          <Zap className="mr-2 h-4 w-4" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        ))}
        {children || `Upgrade to ${targetTier === 'premium' ? 'Premium' : 'VIP'}`}
      </Button>
      
      <StripePricingModal 
        open={isPricingOpen} 
        onOpenChange={setIsPricingOpen}
        defaultTier={targetTier}
      />
    </>
  );
};

export default UpgradeButton;

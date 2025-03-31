
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useMembership } from '@/context/MembershipContext';
import { TierLevel } from '@/types/membership';
import { Shield, Star, Sparkles } from 'lucide-react';

interface MembershipBadgeProps {
  tier?: TierLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

export const MembershipBadge: React.FC<MembershipBadgeProps> = ({
  tier,
  size = 'md',
  showIcon = true,
  showText = true,
  className = '',
}) => {
  const { currentTier, tiers } = useMembership();
  const tierToUse = tier || currentTier;
  const tierInfo = tiers[tierToUse];
  
  if (!tierInfo || tierToUse === 'free') return null;
  
  const getIconForTier = () => {
    switch (tierToUse) {
      case 'premium':
        return <Star className="h-3 w-3" />;
      case 'vip':
        return <Sparkles className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-0 px-1.5',
    md: 'text-xs py-0.5 px-2',
    lg: 'text-sm py-1 px-2.5',
  };
  
  return (
    <Badge 
      variant="outline" 
      className={`${tierInfo.color} text-white border-none ${sizeClasses[size]} ${className}`}
    >
      {showIcon && (
        <span className="mr-1">{getIconForTier()}</span>
      )}
      {showText && tierInfo.badge || tierInfo.name}
    </Badge>
  );
};


import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMembership } from '@/context/MembershipContext';
import { TierPermissions, TierLevel } from '@/types/membership';
import { UpgradeOverlay } from './UpgradeOverlay';

interface TierGuardProps {
  children: React.ReactNode;
  requiredTier?: TierLevel;
  requiredPermission?: keyof TierPermissions;
  fallback?: React.ReactNode;
  overlay?: boolean;
  redirect?: string;
}

export const TierGuard: React.FC<TierGuardProps> = ({
  children,
  requiredTier,
  requiredPermission,
  fallback,
  overlay = false,
  redirect,
}) => {
  const { hasPermission, tierDetails, tiers } = useMembership();
  
  // Check if user has required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Find the lowest tier that has this permission
    const lowestTierWithPermission = Object.values(tiers)
      .filter(tier => tier.permissions[requiredPermission])
      .sort((a, b) => a.order - b.order)[0];
    
    if (redirect) {
      return <Navigate to={redirect} replace />;
    }
    
    if (overlay) {
      return (
        <UpgradeOverlay 
          requiredTier={lowestTierWithPermission?.id as TierLevel || 'premium'}
          description={`This feature requires the ${requiredPermission} permission.`}
        >
          {children}
        </UpgradeOverlay>
      );
    }
    
    return fallback || <p>You need a higher tier to access this feature.</p>;
  }
  
  // Check if user has required tier
  if (requiredTier && tierDetails.order < tiers[requiredTier].order) {
    if (redirect) {
      return <Navigate to={redirect} replace />;
    }
    
    if (overlay) {
      return (
        <UpgradeOverlay requiredTier={requiredTier}>
          {children}
        </UpgradeOverlay>
      );
    }
    
    return fallback || <p>You need a higher tier to access this feature.</p>;
  }
  
  return <>{children}</>;
};

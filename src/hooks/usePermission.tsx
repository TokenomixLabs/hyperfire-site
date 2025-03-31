
import { useMembership } from '@/context/MembershipContext';
import { TierPermissions, TierLevel } from '@/types/membership';
import { useAuth } from '@/context/AuthContext';

export function usePermission() {
  const { hasPermission, tierDetails, getUpgradeUrl, canUpgrade } = useMembership();
  const { user } = useAuth();
  
  // Check if user has a specific permission
  const checkPermission = (permission: keyof TierPermissions) => {
    return hasPermission(permission);
  };
  
  // Check if user has the required tier
  const checkTier = (requiredTier: TierLevel) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    
    return tierDetails.id === requiredTier || canUpgrade(requiredTier) === false;
  };
  
  // Get the URL to upgrade to get a specific permission
  const getUpgradeUrlForPermission = (permission: keyof TierPermissions) => {
    // Find the lowest tier that has this permission
    const lowestTier = Object.values({ ...useMembership().tiers })
      .filter(tier => tier.permissions[permission])
      .sort((a, b) => a.order - b.order)[0];
    
    if (!lowestTier) return getUpgradeUrl();
    return getUpgradeUrl(lowestTier.id as TierLevel);
  };
  
  return {
    check: checkPermission,
    checkTier,
    getUpgradeUrlForPermission,
    isAdmin: user?.role === 'admin'
  };
}

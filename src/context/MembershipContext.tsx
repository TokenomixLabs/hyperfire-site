
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MembershipContext as MembershipContextType,
  TierLevel,
  TierPermissions,
  MembershipTier,
  UserMembership
} from '@/types/membership';
import { membershipTiers, getSortedVisibleTiers } from '@/config/membershipTiers';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Create context with default values
const MembershipContext = createContext<MembershipContextType>({
  currentTier: 'free',
  tierDetails: membershipTiers.tiers.free,
  isInTrial: false,
  trialEndsAt: undefined,
  expiresAt: undefined,
  tiers: membershipTiers.tiers,
  tiersList: getSortedVisibleTiers(),
  hasPermission: () => false,
  canUpgrade: () => false,
  getUpgradeUrl: () => '/pricing',
});

export const MembershipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  // Get current user's membership info
  const userMembership = user?.subscription || { tier: 'free' as TierLevel };
  
  // Compute current tier info
  const currentTier = userMembership.tier || 'free';
  const tierDetails = membershipTiers.tiers[currentTier] || membershipTiers.tiers.free;
  
  const isInTrial = !!userMembership.isInTrial;
  const trialEndsAt = userMembership.trialEndsAt;
  const expiresAt = userMembership.expiresAt;
  
  // Check if user has a specific permission
  const hasPermission = (permission: keyof TierPermissions): boolean => {
    if (!user) return false;
    
    // Admins have all permissions
    if (user.role === 'admin') return true;
    
    return !!tierDetails.permissions[permission];
  };
  
  // Check if a user can upgrade to a specific tier
  const canUpgrade = (toTier: TierLevel): boolean => {
    // Can't upgrade to current tier
    if (toTier === currentTier) return false;
    
    const currentOrder = tierDetails.order;
    const targetOrder = membershipTiers.tiers[toTier]?.order || 999;
    
    // Can only upgrade to higher tiers
    return targetOrder > currentOrder;
  };
  
  // Get URL for upgrading to a specific tier
  const getUpgradeUrl = (forTier?: TierLevel): string => {
    const tier = forTier || (getSortedVisibleTiers().find(t => t.order > tierDetails.order)?.id as TierLevel);
    return tier ? `/pricing?tier=${tier}` : '/pricing';
  };
  
  // Admin function to update a user's tier
  const updateUserTier = async (userId: string, tier: TierLevel): Promise<void> => {
    if (!user || user.role !== 'admin') {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to update user tiers",
        variant: "destructive"
      });
      throw new Error("Permission denied");
    }
    
    if (!membershipTiers.tiers[tier]) {
      toast({
        title: "Invalid Tier",
        description: `Tier "${tier}" does not exist`,
        variant: "destructive"
      });
      throw new Error("Invalid tier");
    }
    
    // In a real app, this would call an API to update the user's tier
    // For now, we'll just show a toast
    toast({
      title: "Tier Updated",
      description: `User has been upgraded to ${membershipTiers.tiers[tier].name}`,
      duration: 3000,
    });
    
    // If updating the current user, also update local state
    if (userId === user.id) {
      updateUserProfile({
        subscription: {
          ...userMembership,
          tier,
          updatedAt: new Date().toISOString()
        }
      });
    }
  };
  
  // Admin function to get users for a specific tier
  const getUsersForTier = async (tier: TierLevel): Promise<any[]> => {
    if (!user || user.role !== 'admin') {
      throw new Error("Permission denied");
    }
    
    // In a real app, this would call an API to get users by tier
    // For now, we'll return empty array
    return [];
  };
  
  const contextValue: MembershipContextType = {
    currentTier,
    tierDetails,
    isInTrial,
    trialEndsAt,
    expiresAt,
    tiers: membershipTiers.tiers,
    tiersList: getSortedVisibleTiers(),
    hasPermission,
    canUpgrade,
    getUpgradeUrl,
    // Only provide admin functions to admins
    ...(user?.role === 'admin' ? { updateUserTier, getUsersForTier } : {})
  };
  
  return (
    <MembershipContext.Provider value={contextValue}>
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembership = () => useContext(MembershipContext);

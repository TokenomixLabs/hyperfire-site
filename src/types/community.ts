
export interface Community {
  id: string;
  name: string;
  description?: string;
  subdomain: string;
  customDomain?: string;
  ownerId: string;
  ownerName?: string;
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    darkMode?: boolean;
  };
  membership?: {
    freeTier?: {
      name: string;
      isEnabled: boolean;
      features: string[];
    };
    premiumTier?: {
      name: string;
      isEnabled: boolean;
      price: number;
      features: string[];
      stripePriceId?: string;
    };
    vipTier?: {
      name: string;
      isEnabled: boolean;
      price: number;
      features: string[];
      stripePriceId?: string;
    };
  };
  status: 'draft' | 'pending' | 'active' | 'suspended';
  template?: string;
  members?: number;
  removeBranding?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityTemplate {
  id: string;
  name: string;
  description: string;
  starterThreads: number;
  signalSeries: number;
  courses: number;
  membershipTiers: number;
  thumbnailUrl?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityStats {
  totalMembers: number;
  activeMembers: number;
  totalThreads: number;
  totalSignalSeries: number;
  totalReferrals: number;
  growthRate?: number;
  periodStart?: string;
  periodEnd?: string;
}

export interface DomainVerification {
  domain: string;
  status: 'unverified' | 'pending' | 'verified' | 'failed';
  message?: string;
  verificationId?: string;
  dnsRecords?: {
    type: string;
    name: string;
    value: string;
  }[];
  createdAt: string;
  verifiedAt?: string;
}

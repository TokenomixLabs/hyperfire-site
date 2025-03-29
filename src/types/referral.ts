
import { ReferralPlatform } from "@/context/ReferralContext";

export interface ReferralProgram {
  id: string;
  name: string;
  platform: ReferralPlatform;
  description: string;
  linkFormat: string; // Example format for validation, e.g., "https://insiderdao.com/?ref={username}"
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ReferralLink {
  platform: ReferralPlatform;
  url: string;
  isSet: boolean;
}

export interface ReferralStats {
  clicks: number;
  signups: number;
  sharedContent: number;
}

export interface PlatformStats extends ReferralStats {
  platform: ReferralPlatform;
}

export interface CampaignCTA {
  id: string;
  programId: string;
  buttonText: string;
  description: string;
  theme?: 'default' | 'primary' | 'minimal';
  placement?: 'inline' | 'banner' | 'card';
  position?: 'top' | 'bottom';
}

export interface ContentCTA {
  id: string;
  contentId: string;
  campaignId: string;
  buttonText: string;
  description: string;
  theme?: 'default' | 'primary' | 'minimal';
  placement?: 'inline' | 'banner' | 'card';
  position?: 'top' | 'bottom';
}

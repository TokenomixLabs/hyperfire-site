
import { ReferralProgram } from '@/types/referral';

// Mock referral programs for demo
export const mockPrograms: ReferralProgram[] = [
  {
    id: "insiderdao",
    name: "InsiderDAO",
    platform: "insiderdao",
    description: "Crypto trading community and signals",
    linkFormat: "https://insiderdao.com/?ref={username}",
    logoUrl: "/logos/insiderdao.png",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "insiderlife",
    name: "InsiderLife",
    platform: "insiderlife",
    description: "Digital lifestyle community",
    linkFormat: "https://insiderlife.com/?ref={username}",
    logoUrl: "/logos/insiderlife.png",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "societi",
    name: "Societi",
    platform: "societi",
    description: "Social media optimization platform",
    linkFormat: "https://societi.com/?ref={username}",
    logoUrl: "/logos/societi.png",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "aifc",
    name: "AI Freedom Code",
    platform: "aifc",
    description: "AI development training program",
    linkFormat: "https://aifc.com/?ref={username}",
    logoUrl: "/logos/aifc.png",
    isActive: true,
    createdAt: new Date().toISOString()
  }
];


import React from 'react';
import ContentCTA from './ContentCTA';
import { ContentCTA as ContentCTAType } from '@/types/referral';
import { ReferralPlatform } from '@/context/ReferralContext';

// Mock data for campaign to platform mapping - in a real app, this would come from an API
const campaignToPlatformMap: Record<string, ReferralPlatform> = {
  "insiderlife": "insiderlife",
  "insiderdao": "insiderdao",
  "societi": "societi",
  "aifc": "aifc"
};

const campaignNames: Record<string, string> = {
  "insiderlife": "InsiderLife",
  "insiderdao": "InsiderDAO",
  "societi": "Societi",
  "aifc": "AI Freedom Code"
};

interface ContentCTAContainerProps {
  contentTitle: string;
  contentCTAs: ContentCTAType[];
}

const ContentCTAContainer: React.FC<ContentCTAContainerProps> = ({ contentTitle, contentCTAs }) => {
  if (!contentCTAs || contentCTAs.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-4">
      {contentCTAs.map((cta) => {
        // Get the platform ID for this campaign
        const platformId = campaignToPlatformMap[cta.campaignId] || "insiderlife";
        const campaignName = campaignNames[cta.campaignId] || "InsiderLife";
        
        return (
          <ContentCTA
            key={cta.id}
            cta={cta}
            contentTitle={contentTitle}
            campaignName={campaignName}
            platformId={platformId as ReferralPlatform}
            dismissible={true}
          />
        );
      })}
    </div>
  );
};

export default ContentCTAContainer;

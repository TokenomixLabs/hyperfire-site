
import React from 'react';
import ReferralLinksTab from './ReferralLinksTab';
import CommissionStats from './CommissionStats';
import ReferralTransactions from './ReferralTransactions';
import ReferredLeadsList from './ReferredLeadsList';
import { Button } from '@/components/ui/button';
import { Mail, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReferral } from '@/context/ReferralContext';

const ReferralsTab: React.FC = () => {
  const navigate = useNavigate();
  const { referralLinks, updateReferralLink } = useReferral();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <Button 
          onClick={() => navigate('/user/esp-settings')} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <Mail className="h-4 w-4" />
          Email Marketing Settings
        </Button>
        <Button 
          onClick={() => navigate('/user/referral-stats')} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <Link className="h-4 w-4" />
          Detailed Referral Stats
        </Button>
      </div>
      
      <CommissionStats />
      
      <div className="grid grid-cols-1 gap-6">
        {referralLinks && updateReferralLink && (
          <ReferralLinksTab 
            referralLinks={referralLinks}
            updateReferralLink={updateReferralLink}
          />
        )}
        <ReferredLeadsList />
        <ReferralTransactions />
      </div>
    </div>
  );
};

export default ReferralsTab;

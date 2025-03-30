
import React from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileMetrics from '@/components/profile/ProfileMetrics';
import SharedSignalSeries from '@/components/profile/SharedSignalSeries';
import SignalboardContributions from '@/components/profile/SignalboardContributions';
import ReferralLinksHub from '@/components/profile/ReferralLinksHub';
import { useUserProfile } from '@/hooks/useUserProfile';

const UserProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { profileData, isLoading, error } = useUserProfile(username || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Profile not found</div>
      </div>
    );
  }

  const { user, stats, duplicatedSeries, signalboardThreads } = profileData;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <ProfileHeader user={user} />
      
      <div className="mt-8">
        <ProfileMetrics stats={stats} />
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Shared Signal Series</h2>
        <SharedSignalSeries series={duplicatedSeries} />
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">SignalBoard Contributions</h2>
        <SignalboardContributions threads={signalboardThreads} />
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Referral Links Hub</h2>
        <ReferralLinksHub referralLinks={user.referralLinks} />
      </div>
    </div>
  );
};

export default UserProfilePage;

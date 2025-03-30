
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import ReferralLinksManager from '@/components/profile/ReferralLinksManager';
import ProfileVisibilityToggle from '@/components/profile/ProfileVisibilityToggle';
import ProfileStats from '@/components/profile/ProfileStats';
import { ReferralPlatform } from '@/context/ReferralContext';

const ProfileEditPage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = (updatedData: Partial<typeof user>) => {
    updateUserProfile(updatedData);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleSaveReferralLinks = (links: Record<ReferralPlatform, string>) => {
    // Make sure we have a complete referralLinks object
    const updatedReferralLinks: Record<ReferralPlatform, string> = {
      insiderlife: links.insiderlife || '',
      insiderdao: links.insiderdao || '',
      societi: links.societi || '',
      aifc: links.aifc || '',
    };
    
    handleSave({ referralLinks: updatedReferralLinks });
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <ProfileEditForm user={user} onSave={handleSave} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Referral Links</h2>
            <ReferralLinksManager 
              referralLinks={user.referralLinks || {}} 
              onSave={handleSaveReferralLinks} 
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Visibility</h2>
            <ProfileVisibilityToggle 
              isPublic={user.isPublicProfile || false} 
              onToggle={(isPublic) => handleSave({ isPublicProfile: isPublic })} 
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
            <ProfileStats userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;

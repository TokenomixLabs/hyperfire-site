
import React from 'react';
import AnimatedTransition from '@/components/AnimatedTransition';

interface ProfileSetupLayoutProps {
  children: React.ReactNode;
}

const ProfileSetupLayout: React.FC<ProfileSetupLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <AnimatedTransition>
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
              Complete Your Profile
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Set up your profile to get the most out of InsiderLife
            </p>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
            {children}
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default ProfileSetupLayout;

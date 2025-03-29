
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';
import UserDashboardContent from '@/components/user/UserDashboard';
import { ReferralProvider } from '@/context/ReferralContext';
import UserProfile from '@/components/user/UserProfile';
import LogoutButton from '@/components/auth/LogoutButton';
import { useAuth } from '@/context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <AnimatedTransition>
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {user?.name ? `Welcome, ${user.name.split(' ')[0]}` : 'My Dashboard'}
              </h1>
              <LogoutButton />
            </div>
            
            <UserProfile />
            
            <ReferralProvider>
              <UserDashboardContent />
            </ReferralProvider>
          </div>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default UserDashboard;

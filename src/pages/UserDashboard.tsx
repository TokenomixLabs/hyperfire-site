
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';
import UserDashboardContent from '@/components/user/UserDashboard';

const UserDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <AnimatedTransition>
          <div className="container mx-auto px-4 sm:px-6">
            <UserDashboardContent />
          </div>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default UserDashboard;

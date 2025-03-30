
import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import SignalBoardSidebar from './SignalBoardSidebar';

interface SignalBoardLayoutProps {
  children: ReactNode;
}

const SignalBoardLayout: React.FC<SignalBoardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4">
            {children}
          </div>
          
          <div className="w-full lg:w-1/4">
            <SignalBoardSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalBoardLayout;


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import LogoutButton from '@/components/auth/LogoutButton';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && !user?.isNewUser) {
      navigate('/dashboard');
    } else if (isAuthenticated && user?.isNewUser) {
      navigate('/profile-setup');
    }
  }, [isAuthenticated, user, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-16">
        <AnimatedTransition>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 mb-6">
              InsiderLife Signal Hub
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Amplify your reach, build your network, and earn recognition across the entire ecosystem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-lg py-6 px-8" 
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-lg py-6 px-8" 
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-lg py-6 px-8" 
                    onClick={() => navigate('/login')}
                  >
                    Log In
                  </Button>
                </>
              )}
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Multi-Platform Referrals</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Use your personal links across InsiderDAO, Societi, and AIFC to track your impact.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Track Your Impact</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  See real-time stats on clicks, signups, and content shares all in one place.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Share with Ease</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  One-click sharing with your referral code automatically embedded.
                </p>
              </div>
            </div>
          </div>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default Index;

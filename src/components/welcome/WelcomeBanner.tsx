
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

interface WelcomeBannerProps {
  onDismiss?: () => void;
}

const WelcomeBanner = ({ onDismiss }: WelcomeBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useAuth();
  
  // Check local storage to see if banner has been dismissed
  useEffect(() => {
    const isDismissed = localStorage.getItem('welcomeBannerDismissed') === 'true';
    if (isDismissed) {
      setIsVisible(false);
    }
  }, []);
  
  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('welcomeBannerDismissed', 'true');
    if (onDismiss) onDismiss();
  };
  
  if (!isVisible) return null;
  
  return (
    <Card className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 border-purple-200 dark:border-purple-800 shadow-sm mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-2">
              Welcome to SignalFire, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Your journey to amplifying your signal and building your network starts here.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="default" 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => window.location.href = '/learn'}
              >
                Explore Education Hub
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/signalboard'}
              >
                Join the SignalBoard
              </Button>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDismiss}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeBanner;

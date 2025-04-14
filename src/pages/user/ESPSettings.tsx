
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedTransition from '@/components/AnimatedTransition';
import ESPConnectionManager from '@/components/autoresponder/ESPConnectionManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export default function ESPSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) {
    toast({
      title: "Authentication required",
      description: "Please sign in to access your email marketing settings.",
      variant: "destructive",
    });
    navigate('/login');
    return null;
  }

  return (
    <AnimatedTransition className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-2 mb-8">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/user/dashboard')}
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Email Marketing Connections</h1>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <ESPConnectionManager userId={user.id} />
        </div>
      </div>
    </AnimatedTransition>
  );
}

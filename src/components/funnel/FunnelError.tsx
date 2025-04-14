
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface FunnelErrorProps {
  type: 'not-found' | 'loading';
}

const FunnelError: React.FC<FunnelErrorProps> = ({ type }) => {
  const navigate = useNavigate();
  
  if (type === 'loading') {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
      <h2 className="text-2xl font-bold mb-2">Funnel Not Found</h2>
      <p className="text-muted-foreground mb-4">The requested funnel does not exist or is not available.</p>
      <Button onClick={() => navigate('/')}>Return to Home</Button>
    </div>
  );
};

export default FunnelError;

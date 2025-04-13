
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SimulateWebhookButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const SimulateWebhookButton: React.FC<SimulateWebhookButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSimulateWebhook = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('simulateStripeWebhook');
      
      if (error) {
        throw new Error(error.message || 'Failed to simulate webhook');
      }
      
      toast({
        title: "Webhook Simulated",
        description: "A test webhook has been sent. Check the Supabase logs for details.",
      });
      
      console.log("Webhook simulation response:", data);
      
    } catch (error) {
      console.error("Error simulating webhook:", error);
      toast({
        title: "Simulation Failed",
        description: "There was an error simulating the webhook. Check the console for details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleSimulateWebhook}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <span className="mr-2">🧪</span>
      )}
      Simulate Stripe Webhook
    </Button>
  );
};

export default SimulateWebhookButton;

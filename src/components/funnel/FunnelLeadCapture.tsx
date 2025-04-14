
import React from 'react';
import LeadCaptureForm from './LeadCaptureForm';

interface FunnelLeadCaptureProps {
  funnelId: string;
  onSuccess: () => void;
}

const FunnelLeadCapture: React.FC<FunnelLeadCaptureProps> = ({ funnelId, onSuccess }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Complete Your Registration</h1>
          <p className="text-lg text-muted-foreground">
            Enter your information below to join our community and get access to exclusive content.
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <LeadCaptureForm
              funnelId={funnelId}
              onSuccess={onSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelLeadCapture;

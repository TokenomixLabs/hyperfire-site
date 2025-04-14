
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Plus } from 'lucide-react';

interface EmptyConnectionStateProps {
  onAddConnection: () => void;
}

const EmptyConnectionState: React.FC<EmptyConnectionStateProps> = ({ onAddConnection }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-slate-100 p-3 mb-4">
        <HelpCircle className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium">No Email Connections Yet</h3>
      <p className="text-sm text-slate-500 mt-2 mb-6 max-w-md">
        Connect your email marketing provider to automatically add leads captured through your funnels.
      </p>
      <Button 
        onClick={onAddConnection}
        className="bg-purple-600 hover:bg-purple-700"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Connection
      </Button>
    </div>
  );
};

export default EmptyConnectionState;

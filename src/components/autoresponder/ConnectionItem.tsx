
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, TestTube2, Trash } from 'lucide-react';
import { ESPConnection } from '@/types/autoresponder';

interface ConnectionItemProps {
  connection: ESPConnection;
  onTest: (id: string) => void;
  onDelete: (id: string) => void;
  testingId: string | null;
}

const ConnectionItem: React.FC<ConnectionItemProps> = ({ 
  connection, 
  onTest, 
  onDelete,
  testingId 
}) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-md">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="font-semibold text-purple-700">
            {connection.provider.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <div className="font-medium capitalize flex items-center">
            {connection.provider}
            <Badge 
              variant={connection.is_active ? "outline" : "secondary"}
              className={connection.is_active 
                ? "ml-2 bg-green-100 text-green-800 border-green-200" 
                : "ml-2 bg-slate-100 text-slate-800"
              }
            >
              {connection.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="text-sm text-slate-500">
            List: {connection.list_id}
            {connection.tag && <span className="ml-2">Tag: {connection.tag}</span>}
          </div>
          {connection.last_verified && (
            <div className="text-xs text-slate-400 mt-1">
              Last verified: {new Date(connection.last_verified).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onTest(connection.id)}
                disabled={testingId === connection.id}
              >
                {testingId === connection.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <TestTube2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Test connection</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onDelete(connection.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove connection</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ConnectionItem;

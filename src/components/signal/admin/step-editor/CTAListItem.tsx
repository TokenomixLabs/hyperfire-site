
import React from 'react';
import { Button } from "@/components/ui/button";
import { ContentCTA } from '@/types/referral';
import { ReferralProgram } from '@/types/referral';
import { Trash2 } from 'lucide-react';

interface CTAListItemProps {
  cta: ContentCTA;
  program?: ReferralProgram;
  onEdit: () => void;
  onDelete: () => void;
}

const CTAListItem: React.FC<CTAListItemProps> = ({
  cta,
  program,
  onEdit,
  onDelete
}) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50">
      <div>
        <h4 className="font-medium">{cta.buttonText}</h4>
        <p className="text-sm text-muted-foreground">
          {program?.name || cta.campaignId} • {cta.placement} • {cta.theme}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={onEdit}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.33168 11.3754 6.42165 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42165 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42165 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default CTAListItem;

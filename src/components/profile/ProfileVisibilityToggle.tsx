
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProfileVisibilityToggleProps {
  isPublic: boolean;
  onToggle: (isPublic: boolean) => void;
}

const ProfileVisibilityToggle: React.FC<ProfileVisibilityToggleProps> = ({ 
  isPublic, 
  onToggle 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch 
          id="profile-visibility" 
          checked={isPublic}
          onCheckedChange={onToggle}
        />
        <Label htmlFor="profile-visibility" className="cursor-pointer">
          Public Profile
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                When enabled, your profile will be visible to everyone. 
                When disabled, only you can see your profile.
                Admins can always see your profile regardless of this setting.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {isPublic 
          ? "Your profile is currently public and can be viewed by anyone." 
          : "Your profile is currently private and can only be viewed by you and admins."}
      </p>
    </div>
  );
};

export default ProfileVisibilityToggle;

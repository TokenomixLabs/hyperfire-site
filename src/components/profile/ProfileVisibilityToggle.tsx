
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface ProfileVisibilityToggleProps {
  isPublic: boolean;
  onToggle: (isPublic: boolean) => void;
}

const ProfileVisibilityToggle: React.FC<ProfileVisibilityToggleProps> = ({ 
  isPublic, 
  onToggle 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true);
    
    try {
      // Call the parent component's onToggle function
      await onToggle(checked);
      
      toast({
        title: "Profile visibility updated",
        description: checked 
          ? "Your profile is now public and visible to everyone." 
          : "Your profile is now private and only visible to you.",
      });
    } catch (error) {
      console.error('Failed to update profile visibility:', error);
      toast({
        title: "Update failed",
        description: "Failed to update your profile visibility. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch 
          id="profile-visibility" 
          checked={isPublic}
          onCheckedChange={handleToggle}
          disabled={isUpdating}
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
        {isUpdating 
          ? "Updating visibility settings..." 
          : isPublic 
            ? "Your profile is currently public and can be viewed by anyone." 
            : "Your profile is currently private and can only be viewed by you and admins."}
      </p>
    </div>
  );
};

export default ProfileVisibilityToggle;

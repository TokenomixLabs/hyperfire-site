
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReferralPlatform } from "@/context/ReferralContext";

interface ProgramFormData {
  id?: string;
  name: string;
  platform: string;
  description: string;
  linkFormat: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt?: string;
}

interface ProgramFormProps {
  formData: ProgramFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSwitchChange: (checked: boolean) => void;
  isEdit?: boolean;
}

const ProgramForm = ({ formData, onChange, onSwitchChange, isEdit = false }: ProgramFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor={isEdit ? "edit-name" : "name"}>Program Name *</Label>
        <Input
          id={isEdit ? "edit-name" : "name"}
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="e.g., New Referral Program"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor={isEdit ? "edit-platform" : "platform"}>Platform ID {isEdit ? "" : "*"}</Label>
        <Input
          id={isEdit ? "edit-platform" : "platform"}
          name="platform"
          value={formData.platform}
          onChange={onChange}
          placeholder="e.g., newprogram"
          disabled={isEdit}
        />
        <p className="text-xs text-muted-foreground">
          {isEdit 
            ? "Platform ID cannot be changed after creation" 
            : "Unique identifier used in code (lowercase, no spaces)"}
        </p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor={isEdit ? "edit-description" : "description"}>Description</Label>
        <Textarea
          id={isEdit ? "edit-description" : "description"}
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Describe what this program is for"
          rows={2}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor={isEdit ? "edit-linkFormat" : "linkFormat"}>Link Format *</Label>
        <div className="relative">
          <Input
            id={isEdit ? "edit-linkFormat" : "linkFormat"}
            name="linkFormat"
            value={formData.linkFormat}
            onChange={onChange}
            placeholder="https://example.com/?ref={username}"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Info className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm">
                <p>Use {"{username}"} as a placeholder for where the referral code should be inserted</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor={isEdit ? "edit-logoUrl" : "logoUrl"}>Logo URL</Label>
        <Input
          id={isEdit ? "edit-logoUrl" : "logoUrl"}
          name="logoUrl"
          value={formData.logoUrl}
          onChange={onChange}
          placeholder="https://example.com/logo.png"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id={isEdit ? "edit-isActive" : "isActive"}
          checked={formData.isActive}
          onCheckedChange={onSwitchChange}
        />
        <Label htmlFor={isEdit ? "edit-isActive" : "isActive"}>Active</Label>
      </div>
    </div>
  );
};

export default ProgramForm;

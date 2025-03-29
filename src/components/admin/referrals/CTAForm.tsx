
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CampaignCTA } from "@/types/referral";
import { ReferralProgram } from "@/types/referral";

interface CTAFormProps {
  formData: Partial<CampaignCTA>;
  programs: ReferralProgram[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const CTAForm = ({
  formData,
  programs,
  onInputChange,
  onSelectChange,
}: CTAFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="programId">Program *</Label>
        <Select
          onValueChange={(value) => onSelectChange("programId", value)}
          value={formData.programId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a program" />
          </SelectTrigger>
          <SelectContent>
            {programs.filter(p => p.isActive).map((program) => (
              <SelectItem key={program.id} value={program.id}>
                {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="buttonText">Button Text *</Label>
        <Input
          id="buttonText"
          name="buttonText"
          value={formData.buttonText}
          onChange={onInputChange}
          placeholder="e.g., Join Now"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Brief description of the offer"
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="placement">Placement</Label>
          <Select
            onValueChange={(value) => onSelectChange("placement", value)}
            value={formData.placement}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select placement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inline">Inline</SelectItem>
              <SelectItem value="banner">Banner</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            onValueChange={(value) => onSelectChange("theme", value)}
            value={formData.theme}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {formData.placement === "banner" && (
        <div className="grid gap-2">
          <Label htmlFor="position">Position</Label>
          <Select
            onValueChange={(value) => onSelectChange("position", value)}
            value={formData.position}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default CTAForm;

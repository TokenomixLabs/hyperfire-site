
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ContentCTA } from "@/types/referral";
import { ReferralProgram } from "@/types/referral";

interface ContentCTAFormProps {
  formData: Partial<ContentCTA>;
  programs: ReferralProgram[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const ContentCTAForm = ({
  formData,
  programs,
  onInputChange,
  onSelectChange,
}: ContentCTAFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="campaignId">Referral Program *</Label>
        <Select
          onValueChange={(value) => onSelectChange("campaignId", value)}
          value={formData.campaignId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a referral program" />
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
          placeholder="e.g., Join Now, Get Started, Learn More"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Supporting Text</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Brief description or call to action"
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="placement">Display Style</Label>
          <Select
            onValueChange={(value) => onSelectChange("placement", value)}
            value={formData.placement}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inline">Inline Button</SelectItem>
              <SelectItem value="banner">Full-width Banner</SelectItem>
              <SelectItem value="card">Card with Description</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="theme">Color Theme</Label>
          <Select
            onValueChange={(value) => onSelectChange("theme", value)}
            value={formData.theme}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default (Brand)</SelectItem>
              <SelectItem value="primary">Primary (High Contrast)</SelectItem>
              <SelectItem value="minimal">Minimal (Subtle)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {formData.placement === "banner" && (
        <div className="grid gap-2">
          <Label htmlFor="position">Banner Position</Label>
          <Select
            onValueChange={(value) => onSelectChange("position", value)}
            value={formData.position}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top of Content</SelectItem>
              <SelectItem value="bottom">Bottom of Content</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ContentCTAForm;

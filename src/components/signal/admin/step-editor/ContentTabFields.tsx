
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SignalStep } from '@/types/signal';

interface ContentTabFieldsProps {
  editedStep: SignalStep;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContentTabFields: React.FC<ContentTabFieldsProps> = ({
  editedStep,
  handleInputChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Step Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter step title"
          value={editedStep.title}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Enter step content in markdown format"
          value={editedStep.content}
          onChange={handleInputChange}
          rows={8}
        />
        <p className="text-xs text-muted-foreground">
          Supports Markdown formatting for rich text content
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="videoEmbed">Video Embed (optional)</Label>
        <Input
          id="videoEmbed"
          name="videoEmbed"
          placeholder="Enter video embed code or URL"
          value={editedStep.videoEmbed || ''}
          onChange={handleInputChange}
        />
        <p className="text-xs text-muted-foreground">
          YouTube, Vimeo or other embed code
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mediaUrl">Media URL (optional)</Label>
        <Input
          id="mediaUrl"
          name="mediaUrl"
          placeholder="https://example.com/media.jpg"
          value={editedStep.mediaUrl || ''}
          onChange={handleInputChange}
        />
        <p className="text-xs text-muted-foreground">
          Image or other media to display with this step
        </p>
      </div>
    </div>
  );
};

export default ContentTabFields;

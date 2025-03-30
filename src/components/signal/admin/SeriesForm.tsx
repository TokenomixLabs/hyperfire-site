
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignalContentType } from '@/types/signal';

interface SeriesFormProps {
  form: any;
}

const SeriesForm: React.FC<SeriesFormProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Series Name</Label>
          <Input
            id="name"
            placeholder="Enter series name"
            {...form.register('name', { required: true })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter a brief description of this series"
            {...form.register('description', { required: true })}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contentType">Content Type</Label>
          <Select
            defaultValue={form.getValues('contentType')}
            onValueChange={(value) => form.setValue('contentType', value as SignalContentType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="mixed">Mixed Content</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
          <Input
            id="thumbnailUrl"
            placeholder="https://example.com/thumbnail.jpg"
            {...form.register('thumbnailUrl')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
          <Input
            id="featuredImageUrl"
            placeholder="https://example.com/featured-image.jpg"
            {...form.register('featuredImageUrl')}
          />
        </div>
        
        <div className="flex items-center justify-between space-x-2 pt-4">
          <Label htmlFor="published" className="flex items-center space-x-2 cursor-pointer">
            <span>Published</span>
          </Label>
          <Switch
            id="published"
            checked={form.watch('published')}
            onCheckedChange={(checked) => form.setValue('published', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default SeriesForm;

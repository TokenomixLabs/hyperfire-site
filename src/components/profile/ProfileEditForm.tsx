
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface ProfileEditFormProps {
  user: User;
  onSave: (data: Partial<User>) => void;
}

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." })
    .regex(/^[a-z0-9_]+$/, { message: "Username can only contain lowercase letters, numbers, and underscores." }),
  bio: z.string().max(160, { message: "Bio cannot exceed 160 characters." }).optional(),
  externalLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  avatarUrl: z.string().optional(),
});

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ user, onSave }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      username: user.username || '',
      bio: user.bio || '',
      externalLink: user.externalLink || '',
      avatarUrl: user.avatarUrl || '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsSubmitting(true);
    
    try {
      await onSave(values);
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Real avatar upload functionality
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "The image must be less than 2MB",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create form data for the upload
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Upload the file
      const response = await fetch('/api/users/avatar', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }
      
      const data = await response.json();
      
      // Update the form with the new avatar URL
      form.setValue('avatarUrl', data.avatarUrl);
      
      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated",
      });
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload your avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Create a hidden file input for avatar uploads
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Trigger the file input when the button is clicked
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 border-2 border-purple-200 mb-2">
              {form.watch('avatarUrl') ? (
                <AvatarImage src={form.watch('avatarUrl')} alt={form.watch('name')} />
              ) : (
                <AvatarFallback className="text-xl bg-purple-100 text-purple-700">
                  {getInitials(form.watch('name'))}
                </AvatarFallback>
              )}
            </Avatar>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={triggerFileInput}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Change Avatar"}
            </Button>
          </div>
          
          <div className="flex-1 space-y-4 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be used for your profile URL: /u/{form.watch('username')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell others a bit about yourself" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A short bio about yourself. Max 160 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="externalLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>External Link</FormLabel>
              <FormControl>
                <Input placeholder="https://yourwebsite.com" {...field} />
              </FormControl>
              <FormDescription>
                Add a link to your website or social media.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileEditForm;

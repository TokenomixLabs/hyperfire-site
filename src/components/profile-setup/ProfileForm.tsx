
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Info, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  insiderdao: z.string().optional(),
  societi: z.string().optional(),
  aifc: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      insiderdao: user?.referralLinks?.insiderdao || '',
      societi: user?.referralLinks?.societi || '',
      aifc: user?.referralLinks?.aifc || '',
    }
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Prepare the user data object
      const userData = {
        name: values.name,
        username: values.username,
        referralLinks: {
          insiderlife: user?.referralLinks?.insiderlife || '',
          insiderdao: values.insiderdao || '',
          societi: values.societi || '',
          aifc: values.aifc || '',
        }
      };
      
      // Call the API to update the user profile
      const response = await fetch('/api/users/profile-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to set up profile');
      }
      
      // Update the user profile in the context
      updateUserProfile(userData);
      
      toast({
        title: "Profile setup complete",
        description: "Your profile has been successfully set up.",
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile setup error:', error);
      toast({
        title: "Setup failed",
        description: error instanceof Error ? error.message : "Failed to set up your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoFields control={form.control} />
        <ReferralLinksSection control={form.control} />
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving profile..." : "Complete Setup"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

interface FieldProps {
  control: any;
}

const BasicInfoFields = ({ control }: FieldProps) => (
  <>
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Full Name</FormLabel>
          <FormControl>
            <Input placeholder="John Doe" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder="johndoe" {...field} />
          </FormControl>
          <FormDescription>
            This will be used in your referral links
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

const ReferralLinksSection = ({ control }: FieldProps) => (
  <>
    <div className="pt-4">
      <h3 className="text-lg font-medium mb-4">Referral Links (Optional)</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Add your referral links for each platform to start tracking your impact
      </p>
    </div>
    
    <TooltipProvider>
      <ReferralLinkField
        name="insiderdao"
        label="InsiderDAO Link"
        placeholder="insiderdao.com/?ref=your-username"
        tooltipText="Enter your InsiderDAO referral link. Format: insiderdao.com/?ref=username"
        control={control}
      />

      <ReferralLinkField
        name="societi"
        label="Societi Link"
        placeholder="societi.com/?ref=your-username"
        tooltipText="Enter your Societi referral link. Format: societi.com/?ref=username"
        control={control}
      />

      <ReferralLinkField
        name="aifc"
        label="AI Freedom Code Link"
        placeholder="aifc.com/?ref=your-username"
        tooltipText="Enter your AI Freedom Code referral link. Format: aifc.com/?ref=username"
        control={control}
      />
    </TooltipProvider>
  </>
);

interface ReferralLinkFieldProps extends FieldProps {
  name: "insiderdao" | "societi" | "aifc";
  label: string;
  placeholder: string;
  tooltipText: string;
}

const ReferralLinkField = ({ 
  control, 
  name, 
  label, 
  placeholder, 
  tooltipText 
}: ReferralLinkFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <div className="flex items-center">
          <FormLabel>{label}</FormLabel>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 ml-2 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <FormControl>
          <Input placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default ProfileForm;

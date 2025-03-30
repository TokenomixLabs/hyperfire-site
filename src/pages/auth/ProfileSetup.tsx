
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  insiderdao: z.string().optional(),
  societi: z.string().optional(),
  aifc: z.string().optional(),
});

const ProfileSetup = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      insiderdao: user?.referralLinks?.insiderdao || '',
      societi: user?.referralLinks?.societi || '',
      aifc: user?.referralLinks?.aifc || '',
    }
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <AnimatedTransition>
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
              Complete Your Profile
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Set up your profile to get the most out of InsiderLife
            </p>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
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
                  control={form.control}
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

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">Referral Links (Optional)</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Add your referral links for each platform to start tracking your impact
                  </p>
                </div>
                
                <TooltipProvider>
                  <FormField
                    control={form.control}
                    name="insiderdao"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>InsiderDAO Link</FormLabel>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 ml-2 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Enter your InsiderDAO referral link. Format: insiderdao.com/?ref=username</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormControl>
                          <Input placeholder="insiderdao.com/?ref=your-username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="societi"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>Societi Link</FormLabel>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 ml-2 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Enter your Societi referral link. Format: societi.com/?ref=username</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormControl>
                          <Input placeholder="societi.com/?ref=your-username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aifc"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>AI Freedom Code Link</FormLabel>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 ml-2 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Enter your AI Freedom Code referral link. Format: aifc.com/?ref=username</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormControl>
                          <Input placeholder="aifc.com/?ref=your-username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TooltipProvider>

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
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default ProfileSetup;

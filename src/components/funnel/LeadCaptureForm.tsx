
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import useReferralTracking from '@/hooks/useReferralTracking';

// Define the form schema
const leadFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().optional(),
  phone: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadCaptureFormProps {
  funnelId: string;
  onSuccess?: () => void;
  className?: string;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  funnelId,
  onSuccess,
  className = '',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { getCurrentReferrer } = useReferralTracking();

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
    },
  });

  const onSubmit = async (values: LeadFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Get current referrer if available
      const referrerId = getCurrentReferrer();
      
      // First, store the lead in Supabase
      // Use explicit casting to handle the table type issue
      const { data: lead, error } = await supabase
        .from('leads')
        .insert({
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name || null,
          phone: values.phone || null,
          funnel_id: funnelId,
          referrer_user_id: referrerId,
          metadata: {
            source: window.location.href,
            utm_params: Object.fromEntries(new URLSearchParams(window.location.search)),
          },
        })
        .select();

      if (error) throw error;

      // Now, sync with the ESP if the referrer has one connected
      if (referrerId) {
        // This will be handled by a separate edge function
        await fetch('/api/sync-lead-to-esp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            leadId: lead[0].id,
            referrerId,
          }),
        });
      }

      // Success
      toast({
        title: 'Success!',
        description: 'Thank you for signing up!',
      });
      
      // Reset the form
      form.reset();
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: 'Submission failed',
        description: 'There was an error processing your submission. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">Join Now</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LeadCaptureForm;

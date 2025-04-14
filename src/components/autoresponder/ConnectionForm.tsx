
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { autoresponderConnectionsTable } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';
import { ESPConnection } from '@/types/autoresponder';

const espConnectionSchema = z.object({
  provider: z.string({
    required_error: "Please select an email provider",
  }),
  api_key: z.string().min(1, "API key is required"),
  api_secret: z.string().optional(),
  list_id: z.string().min(1, "List ID is required"),
  tag: z.string().optional(),
});

type FormValues = z.infer<typeof espConnectionSchema>;

interface ConnectionFormProps {
  userId: string;
  onSuccess: (connection: ESPConnection) => void;
  onCancel: () => void;
}

const ConnectionForm: React.FC<ConnectionFormProps> = ({ userId, onSuccess, onCancel }) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(espConnectionSchema),
    defaultValues: {
      provider: '',
      api_key: '',
      api_secret: '',
      list_id: '',
      tag: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data, error } = await autoresponderConnectionsTable()
        .insert({
          user_id: userId,
          provider: values.provider,
          api_key: values.api_key,
          api_secret: values.api_secret || null,
          list_id: values.list_id,
          tag: values.tag || null,
          is_active: true,
        })
        .select();

      if (error) throw error;

      toast({
        title: 'Connection added successfully',
        description: `You've connected your ${values.provider} account.`,
      });
      
      form.reset();
      onSuccess(data[0] as ESPConnection);
    } catch (error) {
      console.error('Error adding connection:', error);
      toast({
        title: 'Failed to add connection',
        description: 'There was an error connecting your account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="border rounded-md p-4 mb-6 bg-slate-50 dark:bg-slate-900">
      <h3 className="text-lg font-medium mb-4">Add New Connection</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Provider</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your email service provider" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="aweber">AWeber</SelectItem>
                    <SelectItem value="convertkit">ConvertKit</SelectItem>
                    <SelectItem value="mailchimp">Mailchimp</SelectItem>
                    <SelectItem value="activecampaign">ActiveCampaign</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose your email marketing platform
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="api_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your API key from the email provider
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="api_secret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Secret (optional)</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Only required for some providers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="list_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>List ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The ID of the list to add contacts to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional tag to add to new contacts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save Connection
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ConnectionForm;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus, Trash, TestTube2, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ESPConnection } from '@/types/autoresponder';
import { autoresponderConnectionsTable } from '@/utils/supabaseHelpers';

const espConnectionSchema = z.object({
  provider: z.string({
    required_error: "Please select an email provider",
  }),
  api_key: z.string().min(1, "API key is required"),
  api_secret: z.string().optional(),
  list_id: z.string().min(1, "List ID is required"),
  tag: z.string().optional(),
});

interface ESPConnectionManagerProps {
  userId: string;
}

const ESPConnectionManager: React.FC<ESPConnectionManagerProps> = ({ userId }) => {
  const [connections, setConnections] = useState<ESPConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [deletingConnection, setDeletingConnection] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof espConnectionSchema>>({
    resolver: zodResolver(espConnectionSchema),
    defaultValues: {
      provider: '',
      api_key: '',
      api_secret: '',
      list_id: '',
      tag: '',
    },
  });

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      try {
        const { data, error } = await autoresponderConnectionsTable()
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setConnections(data as ESPConnection[]);
      } catch (error) {
        console.error('Error fetching connections:', error);
        toast({
          title: 'Failed to load connections',
          description: 'Could not retrieve your email marketing connections.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [userId, toast]);

  const onSubmit = async (values: z.infer<typeof espConnectionSchema>) => {
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

      setConnections([...(data as ESPConnection[]), ...connections]);
      setShowForm(false);
      form.reset();
      
      toast({
        title: 'Connection added successfully',
        description: `You've connected your ${values.provider} account.`,
      });
    } catch (error) {
      console.error('Error adding connection:', error);
      toast({
        title: 'Failed to add connection',
        description: 'There was an error connecting your account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const testConnection = async (connectionId: string) => {
    setTestingConnection(connectionId);
    try {
      const response = await fetch('/api/test-esp-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionId }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Connection test failed');

      const { error } = await autoresponderConnectionsTable()
        .update({ last_verified: new Date().toISOString() })
        .eq('id', connectionId);

      if (error) throw error;

      setConnections(
        connections.map(conn => 
          conn.id === connectionId 
            ? { ...conn, last_verified: new Date().toISOString() } 
            : conn
        )
      );

      toast({
        title: 'Connection test successful',
        description: 'Your email marketing connection is working properly.',
      });
    } catch (error) {
      console.error('Error testing connection:', error);
      toast({
        title: 'Connection test failed',
        description: error instanceof Error ? error.message : 'Could not verify the connection.',
        variant: 'destructive',
      });
    } finally {
      setTestingConnection(null);
    }
  };

  const deleteConnection = async (connectionId: string) => {
    try {
      const { error } = await autoresponderConnectionsTable()
        .delete()
        .eq('id', connectionId);

      if (error) throw error;

      setConnections(connections.filter(conn => conn.id !== connectionId));
      
      toast({
        title: 'Connection removed',
        description: 'The email marketing connection has been deleted.',
      });
    } catch (error) {
      console.error('Error deleting connection:', error);
      toast({
        title: 'Failed to remove connection',
        description: 'There was an error deleting the connection. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingConnection(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Marketing Connections</CardTitle>
          <CardDescription>Connect your email service provider to automatically add leads from your funnels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Email Marketing Connections</CardTitle>
            <CardDescription>Connect your email service provider to automatically add leads from your funnels</CardDescription>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)} 
            variant={showForm ? "outline" : "default"}
            className={showForm ? "" : "bg-purple-600 hover:bg-purple-700"}
          >
            {showForm ? "Cancel" : <>
              <Plus className="mr-2 h-4 w-4" /> Add Connection
            </>}
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
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

                  <div className="flex justify-end pt-4">
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
          )}

          {connections.length === 0 && !showForm ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 p-3 mb-4">
                <HelpCircle className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium">No Email Connections Yet</h3>
              <p className="text-sm text-slate-500 mt-2 mb-6 max-w-md">
                Connect your email marketing provider to automatically add leads captured through your funnels.
              </p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Connection
              </Button>
            </div>
          ) : (
            <>
              {connections.length > 0 && (
                <div className="space-y-4">
                  {connections.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="font-semibold text-purple-700">
                            {connection.provider.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium capitalize flex items-center">
                            {connection.provider}
                            <Badge 
                              variant={connection.is_active ? "outline" : "secondary"}
                              className={connection.is_active 
                                ? "ml-2 bg-green-100 text-green-800 border-green-200" 
                                : "ml-2 bg-slate-100 text-slate-800"
                              }
                            >
                              {connection.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-500">
                            List: {connection.list_id}
                            {connection.tag && <span className="ml-2">Tag: {connection.tag}</span>}
                          </div>
                          {connection.last_verified && (
                            <div className="text-xs text-slate-400 mt-1">
                              Last verified: {new Date(connection.last_verified).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => testConnection(connection.id)}
                                disabled={testingConnection === connection.id}
                              >
                                {testingConnection === connection.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <TestTube2 className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Test connection</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => setDeletingConnection(connection.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove connection</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deletingConnection} onOpenChange={(open) => !open && setDeletingConnection(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the email marketing connection and stop automatic lead syncing to this provider.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingConnection && deleteConnection(deletingConnection)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ESPConnectionManager;

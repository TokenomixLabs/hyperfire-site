
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Funnel, FunnelVisibility } from '@/types/funnel';
import { ReferralPlatform } from '@/context/ReferralContext';

const settingsSchema = z.object({
  requiresAuth: z.boolean().default(false),
  redirectLoggedInTo: z.enum(['first_step', 'dashboard', 'specific_url']).default('first_step'),
  redirectLoggedInUrl: z.string().optional(),
  referralParams: z.object({
    trackReferrals: z.boolean().default(true),
    defaultPlatform: z.enum(['insiderlife', 'insiderdao', 'societi', 'aifc']).default('insiderlife'),
    affiliateEnabled: z.boolean().default(true),
  }),
});

interface FunnelSettingsProps {
  funnel: Funnel;
  onSave: (updatedSettings: Partial<Funnel>) => void;
}

export default function FunnelSettings({ funnel, onSave }: FunnelSettingsProps) {
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      requiresAuth: funnel.requiresAuth || false,
      redirectLoggedInTo: funnel.redirectLoggedInTo || 'first_step',
      redirectLoggedInUrl: funnel.redirectLoggedInUrl || '',
      referralParams: {
        trackReferrals: funnel.referralParams?.trackReferrals ?? true,
        defaultPlatform: funnel.referralParams?.defaultPlatform || 'insiderlife',
        affiliateEnabled: funnel.referralParams?.affiliateEnabled ?? true,
      },
    },
  });

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    onSave(values);
  }

  // Track form state changes for conditional fields
  const redirectLoggedInTo = form.watch("redirectLoggedInTo");
  const showRedirectUrl = redirectLoggedInTo === 'specific_url';

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Settings</CardTitle>
              <CardDescription>
                Control how users authenticate and navigate through the funnel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="requiresAuth"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Require Authentication
                      </FormLabel>
                      <FormDescription>
                        If enabled, users must be logged in to view this funnel.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="redirectLoggedInTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redirect Logged-in Users To</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select redirect behavior" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="first_step">First Step (Default)</SelectItem>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="specific_url">Specific URL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Where to send users who are already logged in.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {showRedirectUrl && (
                <FormField
                  control={form.control}
                  name="redirectLoggedInUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Redirect URL</FormLabel>
                      <FormControl>
                        <Input placeholder="/dashboard/special-content" {...field} />
                      </FormControl>
                      <FormDescription>
                        The URL to redirect logged-in users to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Referral Settings</CardTitle>
              <CardDescription>
                Configure how referrals are tracked and processed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="referralParams.trackReferrals"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Track Referrals
                      </FormLabel>
                      <FormDescription>
                        Capture ?ref= parameters from URL to track where visitors came from.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="referralParams.defaultPlatform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Referral Platform</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select default platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="insiderlife">InsiderLife</SelectItem>
                        <SelectItem value="insiderdao">InsiderDAO</SelectItem>
                        <SelectItem value="societi">Societi</SelectItem>
                        <SelectItem value="aifc">AIFC</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The platform to attribute traffic to if no specific ref parameter is provided.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="referralParams.affiliateEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Enable Affiliate Attribution
                      </FormLabel>
                      <FormDescription>
                        Enable commission tracking for affiliate referrals.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Save Settings
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

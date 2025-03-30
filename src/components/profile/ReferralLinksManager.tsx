
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ReferralPlatform } from '@/context/ReferralContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ReferralLinksManagerProps {
  referralLinks: Partial<Record<ReferralPlatform, string>>;
  onSave: (links: Record<ReferralPlatform, string>) => void;
}

const urlSchema = z.string().url({ message: "Please enter a valid URL." }).or(z.literal(''));

const referralLinksSchema = z.object({
  insiderlife: urlSchema,
  insiderdao: urlSchema,
  societi: urlSchema,
  aifc: urlSchema,
});

const ReferralLinksManager: React.FC<ReferralLinksManagerProps> = ({ referralLinks, onSave }) => {
  const form = useForm<z.infer<typeof referralLinksSchema>>({
    resolver: zodResolver(referralLinksSchema),
    defaultValues: {
      insiderlife: referralLinks.insiderlife || '',
      insiderdao: referralLinks.insiderdao || '',
      societi: referralLinks.societi || '',
      aifc: referralLinks.aifc || '',
    },
  });

  function onSubmit(values: z.infer<typeof referralLinksSchema>) {
    // Ensure all values are present, even if empty strings
    const completeLinks: Record<ReferralPlatform, string> = {
      insiderlife: values.insiderlife || '',
      insiderdao: values.insiderdao || '',
      societi: values.societi || '',
      aifc: values.aifc || '',
    };
    onSave(completeLinks);
  }

  const platformLabels: Record<ReferralPlatform, string> = {
    insiderlife: 'Insider Life',
    insiderdao: 'Insider DAO',
    societi: 'Societi',
    aifc: 'AI Freedom Code',
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {(Object.keys(platformLabels) as ReferralPlatform[]).map((platform) => (
          <FormField
            key={platform}
            control={form.control}
            name={platform}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{platformLabels[platform]}</FormLabel>
                <FormControl>
                  <Input placeholder={`https://${platform.toLowerCase()}.com/?ref=your-username`} {...field} />
                </FormControl>
                <FormDescription>
                  Your referral link for {platformLabels[platform]}.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit">Save Referral Links</Button>
      </form>
    </Form>
  );
};

export default ReferralLinksManager;


import { FormLabel, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { CampaignCTA } from "@/types/referral";

interface CTASelectorProps {
  ctaOptions: CampaignCTA[];
  selectedCTAs: string[];
  onCTAToggle: (ctaId: string) => void;
}

const CTASelector = ({ ctaOptions, selectedCTAs, onCTAToggle }: CTASelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel>Call-to-Actions</FormLabel>
        <FormDescription>Add CTAs to this content</FormDescription>
      </div>
      <div className="space-y-2">
        {ctaOptions.map(cta => (
          <div 
            key={cta.id} 
            className={`flex items-start p-3 border rounded-md cursor-pointer transition-colors ${
              selectedCTAs.includes(cta.id) 
                ? 'border-insider-500 bg-insider-50 dark:bg-insider-900/20' 
                : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50'
            }`}
            onClick={() => onCTAToggle(cta.id)}
          >
            <Checkbox 
              checked={selectedCTAs.includes(cta.id)}
              className="mt-1 mr-3"
              onCheckedChange={() => onCTAToggle(cta.id)}
            />
            <div className="flex-1">
              <div className="font-medium">{cta.buttonText}</div>
              <div className="text-sm text-muted-foreground">{cta.description}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs rounded">
                  {cta.placement}
                </span>
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs rounded">
                  {cta.theme}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CTASelector;

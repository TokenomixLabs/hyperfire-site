
import { useState } from "react";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CampaignCTA } from "@/types/referral";
import TagSelector from "./TagSelector";
import BrandSelector from "./BrandSelector";
import ImageUploader from "./ImageUploader";
import CTASelector from "./CTASelector";

// Data that would typically come from API
const tags = [
  { label: "Cryptocurrency", value: "crypto" },
  { label: "Investing", value: "investing" },
  { label: "Trading", value: "trading" },
  { label: "Technology", value: "technology" },
  { label: "Market Analysis", value: "market-analysis" },
  { label: "Education", value: "education" },
  { label: "Research", value: "research" },
  { label: "Tokenomics", value: "tokenomics" },
  { label: "NFTs", value: "nfts" },
  { label: "DeFi", value: "defi" },
  { label: "Web3", value: "web3" },
];

const brands = [
  { label: "InsiderLife", value: "insiderlife" },
  { label: "Tokenomix", value: "tokenomix" },
  { label: "InsiderDAO", value: "insiderdao" },
];

// Mock CTAs - in a real app, these would come from an API
const mockCTAs: CampaignCTA[] = [
  {
    id: "1",
    programId: "insiderdao",
    buttonText: "Join InsiderDAO",
    description: "Join the exclusive crypto trading community",
    theme: "primary",
    placement: "card",
  },
  {
    id: "2",
    programId: "societi",
    buttonText: "Try Societi Free",
    description: "Connect with like-minded individuals in our network",
    theme: "default",
    placement: "inline",
  },
  {
    id: "3",
    programId: "aifc",
    buttonText: "Learn AI Development",
    description: "Master AI development with our comprehensive course",
    theme: "minimal",
    placement: "banner",
    position: "bottom",
  },
];

const ContentCreator = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [ctaOptions] = useState<CampaignCTA[]>(mockCTAs);
  const [selectedCTAs, setSelectedCTAs] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      content: "",
      brand: "",
      isPremium: false,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleCTAToggle = (ctaId: string) => {
    setSelectedCTAs(prev => 
      prev.includes(ctaId)
        ? prev.filter(id => id !== ctaId)
        : [...prev, ctaId]
    );
  };

  const onSubmit = (data: any) => {
    // In a real app, this would send data to your backend
    console.log({
      ...data,
      tags: selectedTags,
      featuredImage: image,
      ctas: selectedCTAs.map(id => ctaOptions.find(cta => cta.id === id)),
    });

    toast({
      title: "Content created!",
      description: "Your content has been successfully created.",
    });

    // Reset form
    form.reset();
    setSelectedTags([]);
    setImage(null);
    setSelectedCTAs([]);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter content title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the content"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will appear in content cards and search results.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <BrandSelector 
                      brands={brands} 
                      value={field.value} 
                      onValueChange={field.onChange} 
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPremium"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Premium Content</FormLabel>
                        <FormDescription>
                          Mark this content as premium (requires subscription)
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <CTASelector 
                  ctaOptions={ctaOptions}
                  selectedCTAs={selectedCTAs}
                  onCTAToggle={handleCTAToggle}
                />
              </div>

              <div className="space-y-6">
                <ImageUploader 
                  image={image}
                  onImageUpload={handleImageUpload}
                  onRemoveImage={removeImage}
                />

                <TagSelector 
                  tags={tags} 
                  selectedTags={selectedTags} 
                  setSelectedTags={setSelectedTags} 
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your content here..."
                          className="resize-none min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Supports markdown format.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                <Save className="mr-2 h-4 w-4" /> Save Content
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContentCreator;

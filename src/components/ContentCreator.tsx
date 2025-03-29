
import { useState, useEffect } from "react";
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
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown, Upload, Save, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CampaignCTA } from "@/types/referral";

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
  const [open, setOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [ctaOptions, setCTAOptions] = useState<CampaignCTA[]>(mockCTAs);
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Brand</FormLabel>
                      <Popover open={brandOpen} onOpenChange={setBrandOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-full justify-between"
                            >
                              {field.value
                                ? brands.find(
                                    (brand) => brand.value === field.value
                                  )?.label
                                : "Select brand..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search brands..." />
                            <CommandEmpty>No brand found.</CommandEmpty>
                            <CommandGroup>
                              {brands.map((brand) => (
                                <CommandItem
                                  key={brand.value}
                                  value={brand.value}
                                  onSelect={() => {
                                    form.setValue("brand", brand.value);
                                    setBrandOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === brand.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {brand.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
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
                        onClick={() => handleCTAToggle(cta.id)}
                      >
                        <Checkbox 
                          checked={selectedCTAs.includes(cta.id)}
                          className="mt-1 mr-3"
                          onCheckedChange={() => handleCTAToggle(cta.id)}
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
              </div>

              <div className="space-y-6">
                <div>
                  <FormLabel className="block mb-2">Featured Image</FormLabel>
                  {image ? (
                    <div className="relative rounded-md overflow-hidden border h-48">
                      <img
                        src={image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center h-48">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop or click to upload
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="image-upload"
                        onChange={handleImageUpload}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        Select Image
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <FormLabel className="block mb-2">Tags</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {selectedTags.length > 0
                          ? `${selectedTags.length} tag${
                              selectedTags.length > 1 ? "s" : ""
                            } selected`
                          : "Select tags..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search tags..." />
                        <CommandEmpty>No tags found.</CommandEmpty>
                        <CommandGroup>
                          {tags.map((tag) => (
                            <CommandItem
                              key={tag.value}
                              value={tag.value}
                              onSelect={() => {
                                setSelectedTags((prev) =>
                                  prev.includes(tag.value)
                                    ? prev.filter((value) => value !== tag.value)
                                    : [...prev, tag.value]
                                );
                              }}
                            >
                              <div className="flex items-center">
                                <Checkbox
                                  checked={selectedTags.includes(tag.value)}
                                  className="mr-2 h-4 w-4"
                                />
                                {tag.label}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTags.map((tagValue) => {
                        const tag = tags.find((t) => t.value === tagValue);
                        return (
                          <div
                            key={tagValue}
                            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center"
                          >
                            {tag?.label}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 hover:bg-transparent"
                              onClick={() =>
                                setSelectedTags((prev) =>
                                  prev.filter((t) => t !== tagValue)
                                )
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

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


import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ReferralProgram, CampaignCTA } from "@/types/referral";
import { useToast } from "@/hooks/use-toast";
import GlobalCTA from "@/components/GlobalCTA";

// Mock data - in production this would come from an API
const mockPrograms: ReferralProgram[] = [
  {
    id: "insiderlife",
    name: "InsiderLife",
    platform: "insiderlife",
    description: "The main InsiderLife referral program",
    linkFormat: "https://insiderlife.com/?ref={username}",
    logoUrl: "/logos/insiderlife.png",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "insiderdao",
    name: "InsiderDAO",
    platform: "insiderdao",
    description: "Insider DAO membership referrals",
    linkFormat: "https://insiderdao.com/?ref={username}",
    logoUrl: "/logos/insiderdao.png",
    isActive: true,
    createdAt: "2023-02-15T00:00:00Z",
  },
  {
    id: "societi",
    name: "Societi",
    platform: "societi",
    description: "Societi platform referrals",
    linkFormat: "https://societi.com/?ref={username}",
    logoUrl: "/logos/societi.png",
    isActive: true,
    createdAt: "2023-03-10T00:00:00Z",
  },
  {
    id: "aifc",
    name: "AI Freedom Code",
    platform: "aifc",
    description: "AI Freedom Code course referrals",
    linkFormat: "https://aifc.com/?ref={username}",
    logoUrl: "/logos/aifc.png",
    isActive: true,
    createdAt: "2023-04-05T00:00:00Z",
  }
];

const mockCTAs: CampaignCTA[] = [
  {
    id: "1",
    programId: "insiderdao",
    buttonText: "Join InsiderDAO",
    description: "Join the exclusive crypto trading community",
    theme: "primary",
    placement: "card"
  },
  {
    id: "2",
    programId: "societi",
    buttonText: "Try Societi Free",
    description: "Connect with like-minded individuals in our network",
    theme: "default",
    placement: "inline"
  },
  {
    id: "3",
    programId: "aifc",
    buttonText: "Learn AI Development",
    description: "Master AI development with our comprehensive course",
    theme: "minimal",
    placement: "banner",
    position: "bottom"
  }
];

const CTAManager = () => {
  const [ctas, setCTAs] = useState<CampaignCTA[]>(mockCTAs);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [currentCTA, setCurrentCTA] = useState<CampaignCTA | null>(null);
  const [formData, setFormData] = useState<Partial<CampaignCTA>>({
    programId: "",
    buttonText: "",
    description: "",
    theme: "default",
    placement: "inline",
    position: "bottom"
  });
  const { toast } = useToast();

  const handleAddCTA = () => {
    setFormData({
      programId: "",
      buttonText: "",
      description: "",
      theme: "default",
      placement: "inline",
      position: "bottom"
    });
    setIsAddDialogOpen(true);
  };

  const handleEditCTA = (cta: CampaignCTA) => {
    setCurrentCTA(cta);
    setFormData({ ...cta });
    setIsEditDialogOpen(true);
  };

  const handlePreviewCTA = (cta: CampaignCTA) => {
    setCurrentCTA(cta);
    setIsPreviewDialogOpen(true);
  };

  const handleSaveCTA = () => {
    if (!formData.programId || !formData.buttonText || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newCTA: CampaignCTA = {
      id: formData.id || Date.now().toString(),
      programId: formData.programId || "",
      buttonText: formData.buttonText || "",
      description: formData.description || "",
      theme: formData.theme || "default",
      placement: formData.placement || "inline",
      position: formData.position || "bottom"
    };

    if (isEditDialogOpen) {
      setCTAs(ctas.map(c => c.id === newCTA.id ? newCTA : c));
      toast({
        title: "CTA updated",
        description: `${newCTA.buttonText} has been updated successfully`
      });
      setIsEditDialogOpen(false);
    } else {
      setCTAs([...ctas, newCTA]);
      toast({
        title: "CTA added",
        description: `${newCTA.buttonText} has been added successfully`
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteCTA = (id: string) => {
    if (confirm("Are you sure you want to delete this CTA? This action cannot be undone.")) {
      setCTAs(ctas.filter(c => c.id !== id));
      toast({
        title: "CTA deleted",
        description: "The call-to-action has been deleted"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const getProgramName = (programId: string) => {
    const program = mockPrograms.find(p => p.id === programId);
    return program ? program.name : "Unknown Program";
  };

  const getProgramPlatform = (programId: string) => {
    const program = mockPrograms.find(p => p.id === programId);
    return program ? program.platform : "insiderlife";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Call to Actions</h2>
        <Button onClick={handleAddCTA} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" /> Add CTA
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ctas.map((cta) => (
          <Card key={cta.id}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{cta.buttonText}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    {getProgramName(cta.programId)}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handlePreviewCTA(cta)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEditCTA(cta)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleDeleteCTA(cta.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {cta.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
                  {cta.placement}
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
                  {cta.theme}
                </span>
                {cta.position && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
                    {cta.position}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add CTA Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Call to Action</DialogTitle>
            <DialogDescription>
              Create a new CTA that can be added to content
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="programId">Program *</Label>
              <Select
                onValueChange={(value) => handleSelectChange("programId", value)}
                value={formData.programId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {mockPrograms.filter(p => p.isActive).map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="buttonText">Button Text *</Label>
              <Input
                id="buttonText"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleInputChange}
                placeholder="e.g., Join Now"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the offer"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="placement">Placement</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("placement", value)}
                  value={formData.placement}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select placement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inline">Inline</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("theme", value)}
                  value={formData.theme}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {formData.placement === "banner" && (
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("position", value)}
                  value={formData.position}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCTA}>Save CTA</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit CTA Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Call to Action</DialogTitle>
            <DialogDescription>
              Update the details of this CTA
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-programId">Program *</Label>
              <Select
                onValueChange={(value) => handleSelectChange("programId", value)}
                value={formData.programId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {mockPrograms.filter(p => p.isActive).map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-buttonText">Button Text *</Label>
              <Input
                id="edit-buttonText"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleInputChange}
                placeholder="e.g., Join Now"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the offer"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-placement">Placement</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("placement", value)}
                  value={formData.placement}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select placement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inline">Inline</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-theme">Theme</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("theme", value)}
                  value={formData.theme}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {formData.placement === "banner" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-position">Position</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("position", value)}
                  value={formData.position}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCTA}>Update CTA</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview CTA Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>CTA Preview</DialogTitle>
            <DialogDescription>
              This is how the CTA will appear to users
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {currentCTA && (
              <div className="space-y-4">
                <div className="border p-4 rounded-md">
                  <GlobalCTA
                    id={currentCTA.id}
                    title={currentCTA.buttonText}
                    description={currentCTA.description}
                    buttonText={currentCTA.buttonText}
                    buttonUrl="#"
                    type={currentCTA.placement as any}
                    brand={getProgramPlatform(currentCTA.programId)}
                    theme={currentCTA.theme as any}
                    position={currentCTA.position as any}
                  />
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-1">How it works:</h3>
                  <p className="text-sm text-muted-foreground">
                    When users view or share content with this CTA, the button link will automatically include their personal referral link for {getProgramName(currentCTA.programId)}. This ensures they get credit for any signups that come through their shared content.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CTAManager;

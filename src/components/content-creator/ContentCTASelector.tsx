
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { CampaignCTA, ContentCTA, ReferralProgram } from "@/types/referral";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AddContentCTADialog from "./AddContentCTADialog";
import EditContentCTADialog from "./EditContentCTADialog";
import PreviewContentCTADialog from "./PreviewContentCTADialog";

// Mock data - in a real app, this would come from an API or props
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

interface ContentCTASelectorProps {
  contentId: string;
  selectedCTAs: ContentCTA[];
  onChange: (ctas: ContentCTA[]) => void;
}

const ContentCTASelector: React.FC<ContentCTASelectorProps> = ({ 
  contentId, 
  selectedCTAs, 
  onChange 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [currentCTA, setCurrentCTA] = useState<ContentCTA | null>(null);
  const [formData, setFormData] = useState<Partial<ContentCTA>>({
    contentId: contentId,
    campaignId: "",
    buttonText: "",
    description: "",
    theme: "default",
    placement: "inline",
    position: "bottom"
  });
  const { toast } = useToast();

  const handleAddCTA = () => {
    setFormData({
      contentId: contentId,
      campaignId: "",
      buttonText: "",
      description: "",
      theme: "default",
      placement: "inline",
      position: "bottom"
    });
    setIsAddDialogOpen(true);
  };

  const handleEditCTA = (cta: ContentCTA) => {
    setCurrentCTA(cta);
    setFormData({ ...cta });
    setIsEditDialogOpen(true);
  };

  const handlePreviewCTA = (cta: ContentCTA) => {
    setCurrentCTA(cta);
    setIsPreviewDialogOpen(true);
  };

  const handleSaveCTA = () => {
    if (!formData.campaignId || !formData.buttonText) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newCTA: ContentCTA = {
      id: formData.id || Date.now().toString(),
      contentId: contentId,
      campaignId: formData.campaignId || "",
      buttonText: formData.buttonText || "",
      description: formData.description || "",
      theme: formData.theme as 'default' | 'primary' | 'minimal' || "default",
      placement: formData.placement as 'inline' | 'banner' | 'card' || "inline",
      position: formData.position as 'top' | 'bottom' || "bottom"
    };

    let updatedCTAs: ContentCTA[];

    if (isEditDialogOpen) {
      updatedCTAs = selectedCTAs.map(c => c.id === newCTA.id ? newCTA : c);
      toast({
        title: "CTA updated",
        description: `${newCTA.buttonText} has been updated successfully`
      });
      setIsEditDialogOpen(false);
    } else {
      updatedCTAs = [...selectedCTAs, newCTA];
      toast({
        title: "CTA added",
        description: `${newCTA.buttonText} has been added successfully`
      });
      setIsAddDialogOpen(false);
    }

    onChange(updatedCTAs);
  };

  const handleDeleteCTA = (id: string) => {
    const updatedCTAs = selectedCTAs.filter(c => c.id !== id);
    onChange(updatedCTAs);
    
    toast({
      title: "CTA deleted",
      description: "The call-to-action has been removed from this content"
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const getCampaignName = (campaignId: string) => {
    const program = mockPrograms.find(p => p.id === campaignId);
    return program ? program.name : "Unknown Campaign";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Content Call-to-Actions</h3>
        <Button onClick={handleAddCTA} variant="outline" size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add CTA
        </Button>
      </div>

      {selectedCTAs.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-md text-muted-foreground">
          No CTAs added to this content yet. Add a CTA to drive conversions.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {selectedCTAs.map((cta) => (
            <Card key={cta.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{cta.buttonText}</h4>
                    <p className="text-sm text-muted-foreground">{cta.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
                        {getCampaignName(cta.campaignId)}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
                        {cta.placement}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
                        {cta.theme}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handlePreviewCTA(cta)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditCTA(cta)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCTA(cta.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddContentCTADialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        formData={formData}
        programs={mockPrograms}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSave={handleSaveCTA}
      />

      <EditContentCTADialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        programs={mockPrograms}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSave={handleSaveCTA}
      />

      <PreviewContentCTADialog
        open={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
        currentCTA={currentCTA}
        getCampaignName={getCampaignName}
      />
    </div>
  );
};

export default ContentCTASelector;


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ReferralProgram, CampaignCTA } from "@/types/referral";
import { useToast } from "@/hooks/use-toast";
import CTACard from "./CTACard";
import AddCTADialog from "./AddCTADialog";
import EditCTADialog from "./EditCTADialog";
import PreviewCTADialog from "./PreviewCTADialog";

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
          <CTACard 
            key={cta.id}
            cta={cta}
            programName={getProgramName(cta.programId)}
            onPreview={handlePreviewCTA}
            onEdit={handleEditCTA}
            onDelete={handleDeleteCTA}
          />
        ))}
      </div>

      {/* Dialogs */}
      <AddCTADialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        formData={formData}
        programs={mockPrograms}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSave={handleSaveCTA}
      />

      <EditCTADialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        programs={mockPrograms}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSave={handleSaveCTA}
      />

      <PreviewCTADialog
        open={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
        currentCTA={currentCTA}
        getProgramName={getProgramName}
        getProgramPlatform={getProgramPlatform}
      />
    </div>
  );
};

export default CTAManager;

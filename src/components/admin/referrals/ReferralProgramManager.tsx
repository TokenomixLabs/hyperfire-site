
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ReferralProgram } from "@/types/referral";
import { ReferralPlatform } from "@/context/ReferralContext";
import { useToast } from "@/hooks/use-toast";
import ProgramCard from "./ProgramCard";
import AddProgramDialog from "./AddProgramDialog";
import EditProgramDialog from "./EditProgramDialog";

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

const ReferralProgramManager = () => {
  const [programs, setPrograms] = useState<ReferralProgram[]>(mockPrograms);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<ReferralProgram | null>(null);
  const [formData, setFormData] = useState<Partial<ReferralProgram>>({
    name: "",
    platform: "insiderlife",
    description: "",
    linkFormat: "",
    logoUrl: "",
    isActive: true
  });
  const { toast } = useToast();

  const handleAddProgram = () => {
    setFormData({
      name: "",
      platform: "insiderlife",
      description: "",
      linkFormat: "",
      logoUrl: "",
      isActive: true
    });
    setIsAddDialogOpen(true);
  };

  const handleEditProgram = (program: ReferralProgram) => {
    setCurrentProgram(program);
    setFormData({ ...program });
    setIsEditDialogOpen(true);
  };

  const handleSaveProgram = () => {
    if (!formData.name || !formData.platform || !formData.linkFormat) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newProgram: ReferralProgram = {
      id: formData.id || Date.now().toString(),
      name: formData.name || "",
      platform: formData.platform as ReferralPlatform || "insiderlife",
      description: formData.description || "",
      linkFormat: formData.linkFormat || "",
      logoUrl: formData.logoUrl,
      isActive: formData.isActive ?? true,
      createdAt: formData.createdAt || new Date().toISOString()
    };

    if (isEditDialogOpen) {
      setPrograms(programs.map(p => p.id === newProgram.id ? newProgram : p));
      toast({
        title: "Program updated",
        description: `${newProgram.name} has been updated successfully`
      });
      setIsEditDialogOpen(false);
    } else {
      setPrograms([...programs, newProgram]);
      toast({
        title: "Program added",
        description: `${newProgram.name} has been added successfully`
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteProgram = (id: string) => {
    if (confirm("Are you sure you want to delete this program? This action cannot be undone.")) {
      setPrograms(programs.filter(p => p.id !== id));
      toast({
        title: "Program deleted",
        description: "The referral program has been deleted"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, isActive: checked });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Referral Programs</h2>
        <Button onClick={handleAddProgram} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" /> Add Program
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onEdit={handleEditProgram}
            onDelete={handleDeleteProgram}
          />
        ))}
      </div>

      {/* Dialogs */}
      <AddProgramDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        formData={formData}
        onInputChange={handleInputChange}
        onSwitchChange={handleSwitchChange}
        onSave={handleSaveProgram}
      />

      <EditProgramDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        onInputChange={handleInputChange}
        onSwitchChange={handleSwitchChange}
        onSave={handleSaveProgram}
      />
    </div>
  );
};

export default ReferralProgramManager;

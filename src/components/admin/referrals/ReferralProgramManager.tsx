
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ReferralProgram, ReferralPlatform } from "@/types/referral";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
          <Card key={program.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {program.logoUrl && (
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                      <img src={program.logoUrl} alt={program.name} className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{program.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{program.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditProgram(program)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">Edit program</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => handleDeleteProgram(program.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">Delete program</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground truncate flex-grow">
                  {program.linkFormat}
                </span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${program.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                  {program.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Program Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Referral Program</DialogTitle>
            <DialogDescription>
              Create a new referral program for your users to join
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Program Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., New Referral Program"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="platform">Platform ID *</Label>
              <Input
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                placeholder="e.g., newprogram"
              />
              <p className="text-xs text-muted-foreground">
                Unique identifier used in code (lowercase, no spaces)
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what this program is for"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="linkFormat">Link Format *</Label>
              <div className="relative">
                <Input
                  id="linkFormat"
                  name="linkFormat"
                  value={formData.linkFormat}
                  onChange={handleInputChange}
                  placeholder="https://example.com/?ref={username}"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        <Info className="h-4 w-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-sm">
                      <p>Use {"{username}"} as a placeholder for where the referral code should be inserted</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProgram}>Save Program</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Program Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Referral Program</DialogTitle>
            <DialogDescription>
              Update the details of this referral program
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Program Name *</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., New Referral Program"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-platform">Platform ID</Label>
              <Input
                id="edit-platform"
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                placeholder="e.g., newprogram"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Platform ID cannot be changed after creation
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what this program is for"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-linkFormat">Link Format *</Label>
              <div className="relative">
                <Input
                  id="edit-linkFormat"
                  name="linkFormat"
                  value={formData.linkFormat}
                  onChange={handleInputChange}
                  placeholder="https://example.com/?ref={username}"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        <Info className="h-4 w-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-sm">
                      <p>Use {"{username}"} as a placeholder for where the referral code should be inserted</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-logoUrl">Logo URL</Label>
              <Input
                id="edit-logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProgram}>Update Program</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReferralProgramManager;

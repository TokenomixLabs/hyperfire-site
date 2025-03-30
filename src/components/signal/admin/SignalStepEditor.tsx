
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignalStep } from '@/types/signal';
import { ContentCTA } from '@/types/referral';
import { PlusCircle, Trash2 } from 'lucide-react';
import ContentCTAForm from '@/components/content-creator/ContentCTAForm';
import { ReferralProgram } from '@/types/referral';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface SignalStepEditorProps {
  step: SignalStep;
  onSave: (step: SignalStep) => void;
  onCancel: () => void;
}

// Mock referral programs for demo
const mockPrograms: ReferralProgram[] = [
  {
    id: "insiderdao",
    name: "InsiderDAO",
    platform: "insiderdao",
    description: "Crypto trading community and signals",
    linkFormat: "https://insiderdao.com/?ref={username}",
    logoUrl: "/logos/insiderdao.png",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "insiderlife",
    name: "InsiderLife",
    platform: "insiderlife",
    description: "Digital lifestyle community",
    linkFormat: "https://insiderlife.com/?ref={username}",
    logoUrl: "/logos/insiderlife.png",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "societi",
    name: "Societi",
    platform: "societi",
    description: "Social media optimization platform",
    linkFormat: "https://societi.com/?ref={username}",
    logoUrl: "/logos/societi.png",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "aifc",
    name: "AI Freedom Code",
    platform: "aifc",
    description: "AI development training program",
    linkFormat: "https://aifc.com/?ref={username}",
    logoUrl: "/logos/aifc.png",
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const SignalStepEditor: React.FC<SignalStepEditorProps> = ({
  step,
  onSave,
  onCancel
}) => {
  const [editedStep, setEditedStep] = useState<SignalStep>({...step});
  const [activeTab, setActiveTab] = useState("content");
  const [addingCTA, setAddingCTA] = useState(false);
  const [editingCTAIndex, setEditingCTAIndex] = useState<number | null>(null);
  const [ctaFormData, setCTAFormData] = useState<Partial<ContentCTA>>({});

  useEffect(() => {
    setEditedStep({...step});
  }, [step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedStep(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(editedStep);
  };

  const openAddCTADialog = () => {
    setCTAFormData({
      id: `cta-${Date.now()}`,
      contentId: editedStep.id,
      campaignId: mockPrograms[0].id,
      buttonText: "Join Now",
      description: "Sign up today to get access",
      theme: "default",
      placement: "inline",
      position: "bottom"
    });
    setAddingCTA(true);
    setEditingCTAIndex(null);
  };

  const openEditCTADialog = (index: number) => {
    setCTAFormData({...editedStep.ctas[index]});
    setAddingCTA(true);
    setEditingCTAIndex(index);
  };

  const handleCTAFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCTAFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCTAFormSelectChange = (name: string, value: string) => {
    setCTAFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveCTA = () => {
    // Create a complete CTA object from the form data
    const completeCTA = ctaFormData as ContentCTA;
    
    const newCTAs = [...editedStep.ctas];
    
    if (editingCTAIndex !== null) {
      // Update existing CTA
      newCTAs[editingCTAIndex] = completeCTA;
    } else {
      // Add new CTA
      newCTAs.push(completeCTA);
    }
    
    setEditedStep(prev => ({
      ...prev,
      ctas: newCTAs
    }));
    
    setAddingCTA(false);
    setEditingCTAIndex(null);
    setCTAFormData({});
  };

  const deleteCTA = (index: number) => {
    const newCTAs = [...editedStep.ctas];
    newCTAs.splice(index, 1);
    
    setEditedStep(prev => ({
      ...prev,
      ctas: newCTAs
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{step.id.startsWith('step-') ? 'Add New Step' : 'Edit Step'}</CardTitle>
        <CardDescription>Define content and calls to action for this step</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="ctas">
              Call to Actions ({editedStep.ctas.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Step Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter step title"
                value={editedStep.title}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Enter step content in markdown format"
                value={editedStep.content}
                onChange={handleInputChange}
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                Supports Markdown formatting for rich text content
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="videoEmbed">Video Embed (optional)</Label>
              <Input
                id="videoEmbed"
                name="videoEmbed"
                placeholder="Enter video embed code or URL"
                value={editedStep.videoEmbed || ''}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                YouTube, Vimeo or other embed code
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mediaUrl">Media URL (optional)</Label>
              <Input
                id="mediaUrl"
                name="mediaUrl"
                placeholder="https://example.com/media.jpg"
                value={editedStep.mediaUrl || ''}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Image or other media to display with this step
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="ctas" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Step CTAs</h3>
              <Button type="button" onClick={openAddCTADialog} variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Add CTA
              </Button>
            </div>
            
            {editedStep.ctas.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-md">
                <h4 className="font-medium mb-2">No CTAs Added Yet</h4>
                <p className="text-muted-foreground mb-4">
                  Add calls to action to engage your audience
                </p>
                <Button type="button" onClick={openAddCTADialog} variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add First CTA
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {editedStep.ctas.map((cta, index) => {
                  const program = mockPrograms.find(p => p.id === cta.campaignId);
                  
                  return (
                    <div key={cta.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50">
                      <div>
                        <h4 className="font-medium">{cta.buttonText}</h4>
                        <p className="text-sm text-muted-foreground">
                          {program?.name || cta.campaignId} • {cta.placement} • {cta.theme}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditCTADialog(index)}
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.33168 11.3754 6.42165 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42165 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42165 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteCTA(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          Save Step
        </Button>
      </CardFooter>

      {/* CTA Dialog */}
      <Dialog open={addingCTA} onOpenChange={setAddingCTA}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCTAIndex !== null ? 'Edit Call to Action' : 'Add Call to Action'}</DialogTitle>
          </DialogHeader>
          
          <ContentCTAForm 
            formData={ctaFormData}
            programs={mockPrograms}
            onInputChange={handleCTAFormInputChange}
            onSelectChange={handleCTAFormSelectChange}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddingCTA(false)}>Cancel</Button>
            <Button onClick={saveCTA}>
              {editingCTAIndex !== null ? 'Update CTA' : 'Add CTA'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SignalStepEditor;

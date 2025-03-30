
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignalStep } from '@/types/signal';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useStepEditor } from './step-editor/useStepEditor';
import ContentTabFields from './step-editor/ContentTabFields';
import CTAsTabContent from './step-editor/CTAsTabContent';
import CTADialogContent from './step-editor/CTADialogContent';
import { mockPrograms } from './step-editor/mockData';

interface SignalStepEditorProps {
  step: SignalStep;
  onSave: (step: SignalStep) => void;
  onCancel: () => void;
}

const SignalStepEditor: React.FC<SignalStepEditorProps> = ({
  step,
  onSave,
  onCancel
}) => {
  const {
    editedStep,
    activeTab,
    addingCTA,
    editingCTAIndex,
    ctaFormData,
    setActiveTab,
    setAddingCTA,
    handleInputChange,
    handleSave,
    openAddCTADialog,
    openEditCTADialog,
    handleCTAFormInputChange,
    handleCTAFormSelectChange,
    saveCTA,
    deleteCTA
  } = useStepEditor(step, onSave, onCancel);

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
            <ContentTabFields 
              editedStep={editedStep}
              handleInputChange={handleInputChange}
            />
          </TabsContent>
          
          <TabsContent value="ctas" className="space-y-4">
            <CTAsTabContent
              editedStep={editedStep}
              programs={mockPrograms}
              onAddCTA={openAddCTADialog}
              onEditCTA={openEditCTADialog}
              onDeleteCTA={deleteCTA}
            />
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
          <CTADialogContent
            ctaFormData={ctaFormData}
            programs={mockPrograms}
            isEditing={editingCTAIndex !== null}
            onInputChange={handleCTAFormInputChange}
            onSelectChange={handleCTAFormSelectChange}
            onSave={saveCTA}
            onCancel={() => setAddingCTA(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SignalStepEditor;


import { useState, useEffect } from 'react';
import { SignalStep } from '@/types/signal';
import { ContentCTA } from '@/types/referral';

export const useStepEditor = (initialStep: SignalStep, onSave: (step: SignalStep) => void, onCancel: () => void) => {
  const [editedStep, setEditedStep] = useState<SignalStep>({...initialStep});
  const [activeTab, setActiveTab] = useState("content");
  const [addingCTA, setAddingCTA] = useState(false);
  const [editingCTAIndex, setEditingCTAIndex] = useState<number | null>(null);
  const [ctaFormData, setCTAFormData] = useState<Partial<ContentCTA>>({});

  useEffect(() => {
    setEditedStep({...initialStep});
  }, [initialStep]);

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
      campaignId: "",
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

  return {
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
  };
};

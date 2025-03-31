
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, Grip, Edit, Trash2, ExternalLink, Video, Clock, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CourseModule, CourseFormat } from '@/types/courses';
import { useToast } from '@/hooks/use-toast';

interface ModuleEditorProps {
  modules: CourseModule[];
  setModules: React.Dispatch<React.SetStateAction<CourseModule[]>>;
  courseId: string;
  format: CourseFormat;
}

interface ModuleFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
}

export default function ModuleEditor({ modules, setModules, courseId, format }: ModuleEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [formData, setFormData] = useState<ModuleFormData>({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: 0,
  });
  const { toast } = useToast();
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property
    const updatedModules = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
    
    setModules(updatedModules);
  };
  
  const openAddDialog = () => {
    setEditingModule(null);
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      duration: 0,
    });
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (module: CourseModule) => {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description,
      videoUrl: module.videoUrl,
      thumbnailUrl: module.thumbnailUrl || '',
      duration: module.duration,
    });
    setIsDialogOpen(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value,
    }));
  };
  
  const handleSubmit = () => {
    // Basic validation
    if (!formData.title || !formData.videoUrl) {
      toast({
        title: 'Missing required fields',
        description: 'Title and video URL are required',
        variant: 'destructive',
      });
      return;
    }
    
    if (editingModule) {
      // Update existing module
      const updatedModules = modules.map(module =>
        module.id === editingModule.id
          ? {
              ...module,
              title: formData.title,
              description: formData.description,
              videoUrl: formData.videoUrl,
              thumbnailUrl: formData.thumbnailUrl,
              duration: formData.duration,
            }
          : module
      );
      setModules(updatedModules);
      
      toast({
        title: 'Module updated',
        description: `"${formData.title}" has been updated successfully`,
      });
    } else {
      // Add new module
      const newModule: CourseModule = {
        id: `module-${Date.now()}`,
        courseId,
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        thumbnailUrl: formData.thumbnailUrl,
        duration: formData.duration,
        order: modules.length + 1,
        resources: [],
      };
      
      setModules([...modules, newModule]);
      
      toast({
        title: 'Module added',
        description: `"${formData.title}" has been added successfully`,
      });
    }
    
    setIsDialogOpen(false);
  };
  
  const handleDelete = (moduleId: string) => {
    // Ask for confirmation
    if (window.confirm('Are you sure you want to delete this module?')) {
      const updatedModules = modules
        .filter(module => module.id !== moduleId)
        .map((module, index) => ({
          ...module,
          order: index + 1,
        }));
      
      setModules(updatedModules);
      
      toast({
        title: 'Module deleted',
        description: 'The module has been deleted successfully',
      });
    }
  };
  
  // Helper function to convert seconds to minutes for display
  const formatDuration = (seconds: number) => {
    if (!seconds) return '0 min';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {format === 'video' ? 'Video Content' : 'Course Modules'}
        </h2>
        <Button onClick={openAddDialog} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {format === 'video' ? 'Add Video' : 'Add Module'}
        </Button>
      </div>
      
      {modules.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              {format === 'video'
                ? 'No video content added yet. Add a video to get started.'
                : 'No modules added yet. Add modules to build your course.'}
            </p>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              {format === 'video' ? 'Add Video' : 'Add First Module'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="modules">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {modules.map((module, index) => (
                  <Draggable key={module.id} draggableId={module.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border rounded-md p-4 bg-card"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            {...provided.dragHandleProps}
                            className="mt-1 cursor-move text-muted-foreground"
                          >
                            <Grip className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                              <h3 className="font-medium truncate">
                                {module.order}. {module.title}
                              </h3>
                              
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDuration(module.duration)}
                                </Badge>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(module)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(module.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {module.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                              <div className="flex items-center text-muted-foreground">
                                <Video className="h-3.5 w-3.5 mr-1" />
                                <a 
                                  href={module.videoUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:underline flex items-center"
                                >
                                  Video URL
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                              
                              {module.thumbnailUrl && (
                                <div className="flex items-center text-muted-foreground">
                                  <a 
                                    href={module.thumbnailUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:underline flex items-center"
                                  >
                                    Thumbnail
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingModule ? 'Edit Module' : 'Add Module'}</DialogTitle>
            <DialogDescription>
              {editingModule
                ? 'Edit the details of this module'
                : 'Fill out the details for the new module'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Enter module title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Enter module description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleFormChange}
                placeholder="https://example.com/video.mp4"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL (Optional)</Label>
              <Input
                id="thumbnailUrl"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleFormChange}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (in seconds)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration.toString()}
                onChange={handleFormChange}
                placeholder="Enter duration in seconds"
              />
              <p className="text-xs text-muted-foreground">
                {formatDuration(formData.duration)}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              {editingModule ? 'Update Module' : 'Add Module'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

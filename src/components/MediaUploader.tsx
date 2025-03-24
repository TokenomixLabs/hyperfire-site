
import { useState, useRef } from "react";
import { Upload, X, FileText, Image, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface MediaUploaderProps {
  onUploadComplete: () => void;
}

type MediaType = "image" | "document" | "video";

interface FileWithPreview extends File {
  preview?: string;
}

const MediaUploader = ({ onUploadComplete }: MediaUploaderProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files) as FileWithPreview[];
      
      // Generate previews for images
      selectedFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          file.preview = URL.createObjectURL(file);
        }
      });
      
      setFiles(selectedFiles);
      
      // Auto-detect media type based on file
      if (selectedFiles[0].type.startsWith('image/')) {
        setMediaType('image');
      } else if (selectedFiles[0].type.startsWith('video/')) {
        setMediaType('video');
      } else {
        setMediaType('document');
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files) as FileWithPreview[];
      
      // Generate previews for images
      droppedFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          file.preview = URL.createObjectURL(file);
        }
      });
      
      setFiles(droppedFiles);
      
      // Auto-detect media type based on file
      if (droppedFiles[0].type.startsWith('image/')) {
        setMediaType('image');
      } else if (droppedFiles[0].type.startsWith('video/')) {
        setMediaType('video');
      } else {
        setMediaType('document');
      }
    }
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...files];
    
    // Release object URL if we created one
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview!);
    }
    
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-5 w-5" />;
    } else if (file.type.startsWith('video/')) {
      return <Film className="h-5 w-5" />;
    } else {
      return <FileText className="h-5 w-5" />;
    }
  };
  
  const handleUpload = () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          
          // In a real app, here we would make an API call with the files and metadata
          console.log("Uploaded:", {
            files,
            mediaType,
            title,
            description,
            tags: tags.split(',').map(tag => tag.trim()),
            category
          });
          
          // Release object URLs
          files.forEach(file => {
            if (file.preview) {
              URL.revokeObjectURL(file.preview);
            }
          });
          
          onUploadComplete();
        }, 500);
      }
    }, 300);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer"
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
        
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-lg font-medium">Drop files here or click to browse</p>
            <p className="text-sm text-muted-foreground mt-1">
              Support for images, documents, and videos
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 bg-muted/20 rounded border"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  {file.preview ? (
                    <img 
                      src={file.preview} 
                      alt="Preview"
                      className="h-10 w-10 object-cover rounded" 
                    />
                  ) : (
                    <div className="h-10 w-10 flex items-center justify-center rounded bg-muted/40">
                      {getFileIcon(file)}
                    </div>
                  )}
                  <div className="truncate">
                    <p className="text-sm font-medium truncate max-w-[220px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {files.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Media title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="media-type">Media Type</Label>
              <Select value={mediaType} onValueChange={(value: MediaType) => setMediaType(value)}>
                <SelectTrigger id="media-type">
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="premium, finance, crypto"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reports">Reports</SelectItem>
                  <SelectItem value="articles">Articles</SelectItem>
                  <SelectItem value="presentations">Presentations</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="uncategorized">Uncategorized</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <div className="flex justify-end pt-2">
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || files.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isUploading ? "Uploading..." : "Upload Media"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;

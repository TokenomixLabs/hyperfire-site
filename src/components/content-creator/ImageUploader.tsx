
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  image: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

const ImageUploader = ({ image, onImageUpload, onRemoveImage }: ImageUploaderProps) => {
  return (
    <div>
      <FormLabel className="block mb-2">Featured Image</FormLabel>
      {image ? (
        <div className="relative rounded-md overflow-hidden border h-48">
          <img
            src={image}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center h-48">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop or click to upload
          </p>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={onImageUpload}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            Select Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

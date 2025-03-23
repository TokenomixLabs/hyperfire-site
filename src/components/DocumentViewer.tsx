
import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, Tag, FileText, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandSelector from './BrandSelector';
import AnimatedTransition from './AnimatedTransition';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  content?: string;
  previewUrl?: string;
  size: string;
  uploadDate: string;
  lastModified: string;
  author: string;
  brand: string;
  tags: string[];
  thumbnail?: string;
  isPremium: boolean;
  downloadUrl: string;
}

interface DocumentViewerProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (document: Document) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  isOpen,
  onClose,
  onDownload,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Reset state when document changes
    setActiveTab('preview');
    setIsFullscreen(false);
  }, [document]);

  if (!document) return null;

  const getBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'insiderlife':
        return 'bg-insider-600 text-white';
      case 'tokenomix':
        return 'bg-blue-600 text-white';
      case 'insiderdao':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const handleUnlockPremium = () => {
    toast({
      title: "Premium Content",
      description: "Please upgrade your account to access premium documents.",
      duration: 5000,
    });
  };

  const renderDocumentContent = () => {
    if (document.isPremium) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-[60vh]">
          <div className="mb-6">
            <Badge className="mb-4 py-1 px-3 bg-gradient-to-r from-amber-500 to-amber-700 border-0">
              Premium Content
            </Badge>
            <h3 className="text-xl font-medium mb-2">This document requires premium access</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Upgrade your InsiderLife subscription to view and download this document.
            </p>
          </div>
          <Button onClick={handleUnlockPremium} className="mb-2">
            Upgrade to Premium
          </Button>
          <Button variant="outline" onClick={onClose} className="mt-2">
            Back to Document Vault
          </Button>
        </div>
      );
    }

    if (document.previewUrl) {
      return (
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : 'h-[60vh]'}`}>
          <div className="relative w-full h-full">
            {isFullscreen && (
              <div className="absolute top-2 right-2 z-10 flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => setIsFullscreen(false)}>
                  <ArrowLeft size={16} />
                </Button>
              </div>
            )}
            <iframe
              src={document.previewUrl}
              className="w-full h-full border border-gray-200 dark:border-gray-800 rounded-md"
              title={document.title}
            />
          </div>
        </div>
      );
    }

    if (document.content) {
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert overflow-auto p-4 h-[60vh] border border-gray-200 dark:border-gray-800 rounded-md">
          <div dangerouslySetInnerHTML={{ __html: document.content }} />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-[60vh]">
        <FileText size={48} className="text-gray-400 mb-4" />
        <h3 className="text-xl font-medium mb-2">Preview not available</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This document doesn't have a preview. You can download it to view its contents.
        </p>
        <Button onClick={() => onDownload(document)}>
          <Download size={16} className="mr-2" />
          Download Document
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`max-w-5xl p-0 ${isFullscreen ? 'fixed inset-0 max-h-screen h-screen' : ''}`}>
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">{document.title}</DialogTitle>
            {!isFullscreen && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={18} />
              </Button>
            )}
          </div>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {document.description}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-200 dark:border-gray-800 px-6">
            <TabsList className="h-12">
              <TabsTrigger value="preview" className="data-[state=active]:border-b-2 data-[state=active]:border-insider-600 data-[state=active]:text-insider-600 rounded-none">
                Preview
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:border-b-2 data-[state=active]:border-insider-600 data-[state=active]:text-insider-600 rounded-none">
                Details
              </TabsTrigger>
              <TabsTrigger value="related" className="data-[state=active]:border-b-2 data-[state=active]:border-insider-600 data-[state=active]:text-insider-600 rounded-none">
                Related Documents
              </TabsTrigger>
            </TabsList>
          </div>
          
          <AnimatedTransition>
            <TabsContent value="preview" className="p-6 focus:outline-none">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Badge variant="secondary" className={`${getBrandColor(document.brand)}`}>
                    {document.brand}
                  </Badge>
                  <Badge variant="outline" className="ml-2">
                    {document.category}
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  {!document.isPremium && (
                    <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                      <ExternalLink size={16} className="mr-2" />
                      {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    onClick={() => onDownload(document)}
                    disabled={document.isPremium}
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              
              {renderDocumentContent()}
            </TabsContent>
            
            <TabsContent value="details" className="p-6 focus:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="aspect-square w-full overflow-hidden rounded-lg mb-4">
                    {document.thumbnail ? (
                      <img 
                        src={document.thumbnail} 
                        alt={document.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <FileText size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className={`${getBrandColor(document.brand)}`}>
                      {document.brand}
                    </Badge>
                    <span className="flex items-center text-sm">
                      <FileText size={16} className="mr-1" />
                      {document.type}
                    </span>
                  </div>
                  
                  {document.isPremium && (
                    <Badge className="w-full justify-center py-1.5 mb-4 bg-gradient-to-r from-amber-500 to-amber-700 border-0">
                      Premium Content
                    </Badge>
                  )}
                </div>
                
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Document Information</h4>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <dt className="text-gray-500 dark:text-gray-400">Size</dt>
                        <dd>{document.size}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500 dark:text-gray-400">Upload Date</dt>
                        <dd>{document.uploadDate}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500 dark:text-gray-400">Last Modified</dt>
                        <dd>{document.lastModified}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500 dark:text-gray-400">Author</dt>
                        <dd>{document.author}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {document.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                          <Tag size={12} className="mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {document.isPremium ? (
                    <div className="pt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        This premium document is available to InsiderLife subscribers. Upgrade your account to download this and other premium resources.
                      </p>
                      <Button className="w-full" onClick={handleUnlockPremium}>
                        Upgrade to Premium
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="mt-4"
                      onClick={() => onDownload(document)}
                    >
                      <Download size={16} className="mr-2" />
                      Download Document
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="related" className="p-6 focus:outline-none">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Related Documents</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Documents related to {document.title} by brand, category, or tags.
                </p>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Filter by:</h4>
                  <BrandSelector />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* This would be populated with actual related documents in a real implementation */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">Guide</Badge>
                    <span className="text-xs text-gray-500">PDF</span>
                  </div>
                  <h5 className="font-medium mb-1 line-clamp-2">Related Document Example</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    This is an example of what a related document card would look like.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      Tokenomix
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <Download size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">Report</Badge>
                    <span className="text-xs text-gray-500">PDF</span>
                  </div>
                  <h5 className="font-medium mb-1 line-clamp-2">Another Related Example</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    This is another example of a related document based on similar tags.
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-insider-600 text-white">
                      InsiderLife
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <Download size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </AnimatedTransition>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;

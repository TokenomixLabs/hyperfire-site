
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import AnimatedTransition from "@/components/AnimatedTransition";
import ContentApprovalItem from "@/components/ContentApprovalItem";
import { useToast } from "@/hooks/use-toast";

// Mock data for pending approvals
const mockPendingItems = [
  {
    id: "1",
    title: "Crypto Market Outlook - Q3 2023",
    type: "article",
    author: "Jane Smith",
    submittedDate: "2023-08-15",
    scheduledDate: "2023-08-22",
    status: "pending",
    thumbnail: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "NFT Investment Strategy Webinar",
    type: "livestream",
    author: "Mike Johnson",
    submittedDate: "2023-08-14",
    scheduledDate: "2023-08-25",
    status: "pending",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "DeFi Risk Management Framework",
    type: "document",
    author: "Sarah Williams",
    submittedDate: "2023-08-12",
    scheduledDate: "2023-08-20",
    status: "pending",
    thumbnail: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop"
  }
];

// Mock data for approved items
const mockApprovedItems = [
  {
    id: "4",
    title: "Bitcoin Technical Analysis - August",
    type: "article",
    author: "John Doe",
    submittedDate: "2023-08-10",
    approvedDate: "2023-08-12",
    scheduledDate: "2023-08-18",
    status: "approved",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Ethereum Merge Implications",
    type: "document",
    author: "Lisa Chen",
    submittedDate: "2023-08-08",
    approvedDate: "2023-08-11",
    scheduledDate: "2023-08-16",
    status: "approved",
    thumbnail: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop"
  }
];

// Mock data for rejected items
const mockRejectedItems = [
  {
    id: "6",
    title: "Altcoin Season Predictions",
    type: "article",
    author: "Robert Taylor",
    submittedDate: "2023-08-09",
    rejectedDate: "2023-08-11",
    status: "rejected",
    rejectionReason: "Needs more research and data to support claims",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
  }
];

const ContentApproval = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoBack = () => {
    navigate("/admin");
  };

  const filterContentByType = (items: any[]) => {
    if (contentTypeFilter === "all") return items;
    return items.filter(item => item.type === contentTypeFilter);
  };

  const handleApprove = (id: string) => {
    toast({
      title: "Content Approved",
      description: "The content has been approved and scheduled for publishing.",
      variant: "default",
    });
    // In a real app, this would update the database
  };

  const handleReject = (id: string, reason: string) => {
    toast({
      title: "Content Rejected",
      description: `The content has been rejected. Reason: ${reason}`,
      variant: "destructive",
    });
    // In a real app, this would update the database
  };

  return (
    <AnimatedTransition className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleGoBack}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Content Approval</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={contentTypeFilter}
            onValueChange={setContentTypeFilter}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="article">Articles</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="livestream">Livestreams</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 mb-8">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({filterContentByType(mockPendingItems).length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approved ({filterContentByType(mockApprovedItems).length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Rejected ({filterContentByType(mockRejectedItems).length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {filterContentByType(mockPendingItems).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No pending content matches your filter.</p>
            </div>
          ) : (
            filterContentByType(mockPendingItems).map((item) => (
              <ContentApprovalItem 
                key={item.id}
                item={item}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="space-y-4">
          {filterContentByType(mockApprovedItems).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No approved content matches your filter.</p>
            </div>
          ) : (
            filterContentByType(mockApprovedItems).map((item) => (
              <ContentApprovalItem 
                key={item.id}
                item={item}
                showActions={false}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          {filterContentByType(mockRejectedItems).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No rejected content matches your filter.</p>
            </div>
          ) : (
            filterContentByType(mockRejectedItems).map((item) => (
              <ContentApprovalItem 
                key={item.id}
                item={item}
                showActions={false}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </AnimatedTransition>
  );
};

export default ContentApproval;

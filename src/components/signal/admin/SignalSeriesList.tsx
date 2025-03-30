
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, BarChart2, Copy, Trash2, ArrowUpRight, Eye } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SignalSeriesWithStats } from '@/types/signal';
import { useNavigate } from 'react-router-dom';

interface SignalSeriesListProps {
  series: SignalSeriesWithStats[];
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const SignalSeriesList: React.FC<SignalSeriesListProps> = ({
  series,
  onEdit,
  onDuplicate,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      onDelete(selectedId);
      setSelectedId(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleViewSeries = (slug: string) => {
    navigate(`/s/${slug}`);
  };

  const filteredSeries = series.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Signal Series</h2>
        <div className="w-1/3">
          <Input 
            placeholder="Search series..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSeries.map((item) => (
          <Card key={item.id} className="overflow-hidden border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
            {item.thumbnailUrl && (
              <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <Badge variant={item.published ? "default" : "outline"}>
                  {item.published ? "Published" : "Draft"}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                  {item.contentType}
                </Badge>
                <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                  {item.steps.length} steps
                </Badge>
                {item.isDuplicated && (
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                    Duplicated
                  </Badge>
                )}
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-medium">{item.stats.views.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">CTA Clicks</span>
                  <span className="font-medium">{item.stats.ctaClicks.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Conversions</span>
                  <span className="font-medium">{item.stats.conversions.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Shares</span>
                  <span className="font-medium">{item.stats.shares.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleViewSeries(item.slug)}
                className="flex items-center"
              >
                <Eye className="mr-1 h-4 w-4" /> View
              </Button>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(item.id)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Series
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(item.id)}>
                      <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(item.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredSeries.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium mb-2">No Signal Series Found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 
              "No series match your search term. Try a different search." : 
              "You haven't created any Signal Series yet. Click 'Create New Series' to get started."}
          </p>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Signal Series</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Signal Series? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignalSeriesList;

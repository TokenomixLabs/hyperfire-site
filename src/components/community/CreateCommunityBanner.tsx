
import { Button } from "@/components/ui/button";
import { Globe, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CreateCommunityBannerProps {
  compact?: boolean;
  className?: string;
}

const CreateCommunityBanner = ({ compact = false, className = "" }: CreateCommunityBannerProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleCreateCommunity = () => {
    if (isAuthenticated) {
      navigate("/admin/community-cloning");
    } else {
      setLoginDialogOpen(true);
    }
  };

  const handleLoginRedirect = () => {
    setLoginDialogOpen(false);
    navigate("/login", { 
      state: { 
        returnTo: "/admin/community-cloning",
        message: "Log in to create your own SignalFire community" 
      } 
    });
  };

  return (
    <>
      {compact ? (
        <Button
          onClick={handleCreateCommunity}
          className={`flex items-center gap-2 bg-purple-600 hover:bg-purple-700 ${className}`}
        >
          <Globe className="h-4 w-4" />
          Create My Community
        </Button>
      ) : (
        <div className={`rounded-lg border bg-card p-6 shadow-sm ${className}`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-800">
              <Globe className="h-8 w-8" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Create Your Own SignalFire Community</h3>
              <p className="text-muted-foreground mb-4">
                Launch your fully branded community with SignalBoard, Signal Series, Education Hub and more.
                Connect your custom domain and start building your audience today.
              </p>
              
              <Button
                onClick={handleCreateCommunity}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Create My Own SignalFire Community <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You need to sign in to create your own SignalFire community.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoginDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLoginRedirect}>
              Sign in
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateCommunityBanner;

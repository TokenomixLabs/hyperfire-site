
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Link, Copy, UserCheck, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UserReferralStats {
  clicks: number;
  signups: number;
  sharedContent: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  referralLink: string;
  daoReferralLink: string;
  referralStats: UserReferralStats;
}

interface UserReferralStatsProps {
  user: User;
  onClose: () => void;
}

const UserReferralStats = ({ user, onClose }: UserReferralStatsProps) => {
  const [daoReferralLink, setDaoReferralLink] = useState(user.daoReferralLink);
  const { toast } = useToast();

  const handleCopyLink = (link: string, type: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: `${type} referral link copied to clipboard`,
    });
  };

  const handleUpdateDaoLink = () => {
    // In a real app this would update the database
    toast({
      title: "DAO Referral Link Updated",
      description: "Your InsiderDAO referral link has been updated",
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Referral Stats: {user.name}</DialogTitle>
          <DialogDescription>
            View and manage {user.name}'s referral performance
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-md font-medium">Referral Links</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">InsiderLife Referral Link</p>
                <div className="flex items-center gap-2">
                  <Input 
                    value={user.referralLink} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleCopyLink(user.referralLink, "InsiderLife")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">InsiderDAO Referral Link</p>
                <div className="flex items-center gap-2">
                  <Input 
                    value={daoReferralLink} 
                    onChange={(e) => setDaoReferralLink(e.target.value)}
                    className="font-mono text-sm"
                    placeholder="Enter InsiderDAO referral link"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyLink(daoReferralLink, "InsiderDAO")}
                    disabled={!daoReferralLink}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {user.daoReferralLink !== daoReferralLink && (
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={handleUpdateDaoLink}
                  >
                    Update DAO Link
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-medium">Performance Metrics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border p-4 flex flex-col items-center justify-center">
                <Link className="h-6 w-6 text-blue-500 mb-2" />
                <span className="text-2xl font-bold">{user.referralStats.clicks}</span>
                <span className="text-sm text-muted-foreground">Total Clicks</span>
              </div>
              
              <div className="rounded-lg border p-4 flex flex-col items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-500 mb-2" />
                <span className="text-2xl font-bold">{user.referralStats.signups}</span>
                <span className="text-sm text-muted-foreground">Total Signups</span>
              </div>
              
              <div className="rounded-lg border p-4 flex flex-col items-center justify-center">
                <Share2 className="h-6 w-6 text-purple-500 mb-2" />
                <span className="text-2xl font-bold">{user.referralStats.sharedContent}</span>
                <span className="text-sm text-muted-foreground">Content Shared</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-medium">Recent Activity</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Shared "Crypto Market Analysis"</TableCell>
                  <TableCell>May 15, 2023</TableCell>
                  <TableCell>4 clicks, 1 signup</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Shared "Tokenomics Fundamentals"</TableCell>
                  <TableCell>May 10, 2023</TableCell>
                  <TableCell>12 clicks, 3 signups</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Shared "InsiderDAO Governance"</TableCell>
                  <TableCell>May 8, 2023</TableCell>
                  <TableCell>7 clicks, 1 signup</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserReferralStats;

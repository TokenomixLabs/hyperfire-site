
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, Eye } from "lucide-react";
import AnimatedTransition from "@/components/AnimatedTransition";
import { useToast } from "@/hooks/use-toast";
import UserTable from "@/components/user/UserTable";
import UserInviteDialog from "@/components/user/UserInviteDialog";
import UserReferralStats from "@/components/user/UserReferralStats";

// Mock data - in a real app, this would come from an API/database
const mockUsers = [
  { 
    id: "1", 
    name: "Sarah Johnson", 
    email: "sarah@insiderlife.com", 
    role: "admin", 
    status: "active",
    lastActive: "2 hours ago",
    referralLink: "insiderlife.com/?ref=sarahj",
    daoReferralLink: "insiderdao.com/?ref=sarahj",
    referralStats: {
      clicks: 156,
      signups: 24,
      sharedContent: 8
    }
  },
  { 
    id: "2", 
    name: "Alex Chen", 
    email: "alex@insiderlife.com", 
    role: "editor", 
    status: "active",
    lastActive: "1 day ago",
    referralLink: "insiderlife.com/?ref=alexc",
    daoReferralLink: "insiderdao.com/?ref=alexc",
    referralStats: {
      clicks: 89,
      signups: 12,
      sharedContent: 5
    }
  },
  { 
    id: "3", 
    name: "Maria Rodriguez", 
    email: "maria@insiderlife.com", 
    role: "viewer", 
    status: "active",
    lastActive: "3 days ago",
    referralLink: "insiderlife.com/?ref=mariar",
    daoReferralLink: "insiderdao.com/?ref=mariar",
    referralStats: {
      clicks: 42,
      signups: 5,
      sharedContent: 3
    }
  },
  { 
    id: "4", 
    name: "James Wilson", 
    email: "james@example.com", 
    role: "editor", 
    status: "invited",
    lastActive: "Pending acceptance",
    referralLink: "",
    daoReferralLink: "",
    referralStats: {
      clicks: 0,
      signups: 0,
      sharedContent: 0
    }
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [showStats, setShowStats] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoBack = () => {
    navigate("/admin");
  };

  const handleInviteUser = (email: string, role: string) => {
    // In a real app, this would send an invitation and save to the database
    const newUser = {
      id: (users.length + 1).toString(),
      name: email.split('@')[0], // Temporary name from email
      email: email,
      role: role,
      status: "invited",
      lastActive: "Pending acceptance",
      referralLink: "",
      daoReferralLink: "",
      referralStats: {
        clicks: 0,
        signups: 0,
        sharedContent: 0
      }
    };

    setUsers([...users, newUser]);
    setInviteOpen(false);

    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${email}`,
    });
  };

  const handleViewStats = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setShowStats(true);
  };

  const handleCloseStats = () => {
    setShowStats(false);
    setSelectedUser(null);
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
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setInviteOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Invite User
        </Button>
      </div>

      <UserTable 
        users={users} 
        onViewStats={handleViewStats}
      />

      <UserInviteDialog 
        open={inviteOpen} 
        onOpenChange={setInviteOpen} 
        onInvite={handleInviteUser} 
      />

      {showStats && selectedUser && (
        <UserReferralStats
          user={selectedUser}
          onClose={handleCloseStats}
        />
      )}
    </AnimatedTransition>
  );
};

export default UserManagement;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Mail, Check, X, Shield, UserPlus } from "lucide-react";
import AnimatedTransition from "@/components/AnimatedTransition";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Mock data - in a real app, this would come from an API/database
const mockUsers = [
  { 
    id: "1", 
    name: "Sarah Johnson", 
    email: "sarah@insiderlife.com", 
    role: "admin", 
    status: "active",
    lastActive: "2 hours ago", 
  },
  { 
    id: "2", 
    name: "Alex Chen", 
    email: "alex@insiderlife.com", 
    role: "editor", 
    status: "active",
    lastActive: "1 day ago", 
  },
  { 
    id: "3", 
    name: "Maria Rodriguez", 
    email: "maria@insiderlife.com", 
    role: "viewer", 
    status: "active",
    lastActive: "3 days ago", 
  },
  { 
    id: "4", 
    name: "James Wilson", 
    email: "james@example.com", 
    role: "editor", 
    status: "invited",
    lastActive: "Pending acceptance", 
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [inviteOpen, setInviteOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoBack = () => {
    navigate("/admin");
  };

  const handleInviteUser = () => {
    if (!inviteEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send an invitation and save to the database
    const newUser = {
      id: (users.length + 1).toString(),
      name: inviteEmail.split('@')[0], // Temporary name from email
      email: inviteEmail,
      role: inviteRole,
      status: "invited",
      lastActive: "Pending acceptance",
    };

    setUsers([...users, newUser]);
    setInviteEmail("");
    setInviteRole("viewer");
    setInviteOpen(false);

    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}`,
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Admin</Badge>;
      case "editor":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Editor</Badge>;
      case "viewer":
        return <Badge className="bg-gray-600 hover:bg-gray-700">Viewer</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>;
      case "invited":
        return <Badge className="bg-amber-600 hover:bg-amber-700">Invited</Badge>;
      case "suspended":
        return <Badge className="bg-red-600 hover:bg-red-700">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
        
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <UserPlus className="mr-2 h-4 w-4" /> Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a new user</DialogTitle>
              <DialogDescription>
                Send an invitation to a new user to join the CMS.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  placeholder="email@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleInviteUser}>
                <Mail className="mr-2 h-4 w-4" /> Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableCaption>List of users with access to the CMS</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{user.lastActive}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="icon">
                      <Shield className="h-4 w-4" />
                    </Button>
                    {user.status === "invited" ? (
                      <Button variant="outline" size="icon" className="text-amber-600 hover:text-amber-700">
                        <Mail className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AnimatedTransition>
  );
};

export default UserManagement;


import { Shield, Mail, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

interface UserTableProps {
  users: User[];
}

const UserTable = ({ users }: UserTableProps) => {
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
  );
};

export default UserTable;


import { useState } from "react";
import { Key, Plus, RefreshCw, Trash2, Copy, EyeOff, Eye, Shield, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: Date;
  expiresAt: Date | null;
  lastUsed: Date | null;
  active: boolean;
}

const ApiKeyManager = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Content API Key",
      key: "il_pk_c2a9d8e7f6b5a4c3d2e1f0",
      permissions: ["content:read"],
      createdAt: new Date(2023, 6, 15),
      expiresAt: new Date(2024, 6, 15),
      lastUsed: new Date(2023, 7, 28),
      active: true
    },
    {
      id: "2",
      name: "Admin API Key",
      key: "il_pk_a1b2c3d4e5f6g7h8i9j0",
      permissions: ["content:read", "content:write", "users:read"],
      createdAt: new Date(2023, 5, 10),
      expiresAt: null,
      lastUsed: new Date(2023, 7, 30),
      active: true
    }
  ]);
  
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(["content:read"]);
  const [newKeyExpiration, setNewKeyExpiration] = useState<"never" | "30days" | "90days" | "1year">("never");
  const [newKeyDialog, setNewKeyDialog] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  
  const { toast } = useToast();

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const handleCreateKey = () => {
    if (!newKeyName) {
      toast({
        title: "Error",
        description: "Please enter a name for your API key",
        variant: "destructive",
      });
      return;
    }
    
    // Generate a random API key (in a real app this would be done securely on the server)
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let key = "il_pk_";
    for (let i = 0; i < 24; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Set expiration date based on selection
    let expiresAt: Date | null = null;
    if (newKeyExpiration !== "never") {
      expiresAt = new Date();
      if (newKeyExpiration === "30days") expiresAt.setDate(expiresAt.getDate() + 30);
      if (newKeyExpiration === "90days") expiresAt.setDate(expiresAt.getDate() + 90);
      if (newKeyExpiration === "1year") expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }
    
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key,
      permissions: newKeyPermissions,
      createdAt: new Date(),
      expiresAt,
      lastUsed: null,
      active: true
    };
    
    setApiKeys(prev => [...prev, newKey]);
    setGeneratedKey(key);
    
    // Reset form
    setNewKeyName("");
    setNewKeyPermissions(["content:read"]);
    setNewKeyExpiration("never");
    
    toast({
      title: "Success",
      description: "New API key created successfully",
    });
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === id ? { ...key, active: false } : key
    ));
    
    toast({
      title: "Key Revoked",
      description: "The API key has been revoked and can no longer be used",
    });
  };

  const handleToggleKeyStatus = (id: string, active: boolean) => {
    setApiKeys(prev => prev.map(key => 
      key.id === id ? { ...key, active } : key
    ));
    
    toast({
      title: active ? "Key Activated" : "Key Deactivated",
      description: active 
        ? "The API key is now active and can be used for API requests" 
        : "The API key has been deactivated and can no longer be used",
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  };

  const getPermissionLabel = (permission: string) => {
    switch (permission) {
      case "content:read": return "Read Content";
      case "content:write": return "Write Content";
      case "users:read": return "Read Users";
      case "users:write": return "Write Users";
      case "analytics:read": return "Read Analytics";
      default: return permission;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">API Key Management</h2>
        <Dialog open={newKeyDialog} onOpenChange={setNewKeyDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for external integrations
              </DialogDescription>
            </DialogHeader>
            {!generatedKey ? (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input 
                    id="key-name" 
                    placeholder="E.g., Website Integration"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Give your API key a descriptive name to identify its purpose
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key-permissions">Permissions</Label>
                  <Select
                    onValueChange={(value) => setNewKeyPermissions([value])}
                    value={newKeyPermissions[0]}
                  >
                    <SelectTrigger id="key-permissions">
                      <SelectValue placeholder="Select permissions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="content:read">Read Content Only</SelectItem>
                      <SelectItem value="content:write">Read & Write Content</SelectItem>
                      <SelectItem value="users:read">Read Users</SelectItem>
                      <SelectItem value="users:write">Read & Write Users</SelectItem>
                      <SelectItem value="analytics:read">Read Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key-expiration">Expiration</Label>
                  <Select
                    value={newKeyExpiration}
                    onValueChange={(value: any) => setNewKeyExpiration(value)}
                  >
                    <SelectTrigger id="key-expiration">
                      <SelectValue placeholder="Select expiration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="30days">30 days</SelectItem>
                      <SelectItem value="90days">90 days</SelectItem>
                      <SelectItem value="1year">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    For security reasons, we recommend setting an expiration date
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="text-xs font-mono break-all">{generatedKey}</div>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="text-amber-500 mr-2 h-4 w-4" />
                  <p className="text-sm text-amber-500">
                    Save this key now. You won't be able to see it again!
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleCopyKey(generatedKey)}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
                </Button>
              </div>
            )}
            <DialogFooter className="sm:justify-between">
              {!generatedKey ? (
                <>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleCreateKey}>Generate Key</Button>
                </>
              ) : (
                <Button 
                  variant="default" 
                  className="w-full" 
                  onClick={() => {
                    setGeneratedKey(null);
                    setNewKeyDialog(false);
                  }}
                >
                  Done
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Manage API keys for external applications and services
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                        {showKeys[apiKey.id] ? apiKey.key : `${apiKey.key.substring(0, 10)}...`}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {showKeys[apiKey.id] ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => handleCopyKey(apiKey.key)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.map((permission, i) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                        >
                          {getPermissionLabel(permission)}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                  <TableCell>
                    {apiKey.expiresAt ? (
                      <div className="flex items-center gap-1 text-amber-600">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(apiKey.expiresAt)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={apiKey.active} 
                        onCheckedChange={(checked) => handleToggleKeyStatus(apiKey.id, checked)} 
                        size="sm"
                      />
                      <span className={apiKey.active ? "text-green-600" : "text-red-600"}>
                        {apiKey.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently revoke the API key "{apiKey.name}". This action cannot be undone and any services using this key will stop working.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRevokeKey(apiKey.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Revoke Key
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              
              {apiKeys.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No API keys found. Click "Create New API Key" to generate one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/50 p-4 text-sm">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium">Security Note</h4>
              <p className="text-muted-foreground text-xs">
                API keys grant access to your InsiderLife CMS data. Store them securely and never expose them in public repositories or client-side code. Rotate keys regularly and use the most restrictive permissions possible.
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApiKeyManager;

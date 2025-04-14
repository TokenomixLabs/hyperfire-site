
import React, { useState, useEffect } from 'react';
import { useCommissions } from '@/hooks/useCommissions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { User, Product, CommissionRule } from '@/types/commissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit, Info, Search, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import ReferrerStatsSummary from '@/components/admin/commissions/ReferrerStatsSummary';
import { useAuth } from '@/context/AuthContext';

const CommissionsAdmin = () => {
  const { user } = useAuth();
  const {
    isLoading,
    error,
    commissionRules,
    products,
    users,
    addCommissionRule,
    updateCommissionRule,
    deleteCommissionRule,
    refreshRules,
  } = useCommissions();
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<CommissionRule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReferrerId, setSelectedReferrerId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    referrer_id: '',
    product_id: '',
    commission_percent: 80,
    start_date: '',
    end_date: '',
    priority: 0,
  });

  // Initialize form with today's date
  useEffect(() => {
    const today = new Date();
    setFormData(prev => ({
      ...prev,
      start_date: today.toISOString().split('T')[0],
    }));
  }, []);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isAddDialogOpen && !isEditDialogOpen) {
      const today = new Date();
      setFormData({
        referrer_id: '',
        product_id: '',
        commission_percent: 80,
        start_date: today.toISOString().split('T')[0],
        end_date: '',
        priority: 0,
      });
    }
  }, [isAddDialogOpen, isEditDialogOpen]);

  // Set form data when editing
  useEffect(() => {
    if (selectedRule && isEditDialogOpen) {
      setFormData({
        referrer_id: selectedRule.referrer_id,
        product_id: selectedRule.product_id || '',
        commission_percent: selectedRule.commission_percent,
        start_date: selectedRule.start_date.split('T')[0],
        end_date: selectedRule.end_date ? selectedRule.end_date.split('T')[0] : '',
        priority: selectedRule.priority,
      });
    }
  }, [selectedRule, isEditDialogOpen]);

  const handleAddRule = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addCommissionRule({
        referrer_id: formData.referrer_id,
        product_id: formData.product_id || null,
        commission_percent: formData.commission_percent,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        priority: formData.priority,
        created_by: user.id,
      });

      toast({
        title: "Success",
        description: "Commission rule added successfully.",
      });

      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding rule:", error);
      toast({
        title: "Error",
        description: "Failed to add commission rule. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditRule = async () => {
    if (!selectedRule) return;

    try {
      await updateCommissionRule(selectedRule.id, {
        referrer_id: formData.referrer_id,
        product_id: formData.product_id || null,
        commission_percent: formData.commission_percent,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        priority: formData.priority,
      });

      toast({
        title: "Success",
        description: "Commission rule updated successfully.",
      });

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating rule:", error);
      toast({
        title: "Error",
        description: "Failed to update commission rule. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRule = async () => {
    if (!selectedRule) return;

    try {
      await deleteCommissionRule(selectedRule.id);

      toast({
        title: "Success",
        description: "Commission rule deleted successfully.",
      });

      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error("Error deleting rule:", error);
      toast({
        title: "Error",
        description: "Failed to delete commission rule. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    
    // If a referrer was selected, clear it if the search term doesn't match
    if (selectedReferrerId) {
      const selectedUser = users.find(u => u.id === selectedReferrerId);
      const selectedName = selectedUser?.name || selectedUser?.email || '';
      
      if (!selectedName.toLowerCase().includes(e.target.value.toLowerCase())) {
        setSelectedReferrerId(null);
      }
    }
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedReferrerId(null);
  };
  
  const handleReferrerSelect = (userId: string) => {
    setSelectedReferrerId(userId);
    
    // Find the user name to set in search field
    const selectedUser = users.find(u => u.id === userId);
    if (selectedUser) {
      setSearchTerm(selectedUser.name || selectedUser.email || '');
    }
  };

  // Filter rules based on search term or selected referrer
  const filteredRules = commissionRules.filter(rule => {
    if (selectedReferrerId) {
      return rule.referrer_id === selectedReferrerId;
    }
    
    if (!searchTerm) return true;
    
    const user = users.find(u => u.id === rule.referrer_id);
    const userName = user?.name || '';
    const userEmail = user?.email || '';
    
    return userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           userEmail.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Filter users for dropdown search results
  const filteredUsers = searchTerm ? users.filter(user => {
    const userName = user.name || '';
    const userEmail = user.email || '';
    
    return userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           userEmail.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded">
          Error loading commission data: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Commission Rules</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Rule
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Commission Rules Management</CardTitle>
          <CardDescription>
            Manage commission rules for affiliates. Set different rates based on product and affiliates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 relative">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by referrer name or email"
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button 
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                
                {/* Search results dropdown */}
                {searchTerm && filteredUsers.length > 0 && !selectedReferrerId && (
                  <div className="absolute z-10 w-full bg-white dark:bg-gray-800 mt-1 border rounded-md shadow-lg">
                    <ul className="py-1 max-h-60 overflow-auto">
                      {filteredUsers.map(user => (
                        <li 
                          key={user.id}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleReferrerSelect(user.id)}
                        >
                          <div className="font-medium">{user.name || 'Unnamed User'}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={refreshRules}>
                Refresh
              </Button>
            </div>
            
            {selectedReferrerId && (
              <ReferrerStatsSummary referrerId={selectedReferrerId} />
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referrer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Commission %</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-center">Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500" />
                        </div>
                        <div className="mt-2 text-sm text-gray-500">Loading rules...</div>
                      </TableCell>
                    </TableRow>
                  ) : filteredRules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        No commission rules found
                        {searchTerm && ` matching "${searchTerm}"`}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRules.map(rule => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <div className="font-medium">
                            {rule.referrer_name || 'Unknown'}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {rule.referrer_id}
                          </div>
                        </TableCell>
                        <TableCell>
                          {rule.product_name ? (
                            <div className="font-medium">{rule.product_name}</div>
                          ) : (
                            <div className="text-muted-foreground italic">All Products</div>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {rule.commission_percent}%
                        </TableCell>
                        <TableCell>
                          {format(new Date(rule.start_date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {rule.end_date
                            ? format(new Date(rule.end_date), 'MMM d, yyyy')
                            : <span className="text-muted-foreground">No end date</span>}
                        </TableCell>
                        <TableCell className="text-center">
                          {rule.priority}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRule(rule);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRule(rule);
                                setIsDeleteAlertOpen(true);
                              }}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Rule Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Commission Rule</DialogTitle>
            <DialogDescription>
              Create a new commission rule for a referrer. Higher priority rules are applied first.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="referrer">Referrer</Label>
              <Select
                value={formData.referrer_id}
                onValueChange={value => setFormData({ ...formData, referrer_id: value })}
              >
                <SelectTrigger id="referrer">
                  <SelectValue placeholder="Select a referrer" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Product (Optional)</Label>
              <Select
                value={formData.product_id}
                onValueChange={value => setFormData({ ...formData, product_id: value })}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Products</SelectItem>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Leave empty to apply this commission to all products
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission">Commission Percentage</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.commission_percent}
                  onChange={e => setFormData({ ...formData, commission_percent: parseFloat(e.target.value) })}
                />
                <span>%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={formData.start_date}
                  onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date (Optional)</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={formData.end_date}
                  onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                min="0"
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">
                Higher priority rules are applied first (default is 0)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRule}>Add Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Commission Rule</DialogTitle>
            <DialogDescription>
              Update the commission rule settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-referrer">Referrer</Label>
              <Select
                value={formData.referrer_id}
                onValueChange={value => setFormData({ ...formData, referrer_id: value })}
              >
                <SelectTrigger id="edit-referrer">
                  <SelectValue placeholder="Select a referrer" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-product">Product (Optional)</Label>
              <Select
                value={formData.product_id}
                onValueChange={value => setFormData({ ...formData, product_id: value })}
              >
                <SelectTrigger id="edit-product">
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Products</SelectItem>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Leave empty to apply this commission to all products
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-commission">Commission Percentage</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="edit-commission"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.commission_percent}
                  onChange={e => setFormData({ ...formData, commission_percent: parseFloat(e.target.value) })}
                />
                <span>%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start-date">Start Date</Label>
                <Input
                  id="edit-start-date"
                  type="date"
                  value={formData.start_date}
                  onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end-date">End Date (Optional)</Label>
                <Input
                  id="edit-end-date"
                  type="date"
                  value={formData.end_date}
                  onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Input
                id="edit-priority"
                type="number"
                min="0"
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">
                Higher priority rules are applied first (default is 0)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRule}>Update Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the commission rule for{' '}
              {selectedRule?.referrer_name || 'this referrer'}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRule} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommissionsAdmin;

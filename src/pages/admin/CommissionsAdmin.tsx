
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Edit, Trash, Plus, AlertTriangle, CheckCircle2 } from "lucide-react";
import AnimatedTransition from "@/components/AnimatedTransition";
import { Button } from "@/components/ui/button";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useCommissions, CommissionRule, Product, User } from "@/hooks/useCommissions";

const CommissionsAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    isLoading,
    error,
    commissionRules,
    products,
    users,
    addCommissionRule,
    updateCommissionRule,
    deleteCommissionRule
  } = useCommissions();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState<CommissionRule | null>(null);
  const [searchUser, setSearchUser] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const form = useForm({
    defaultValues: {
      referrer_id: "",
      product_id: "",
      commission_percent: 80,
      start_date: new Date().toISOString().split('T')[0],
      end_date: "",
      priority: 0
    }
  });

  // Filter users based on search
  useEffect(() => {
    if (searchUser.trim() === "") {
      setFilteredUsers([]);
    } else {
      const filtered = users.filter(
        (user) => 
          user.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
          user.email.toLowerCase().includes(searchUser.toLowerCase())
      );
      setFilteredUsers(filtered.slice(0, 5)); // Limit to 5 results
    }
  }, [searchUser, users]);
  
  // Filter products based on search
  useEffect(() => {
    if (searchProduct.trim() === "") {
      setFilteredProducts([]);
    } else {
      const filtered = products.filter(
        (product) => 
          product.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
          (product.description?.toLowerCase().includes(searchProduct.toLowerCase()) || false)
      );
      setFilteredProducts(filtered.slice(0, 5)); // Limit to 5 results
    }
  }, [searchProduct, products]);
  
  const handleGoBack = () => {
    navigate("/admin");
  };
  
  const handleAddRule = () => {
    form.reset({
      referrer_id: "",
      product_id: "",
      commission_percent: 80,
      start_date: new Date().toISOString().split('T')[0],
      end_date: "",
      priority: 0
    });
    setShowAddDialog(true);
  };
  
  const handleEditRule = (rule: CommissionRule) => {
    setSelectedRule(rule);
    form.reset({
      referrer_id: rule.referrer_id,
      product_id: rule.product_id || "",
      commission_percent: rule.commission_percent,
      start_date: rule.start_date ? new Date(rule.start_date).toISOString().split('T')[0] : "",
      end_date: rule.end_date ? new Date(rule.end_date).toISOString().split('T')[0] : "",
      priority: rule.priority
    });
    setShowEditDialog(true);
  };
  
  const handleDeleteRule = (rule: CommissionRule) => {
    setSelectedRule(rule);
    setShowDeleteDialog(true);
  };
  
  const onSubmitAdd = async (data: any) => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      await addCommissionRule({
        referrer_id: data.referrer_id,
        product_id: data.product_id || null,
        commission_percent: parseFloat(data.commission_percent),
        start_date: data.start_date ? new Date(data.start_date).toISOString() : new Date().toISOString(),
        end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
        priority: parseInt(data.priority),
        created_by: user.id
      });
      
      setShowAddDialog(false);
      
      toast({
        title: "Success",
        description: "Commission rule created successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Error adding rule:", error);
      toast({
        title: "Error",
        description: "Failed to create commission rule",
        variant: "destructive"
      });
    }
  };
  
  const onSubmitEdit = async (data: any) => {
    if (!selectedRule) return;
    
    try {
      await updateCommissionRule(selectedRule.id, {
        referrer_id: data.referrer_id,
        product_id: data.product_id || null,
        commission_percent: parseFloat(data.commission_percent),
        start_date: data.start_date ? new Date(data.start_date).toISOString() : new Date().toISOString(),
        end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
        priority: parseInt(data.priority)
      });
      
      setShowEditDialog(false);
      
      toast({
        title: "Success",
        description: "Commission rule updated successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating rule:", error);
      toast({
        title: "Error",
        description: "Failed to update commission rule",
        variant: "destructive"
      });
    }
  };
  
  const confirmDelete = async () => {
    if (!selectedRule) return;
    
    try {
      await deleteCommissionRule(selectedRule.id);
      
      setShowDeleteDialog(false);
      
      toast({
        title: "Success",
        description: "Commission rule deleted successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Error deleting rule:", error);
      toast({
        title: "Error",
        description: "Failed to delete commission rule",
        variant: "destructive"
      });
    }
  };
  
  const selectUser = (user: User) => {
    form.setValue("referrer_id", user.id);
    setSearchUser(user.name || user.email);
    setFilteredUsers([]);
  };
  
  const selectProduct = (product: Product) => {
    form.setValue("product_id", product.id);
    setSearchProduct(product.name);
    setFilteredProducts([]);
  };
  
  const clearProductSelection = () => {
    form.setValue("product_id", "");
    setSearchProduct("");
  };
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No end date";
    return new Date(dateString).toLocaleDateString();
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
          <h1 className="text-2xl font-bold">Commission Rules</h1>
        </div>
        
        <Button 
          onClick={handleAddRule}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Commission Rule
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Commission Engine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                <h3 className="font-medium text-amber-800">How Priority Works</h3>
              </div>
              <p className="text-sm text-amber-700">
                Higher priority rules (larger numbers) override lower priority rules. Product-specific rules take precedence over general rules with the same priority.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-800">Time-Based Rules</h3>
              </div>
              <p className="text-sm text-blue-700">
                Set start and end dates for limited-time promotions. Rules with no end date remain active indefinitely.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="font-medium text-purple-800">Default Rates</h3>
              </div>
              <p className="text-sm text-purple-700">
                If no custom rules match, the system uses the product's default revenue share percentage, typically 80%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading commission rules...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error loading commission rules. Please try again.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableCaption>Active commission rules ordered by priority</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Referrer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Commission %</TableHead>
                <TableHead>Valid From</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissionRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">No commission rules found</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={handleAddRule}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Create Your First Rule
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                commissionRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.referrer_name}</TableCell>
                    <TableCell>{rule.product_name || "All Products"}</TableCell>
                    <TableCell>{rule.commission_percent}%</TableCell>
                    <TableCell>{formatDate(rule.start_date)}</TableCell>
                    <TableCell>{formatDate(rule.end_date)}</TableCell>
                    <TableCell>{rule.priority}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditRule(rule)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleDeleteRule(rule)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Add Commission Rule Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Commission Rule</DialogTitle>
            <DialogDescription>
              Configure a new commission rule for a referrer. Higher priority rules take precedence.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
              {/* Referrer Selection */}
              <FormField
                control={form.control}
                name="referrer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referrer</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          value={searchUser}
                          onChange={(e) => setSearchUser(e.target.value)}
                          placeholder="Search for a user by name or email"
                        />
                      </FormControl>
                      <input type="hidden" {...field} />
                      {filteredUsers.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredUsers.map((user) => (
                            <div
                              key={user.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => selectUser(user)}
                            >
                              <div className="font-medium">{user.name || "No Name"}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Product Selection (Optional) */}
              <FormField
                control={form.control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product (Optional)</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <div className="flex">
                          <Input
                            value={searchProduct}
                            onChange={(e) => setSearchProduct(e.target.value)}
                            placeholder="Search for a product (leave empty for all products)"
                            className="flex-1"
                          />
                          {searchProduct && (
                            <Button
                              type="button"
                              variant="outline"
                              className="ml-2"
                              onClick={clearProductSelection}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <input type="hidden" {...field} />
                      {filteredProducts.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredProducts.map((product) => (
                            <div
                              key={product.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => selectProduct(product)}
                            >
                              <div className="font-medium">{product.name}</div>
                              {product.description && (
                                <div className="text-sm text-gray-500">{product.description}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      If specified, this rule will only apply to this product. Otherwise it applies to all products.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Commission Percentage */}
              <FormField
                control={form.control}
                name="commission_percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission Percentage</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" step="0.1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Percentage of the transaction amount that goes to the referrer (e.g., 80 for 80%).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Start Date */}
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      When this commission rule becomes active. Defaults to today if left empty.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* End Date (Optional) */}
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      When this commission rule expires. Leave empty for no expiration.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Higher priority rules (larger numbers) take precedence over lower priority rules.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Create Rule
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Commission Rule Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Commission Rule</DialogTitle>
            <DialogDescription>
              Update the configuration for this commission rule.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              {/* Same form fields as Add Dialog, just reused */}
              {/* Referrer Selection */}
              <FormField
                control={form.control}
                name="referrer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referrer</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          value={searchUser || (selectedRule?.referrer_name || "")}
                          onChange={(e) => setSearchUser(e.target.value)}
                          placeholder="Search for a user by name or email"
                        />
                      </FormControl>
                      <input type="hidden" {...field} />
                      {filteredUsers.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredUsers.map((user) => (
                            <div
                              key={user.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => selectUser(user)}
                            >
                              <div className="font-medium">{user.name || "No Name"}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Product Selection (Optional) */}
              <FormField
                control={form.control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product (Optional)</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <div className="flex">
                          <Input
                            value={searchProduct || (selectedRule?.product_name || "")}
                            onChange={(e) => setSearchProduct(e.target.value)}
                            placeholder="Search for a product (leave empty for all products)"
                            className="flex-1"
                          />
                          {(searchProduct || selectedRule?.product_name) && (
                            <Button
                              type="button"
                              variant="outline"
                              className="ml-2"
                              onClick={clearProductSelection}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <input type="hidden" {...field} />
                      {filteredProducts.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredProducts.map((product) => (
                            <div
                              key={product.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => selectProduct(product)}
                            >
                              <div className="font-medium">{product.name}</div>
                              {product.description && (
                                <div className="text-sm text-gray-500">{product.description}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      If specified, this rule will only apply to this product. Otherwise it applies to all products.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Commission Percentage */}
              <FormField
                control={form.control}
                name="commission_percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission Percentage</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" step="0.1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Percentage of the transaction amount that goes to the referrer (e.g., 80 for 80%).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Start Date */}
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      When this commission rule becomes active.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* End Date (Optional) */}
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      When this commission rule expires. Leave empty for no expiration.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Higher priority rules (larger numbers) take precedence over lower priority rules.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Update Rule
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Commission Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this commission rule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatedTransition>
  );
};

export default CommissionsAdmin;

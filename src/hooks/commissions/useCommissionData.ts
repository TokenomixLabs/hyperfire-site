
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { CommissionRule, Product, User } from "@/types/commissions";

export const useCommissionData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const fetchCommissionRules = async () => {
    setIsLoading(true);
    try {
      // Use any type with the client to avoid TypeScript errors
      const supabaseAny = supabase as any;
      
      // Fetch commission rules
      const { data: rules, error: rulesError } = await supabaseAny
        .rpc('get_commission_rules');
      
      if (rulesError) throw rulesError;
      
      // Fetch products
      const { data: productsData, error: productsError } = await supabaseAny
        .from('products')
        .select("id, name, description")
        .eq('is_active', true);
      
      if (productsError) throw productsError;
      
      // Fetch users
      const { data: usersData, error: usersError } = await supabaseAny
        .rpc('get_all_users');
      
      if (usersError) throw usersError;
      
      // Cast the data to appropriate types for processing
      const typedRules = rules as CommissionRule[] | null;
      const typedProducts = productsData as Product[] | null;
      const typedUsers = usersData as User[] | null;
      
      // Enhance rules with user and product names
      const enhancedRules = typedRules ? typedRules.map(rule => {
        // Find referrer name
        const referrer = typedUsers ? typedUsers.find(u => u.id === rule.referrer_id) : null;
        
        // Find product name if product_id exists
        let product = null;
        if (rule.product_id) {
          product = typedProducts ? typedProducts.find(p => p.id === rule.product_id) : null;
        }
        
        return {
          ...rule,
          referrer_name: referrer ? referrer.name || referrer.email : "Unknown User",
          product_name: product ? product.name : null
        } as CommissionRule;
      }) : [];
      
      setCommissionRules(enhancedRules);
      setProducts(typedProducts || []);
      setUsers(typedUsers || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching commission data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast({
        title: "Error fetching commission data",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissionRules();
  }, []);

  return {
    isLoading,
    error,
    commissionRules,
    products,
    users,
    refreshRules: fetchCommissionRules
  };
};

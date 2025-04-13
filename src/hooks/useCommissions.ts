
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface CommissionRule {
  id: string;
  referrer_id: string;
  referrer_name?: string;
  product_id: string | null;
  product_name?: string;
  commission_percent: number;
  start_date: string;
  end_date: string | null;
  priority: number;
  created_by: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export const useCommissions = () => {
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

  const addCommissionRule = async (rule: Omit<CommissionRule, 'id' | 'created_at'>) => {
    try {
      // Use any type with the client to avoid TypeScript errors
      const supabaseAny = supabase as any;
      
      const { data, error } = await supabaseAny
        .rpc('insert_commission_rule', {
          p_referrer_id: rule.referrer_id,
          p_product_id: rule.product_id || null,
          p_commission_percent: rule.commission_percent,
          p_start_date: rule.start_date,
          p_end_date: rule.end_date || null,
          p_priority: rule.priority,
          p_created_by: rule.created_by
        });
      
      if (error) throw error;
      
      // Refresh rules after adding
      await fetchCommissionRules();
      toast({
        title: "Commission rule added",
        description: "The commission rule has been added successfully"
      });
      return data;
    } catch (err) {
      console.error("Error adding commission rule:", err);
      toast({
        title: "Error adding commission rule",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateCommissionRule = async (id: string, rule: Partial<Omit<CommissionRule, 'id' | 'created_at'>>) => {
    try {
      // Use any type with the client to avoid TypeScript errors
      const supabaseAny = supabase as any;
      
      const { data, error } = await supabaseAny
        .rpc('update_commission_rule', {
          p_id: id,
          p_referrer_id: rule.referrer_id,
          p_product_id: rule.product_id || null,
          p_commission_percent: rule.commission_percent,
          p_start_date: rule.start_date,
          p_end_date: rule.end_date || null,
          p_priority: rule.priority
        });
      
      if (error) throw error;
      
      // Refresh rules after updating
      await fetchCommissionRules();
      toast({
        title: "Commission rule updated",
        description: "The commission rule has been updated successfully"
      });
      return data;
    } catch (err) {
      console.error("Error updating commission rule:", err);
      toast({
        title: "Error updating commission rule",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteCommissionRule = async (id: string) => {
    try {
      // Use any type with the client to avoid TypeScript errors
      const supabaseAny = supabase as any;
      
      const { error } = await supabaseAny
        .rpc('delete_commission_rule', { p_id: id });
      
      if (error) throw error;
      
      // Refresh rules after deleting
      await fetchCommissionRules();
      toast({
        title: "Commission rule deleted",
        description: "The commission rule has been deleted successfully"
      });
    } catch (err) {
      console.error("Error deleting commission rule:", err);
      toast({
        title: "Error deleting commission rule",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      });
      throw err;
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
    addCommissionRule,
    updateCommissionRule,
    deleteCommissionRule,
    refreshRules: fetchCommissionRules
  };
};

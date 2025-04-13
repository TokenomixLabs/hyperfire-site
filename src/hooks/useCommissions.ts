
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PostgrestResponse } from "@supabase/supabase-js";

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

// Define a generic response type for RPC calls
type RPCResponse<T> = PostgrestResponse<T>;

export const useCommissions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const fetchCommissionRules = async () => {
    setIsLoading(true);
    try {
      // Type the RPC function call with the CommissionRule[] return type
      const { data: rules, error: rulesError } = await supabase
        .rpc('get_commission_rules')
        .then(res => res as PostgrestResponse<CommissionRule[]>);
      
      if (rulesError) throw rulesError;
      
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("id, name, description")
        .eq("is_active", true);
      
      if (productsError) throw productsError;
      
      // Fetch users with type assertion for the return type
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_all_users')
        .then(res => res as PostgrestResponse<User[]>);
      
      if (usersError) throw usersError;
      
      // Enhance rules with user and product names, with proper type handling
      const enhancedRules = rules ? rules.map((rule) => {
        // Find referrer name
        const referrer = usersData && Array.isArray(usersData) 
          ? usersData.find(u => u.id === rule.referrer_id) 
          : null;
        
        // Find product name if product_id exists
        let product = null;
        if (rule.product_id && productsData && Array.isArray(productsData)) {
          product = productsData.find(p => p.id === rule.product_id);
        }
        
        return {
          ...rule,
          referrer_name: referrer ? referrer.name || referrer.email : "Unknown User",
          product_name: product ? product.name : null
        };
      }) : [];
      
      setCommissionRules(enhancedRules);
      setProducts(productsData || []);
      setUsers(usersData || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching commission data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const addCommissionRule = async (rule: Omit<CommissionRule, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .rpc('insert_commission_rule', {
          p_referrer_id: rule.referrer_id,
          p_product_id: rule.product_id || null,
          p_commission_percent: rule.commission_percent,
          p_start_date: rule.start_date,
          p_end_date: rule.end_date || null,
          p_priority: rule.priority,
          p_created_by: rule.created_by
        })
        .then(res => res as PostgrestResponse<any>);
      
      if (error) throw error;
      
      // Refresh rules after adding
      await fetchCommissionRules();
      return data;
    } catch (err) {
      console.error("Error adding commission rule:", err);
      throw err;
    }
  };

  const updateCommissionRule = async (id: string, rule: Partial<Omit<CommissionRule, 'id' | 'created_at'>>) => {
    try {
      const { data, error } = await supabase
        .rpc('update_commission_rule', {
          p_id: id,
          p_referrer_id: rule.referrer_id,
          p_product_id: rule.product_id || null,
          p_commission_percent: rule.commission_percent,
          p_start_date: rule.start_date,
          p_end_date: rule.end_date || null,
          p_priority: rule.priority
        })
        .then(res => res as PostgrestResponse<any>);
      
      if (error) throw error;
      
      // Refresh rules after updating
      await fetchCommissionRules();
      return data;
    } catch (err) {
      console.error("Error updating commission rule:", err);
      throw err;
    }
  };

  const deleteCommissionRule = async (id: string) => {
    try {
      const { error } = await supabase
        .rpc('delete_commission_rule', { p_id: id })
        .then(res => res as PostgrestResponse<any>);
      
      if (error) throw error;
      
      // Refresh rules after deleting
      await fetchCommissionRules();
    } catch (err) {
      console.error("Error deleting commission rule:", err);
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

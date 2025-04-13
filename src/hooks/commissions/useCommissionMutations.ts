
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { CommissionRule } from "@/types/commissions";

export const useCommissionMutations = (refreshRules: () => Promise<void>) => {
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
      await refreshRules();
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
      await refreshRules();
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
      await refreshRules();
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

  return {
    addCommissionRule,
    updateCommissionRule,
    deleteCommissionRule
  };
};

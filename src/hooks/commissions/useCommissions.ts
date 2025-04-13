
import { CommissionRule, Product, User } from "@/types/commissions";
import { useCommissionData } from "./useCommissionData";
import { useCommissionMutations } from "./useCommissionMutations";

export type { CommissionRule, Product, User };

export const useCommissions = () => {
  const { 
    isLoading, 
    error, 
    commissionRules, 
    products, 
    users, 
    refreshRules 
  } = useCommissionData();
  
  const { 
    addCommissionRule, 
    updateCommissionRule, 
    deleteCommissionRule 
  } = useCommissionMutations(refreshRules);

  return {
    isLoading,
    error,
    commissionRules,
    products,
    users,
    addCommissionRule,
    updateCommissionRule,
    deleteCommissionRule,
    refreshRules
  };
};

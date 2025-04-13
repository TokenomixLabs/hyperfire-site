
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

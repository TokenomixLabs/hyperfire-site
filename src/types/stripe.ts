
export interface StripePrice {
  id: string;
  product: string;
  active: boolean;
  currency: string;
  unit_amount: number;
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
  };
  metadata?: Record<string, string>;
  created: number;
}

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  images: string[];
  metadata?: Record<string, string>;
  created: number;
}

export interface StripePayment {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  created: number;
  customer: string;
  description?: string;
  metadata?: Record<string, string>;
  payment_method?: string;
  payment_method_details?: {
    card?: {
      brand: string;
      last4: string;
      exp_month: number;
      exp_year: number;
    };
  };
  refunded?: boolean;
  refunded_amount?: number;
}

export interface StripeTransfer {
  id: string;
  amount: number;
  currency: string;
  destination: string; // Stripe account ID
  created: number;
  description?: string;
  metadata?: Record<string, string>;
  source_transaction?: string;
  balance_transaction?: string;
  reversals?: {
    data: Array<{
      id: string;
      amount: number;
      currency: string;
      created: number;
    }>;
  };
}

export interface StripeAccount {
  id: string;
  email: string;
  created: number;
  business_type?: 'individual' | 'company';
  charges_enabled: boolean;
  payouts_enabled: boolean;
  requirements?: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
    disabled_reason?: string;
  };
  settings?: {
    dashboard?: {
      display_name?: string;
    };
  };
}

export interface StripeSubscription {
  id: string;
  customer: string;
  status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
  created: number;
  current_period_start: number;
  current_period_end: number;
  canceled_at?: number;
  cancel_at?: number;
  ended_at?: number;
  trial_start?: number;
  trial_end?: number;
  items: {
    data: Array<{
      id: string;
      price: {
        id: string;
        product: string;
      };
    }>;
  };
  metadata?: Record<string, string>;
}

export interface StripePaymentWithReferral extends StripePayment {
  referralInfo?: {
    referrerId?: string;
    referrerName?: string;
    platformOrigin?: string;
    commissionRate?: number;
    commissionAmount?: number;
    transferId?: string;
  };
}

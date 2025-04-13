
import Stripe from "https://esm.sh/stripe@13.7.0";

// CORS headers for all responses
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Enable verbose logging for testing
export const VERBOSE_LOGGING = true;

// Logging utilities
export function logInfo(message: string, data?: any) {
  if (VERBOSE_LOGGING) {
    if (data) {
      console.log(`[INFO] ${message}`, JSON.stringify(data, null, 2));
    } else {
      console.log(`[INFO] ${message}`);
    }
  }
}

export function logError(message: string, error: any) {
  console.error(`[ERROR] ${message}`, error);
}

// Helper function to get customer details
export async function getCustomerDetails(
  customerId: string,
  stripe: Stripe
): Promise<Stripe.Customer | null> {
  try {
    console.log(`[CUSTOMER] Retrieving customer details for ID: ${customerId}`);
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    console.log(`[CUSTOMER] Retrieved customer with email: ${customer.email}`);
    return customer;
  } catch (error) {
    console.error(`[CUSTOMER ERROR] Error retrieving customer:`, error);
    return null;
  }
}

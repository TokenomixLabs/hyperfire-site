
import { logInfo, logError } from "../utils.ts";

/**
 * Lookup user ID from customer email using multiple strategies
 */
export async function lookupUserIdFromEmail(
  supabase: any,
  customerEmail: string
): Promise<string | null> {
  console.log(`[USER] Looking up user ID for email: ${customerEmail}`);
  
  // First try with auth.users via admin API
  try {
    const { data: authUsers, error } = await supabase.auth.admin.listUsers({
      filters: {
        email: customerEmail
      }
    });
    
    if (error) {
      console.error(`[USER ERROR] Auth users lookup error:`, error);
    } else if (authUsers && authUsers.users && authUsers.users.length > 0) {
      const userId = authUsers.users[0].id;
      console.log(`[USER] Found user in auth.users with ID: ${userId}`);
      return userId;
    } else {
      console.log(`[USER] No matching user found in auth.users for email: ${customerEmail}`);
    }
  } catch (error) {
    console.error(`[USER ERROR] Error accessing admin API:`, error);
  }
  
  // If not found in auth.users, try with public users table as fallback
  try {
    console.log(`[USER] Trying fallback lookup in public users table`);
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", customerEmail)
      .maybeSingle();
    
    if (error) {
      console.error(`[USER ERROR] Public users lookup error:`, error);
    } else if (data) {
      console.log(`[USER] Found user in public users table with ID: ${data.id}`);
      return data.id;
    } else {
      console.log(`[USER] No matching user found in public users table for email: ${customerEmail}`);
    }
  } catch (error) {
    console.error(`[USER ERROR] Error accessing public users table:`, error);
  }
  
  console.log(`[USER] Could not find user ID for email: ${customerEmail}`);
  return null;
}

/**
 * Get product details from stripe price ID
 */
export async function lookupProductFromStripePrice(
  supabase: any,
  stripePriceId: string
): Promise<string | null> {
  console.log(`[PRODUCT] Getting product details for price: ${stripePriceId}`);
  
  try {
    // Find the product from our products table
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("stripe_price_id", stripePriceId)
      .maybeSingle();
    
    if (productError) {
      console.error(`[PRODUCT ERROR] Product lookup error:`, productError);
      return null;
    }
    
    console.log(`[PRODUCT] Product lookup result:`, productData || "No product found");
    return productData?.id || null;
  } catch (error) {
    console.error(`[PRODUCT ERROR] Error looking up product:`, error);
    return null;
  }
}

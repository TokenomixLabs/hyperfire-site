
import Stripe from "https://esm.sh/stripe@13.7.0";

/**
 * Handles account.updated events to track Connect account status
 */
export async function handleAccountUpdated(
  account: Stripe.Account,
  supabase: any
) {
  console.log(`[ACCOUNT] Starting account.updated handler for account: ${account.id}`);
  
  try {
    // Get user id from metadata
    const userId = account.metadata?.user_id;
    
    if (!userId) {
      console.log(`[ACCOUNT] No user_id found in account metadata, cannot update account status`);
      return;
    }
    
    console.log(`[ACCOUNT] Processing account update for user: ${userId}, account: ${account.id}`);
    
    // Update the account status in the database
    console.log(`[ACCOUNT] Updating stripe account status`);
    console.log(`[ACCOUNT] Status details:`, { 
      userId: userId,
      accountId: account.id,
      is_active: account.charges_enabled
    });
    
    const { data, error } = await supabase
      .from("stripe_accounts")
      .update({
        is_active: account.charges_enabled,
        metadata: {
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
          details_submitted: account.details_submitted,
          requirements: account.requirements,
          updated_at: new Date().toISOString(),
        },
      })
      .eq("stripe_account_id", account.id)
      .eq("user_id", userId)
      .select();
    
    if (error) {
      console.error(`[ACCOUNT ERROR] Error updating account status:`, error);
    } else {
      console.log(`[ACCOUNT] Updated account status for user ${userId}, account ${account.id}, charges_enabled: ${account.charges_enabled}`);
    }
    
    console.log(`[ACCOUNT] Account update processing completed`);
    
  } catch (error) {
    console.error(`[ACCOUNT ERROR] Error processing account update:`, error);
    console.error(`[ACCOUNT ERROR] Stack trace:`, error.stack);
    // We don't rethrow to avoid breaking the webhook flow
  }
}

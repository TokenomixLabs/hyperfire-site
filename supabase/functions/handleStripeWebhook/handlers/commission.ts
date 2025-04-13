
import Stripe from "https://esm.sh/stripe@13.7.0";
import { logInfo, logError } from "../utils.ts";

/**
 * Match and apply the most appropriate commission rule for a transaction
 * Finds the highest priority rule that matches the referrer and product
 */
export async function findApplicableCommissionRule(
  supabase: any,
  referrerId: string,
  productId: string | null
): Promise<{ 
  rule: any | null;
  commissionRate: number;
  isDefaultRate: boolean;
}> {
  console.log(`[COMMISSION] Finding commission rules for referrer: ${referrerId}, product: ${productId || 'any'}`);
  
  try {
    // Get current date for rule date filtering
    const now = new Date().toISOString();
    
    // Query for applicable rules with proper ordering to get highest priority first
    const { data: commissionRules, error: rulesError } = await supabase
      .from("commission_rules")
      .select("*")
      .eq("referrer_id", referrerId)
      .or(`product_id.eq.${productId},product_id.is.null`)
      .lte("start_date", now)
      .or(`end_date.gt.${now},end_date.is.null`)
      .order("priority", { ascending: false })
      .order("product_id", { nullsLast: true });
    
    if (rulesError) {
      console.error(`[COMMISSION ERROR] Error fetching commission rules:`, rulesError);
      // Fall back to default product rate if we can't get rules
      return { rule: null, commissionRate: 80, isDefaultRate: true };
    }
    
    if (commissionRules && commissionRules.length > 0) {
      // Use highest priority rule (already sorted by query)
      const rule = commissionRules[0];
      console.log(`[COMMISSION] Found matching rule: ${rule.id} with rate: ${rule.commission_percent}% (priority: ${rule.priority})`);
      return {
        rule,
        commissionRate: rule.commission_percent,
        isDefaultRate: false
      };
    }
    
    // If no specific rules found, try to get default from product
    if (productId) {
      console.log(`[COMMISSION] No specific rules found, checking product default rate`);
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("revenue_share_percent")
        .eq("id", productId)
        .single();
      
      if (!productError && productData) {
        console.log(`[COMMISSION] Using product default rate: ${productData.revenue_share_percent}%`);
        return {
          rule: null,
          commissionRate: productData.revenue_share_percent,
          isDefaultRate: true
        };
      }
    }
    
    // Final fallback - global default
    console.log(`[COMMISSION] Using global default commission rate: 80%`);
    return { rule: null, commissionRate: 80, isDefaultRate: true };
    
  } catch (error) {
    console.error(`[COMMISSION ERROR] Error in findApplicableCommissionRule:`, error);
    return { rule: null, commissionRate: 80, isDefaultRate: true };
  }
}

/**
 * Calculate and process commission for a transaction
 */
export async function processCommission(
  supabase: any,
  stripe: Stripe,
  {
    referrerId,
    customerId,
    productId,
    sessionId,
    amount,
    currency = 'usd',
    funnelId = null
  }: {
    referrerId: string | null;
    customerId: string | null;
    productId: string | null;
    sessionId: string;
    amount: number;
    currency?: string;
    funnelId?: string | null;
  }
) {
  console.log(`[COMMISSION] Processing commission for referrer: ${referrerId}, amount: ${amount}`);
  
  if (!referrerId) {
    console.log(`[COMMISSION] No referrer specified, skipping commission processing`);
    return {
      referrerCut: null,
      platformCut: amount,
      transferId: null,
      appliedCommissionRule: null,
      referrerStripeAccountId: null
    };
  }

  try {
    // Get referrer's Stripe account
    console.log(`[COMMISSION] Looking up referrer's Stripe account for user: ${referrerId}`);
    const { data: referrerData, error: referrerError } = await supabase
      .from("stripe_accounts")
      .select("stripe_account_id")
      .eq("user_id", referrerId)
      .eq("is_active", true)
      .single();
    
    console.log(`[COMMISSION] Referrer Stripe account lookup result:`, referrerData || "No account found");
    
    if (referrerError || !referrerData) {
      console.log(`[COMMISSION] No active Stripe account found for referrer: ${referrerId}`);
      return {
        referrerCut: null,
        platformCut: amount,
        transferId: null,
        appliedCommissionRule: null,
        referrerStripeAccountId: null
      };
    }
    
    const referrerStripeAccountId = referrerData.stripe_account_id;
    console.log(`[COMMISSION] Found referrer's Stripe account: ${referrerStripeAccountId}`);
    
    // Find the appropriate commission rule
    const { rule, commissionRate, isDefaultRate } = await findApplicableCommissionRule(
      supabase,
      referrerId,
      productId
    );
    
    // Log commission decision details
    if (rule) {
      console.log(`[COMMISSION] Applied specific commission rule: ${rule.id}`);
      console.log(`[COMMISSION] Rule details: ${commissionRate}%, priority: ${rule.priority}, product-specific: ${rule.product_id ? 'Yes' : 'No'}`);
    } else {
      console.log(`[COMMISSION] Using ${isDefaultRate ? 'default' : 'fallback'} commission rate: ${commissionRate}%`);
    }
    
    // Calculate the split
    const referrerCut = Math.floor((amount * commissionRate) / 100);
    const platformCut = amount - referrerCut;
    
    console.log(`[COMMISSION] Commission calculation: ${amount} * ${commissionRate}% = ${referrerCut} for referrer, ${platformCut} for platform`);
    
    // Process transfer to the referrer's connected account
    let transferId = null;
    
    try {
      // Create a transfer to the connected account
      console.log(`[COMMISSION] Creating transfer to referrer account: ${referrerStripeAccountId}`);
      console.log(`[COMMISSION] Transfer amount: ${referrerCut}, currency: ${currency}`);
      
      const transfer = await stripe.transfers.create({
        amount: referrerCut,
        currency: currency,
        destination: referrerStripeAccountId,
        transfer_group: `session_${sessionId}`,
        metadata: {
          sessionId: sessionId,
          referrerId: referrerId,
          customerId: customerId,
          commissionRuleId: rule?.id || null,
          commissionRate: commissionRate,
          productId: productId
        },
      });
      
      transferId = transfer.id;
      console.log(`[COMMISSION] Successfully transferred ${referrerCut} to referrer account ${referrerStripeAccountId}`);
      console.log(`[COMMISSION] Transfer ID: ${transferId}`);
    } catch (transferError) {
      console.error(`[COMMISSION ERROR] Error creating transfer:`, transferError);
      console.error(`[COMMISSION ERROR] Transfer failed from ${sessionId} to ${referrerStripeAccountId}`);
      // We don't throw here to avoid breaking the webhook flow
    }
    
    return {
      referrerCut,
      platformCut,
      transferId,
      appliedCommissionRule: rule,
      referrerStripeAccountId
    };
    
  } catch (error) {
    console.error(`[COMMISSION ERROR] Error processing commission:`, error);
    return {
      referrerCut: null,
      platformCut: amount,
      transferId: null,
      appliedCommissionRule: null,
      referrerStripeAccountId: null
    };
  }
}


import Stripe from "https://esm.sh/stripe@13.7.0";
import { logInfo, logError } from "../utils.ts";

/**
 * Record transaction details in the database
 */
export async function recordTransaction(
  supabase: any,
  {
    session,
    customerId,
    referrerId,
    productId,
    funnelId,
    amount,
    referrerCut,
    platformCut,
    transferId,
    referrerStripeAccountId,
    appliedCommissionRule,
    customerEmail,
    lineItems
  }: {
    session: Stripe.Checkout.Session;
    customerId: string | null;
    referrerId: string | null;
    productId: string | null;
    funnelId: string | null;
    amount: number;
    referrerCut: number | null;
    platformCut: number | null;
    transferId: string | null;
    referrerStripeAccountId: string | null;
    appliedCommissionRule: any | null;
    customerEmail: string;
    lineItems: Stripe.LineItem[];
  }
) {
  console.log(`[TRANSACTION] Inserting transaction record`);
  console.log(`[TRANSACTION] Transaction details:`, {
    customer_user_id: customerId,
    referrer_user_id: referrerId,
    product_id: productId,
    amount: amount,
    currency: session.currency || 'usd',
    referrer_amount: referrerCut,
    platform_amount: platformCut,
  });
  
  try {
    const { data: transactionData, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        customer_user_id: customerId,
        referrer_user_id: referrerId,
        product_id: productId,
        amount: amount,
        currency: session.currency || 'usd',
        referrer_amount: referrerCut,
        platform_amount: platformCut,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_payout_id: transferId,
        payout_status: transferId ? 'completed' : (referrerId ? 'pending' : 'not_applicable'),
        status: 'completed',
        funnel_id: funnelId,
        metadata: {
          checkout_session: session.id,
          payment_intent: session.payment_intent,
          referrer_account_id: referrerStripeAccountId,
          customer_email: customerEmail,
          applied_commission_rule: appliedCommissionRule,
          commission_rate: appliedCommissionRule ? appliedCommissionRule.commission_percent : null,
          commission_fallback: appliedCommissionRule ? false : true,
          line_items: lineItems.map(item => ({
            id: item.id,
            description: item.description,
            amount_total: item.amount_total,
            currency: item.currency,
            quantity: item.quantity,
          })),
        },
      })
      .select();
    
    if (transactionError) {
      console.error(`[TRANSACTION ERROR] Error logging transaction:`, transactionError);
      return { success: false, error: transactionError, data: null };
    } else {
      console.log(`[TRANSACTION] Transaction logged successfully with ID: ${transactionData[0]?.id}`);
      return { success: true, error: null, data: transactionData[0] };
    }
  } catch (error) {
    console.error(`[TRANSACTION ERROR] Exception logging transaction:`, error);
    return { success: false, error, data: null };
  }
}

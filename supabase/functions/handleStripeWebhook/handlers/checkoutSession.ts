
import Stripe from "https://esm.sh/stripe@13.7.0";
import { logInfo, logError, getCustomerDetails } from "../utils.ts";
import { processCommission } from "./commission.ts";
import { lookupUserIdFromEmail, lookupProductFromStripePrice } from "./userLookup.ts";
import { recordTransaction } from "./transactions.ts";

/**
 * Extract and validate customer information from session
 */
async function getCustomerInfoFromSession(
  session: Stripe.Checkout.Session,
  stripe: Stripe
): Promise<{ customerEmail: string | null; customer: Stripe.Customer | null }> {
  console.log(`[CHECKOUT] Extracting customer info from session: ${session.id}`);
  console.log(`[CHECKOUT] Customer ID: ${session.customer}`);
  console.log(`[CHECKOUT] Customer email: ${session.customer_details?.email}`);
  
  const customer = session.customer 
    ? await getCustomerDetails(session.customer as string, stripe) 
    : null;
  
  console.log(`[CHECKOUT] Retrieved customer details:`, customer?.email || "No email found");
  
  const customerEmail = customer?.email || session.customer_details?.email;
  
  if (!customerEmail) {
    console.error(`[CHECKOUT ERROR] No customer email found in session or customer object`);
  } else {
    console.log(`[CHECKOUT] Using customer email: ${customerEmail}`);
  }
  
  return { customerEmail, customer };
}

/**
 * Process metadata from checkout session
 */
function extractMetadataFromSession(session: Stripe.Checkout.Session): { 
  referrerId: string | null; 
  funnelId: string | null;
} {
  const metadata = session.metadata || {};
  console.log(`[CHECKOUT] Session metadata:`, metadata);
  
  const referrerId = metadata.referrerId || null;
  const funnelId = metadata.funnelId || null;
  
  console.log(`[CHECKOUT] Extracted referrerId: ${referrerId}, funnelId: ${funnelId}`);
  
  return { referrerId, funnelId };
}

/**
 * Handles checkout.session.completed events
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
  supabase: any
) {
  console.log(`[CHECKOUT] Starting checkout.session.completed handler for session: ${session.id}`);
  
  try {
    // Extract customer information
    const { customerEmail, customer } = await getCustomerInfoFromSession(session, stripe);
    
    if (!customerEmail) {
      throw new Error("No customer email found in session or customer object");
    }

    // Get user ID from customer email
    const customerId = await lookupUserIdFromEmail(supabase, customerEmail);
    console.log(`[CHECKOUT] User lookup result:`, customerId || "No user found");

    // Extract line items to get product and amount details
    console.log(`[CHECKOUT] Retrieving line items for session: ${session.id}`);
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    console.log(`[CHECKOUT] Line items count: ${lineItems.data.length}`);
    
    if (!lineItems || lineItems.data.length === 0) {
      console.error(`[CHECKOUT ERROR] No line items found in session`);
      throw new Error("No line items found in session");
    }

    const amount = session.amount_total || 0;
    console.log(`[CHECKOUT] Parsed transaction details: amount=${amount}, customerId=${customerId}`);
    
    // Get metadata
    const { referrerId, funnelId } = extractMetadataFromSession(session);
    
    // Get product ID from Stripe price
    const lineItem = lineItems.data[0];
    const productId = await lookupProductFromStripePrice(supabase, lineItem.price?.id);
    
    // Process commission if there's a referrer
    const commissionResult = await processCommission(supabase, stripe, {
      referrerId,
      customerId,
      productId,
      sessionId: session.id,
      amount,
      currency: session.currency || 'usd',
      funnelId
    });
    
    // Record transaction
    const transactionResult = await recordTransaction(supabase, {
      session,
      customerId,
      referrerId,
      productId,
      funnelId,
      amount,
      referrerCut: commissionResult.referrerCut,
      platformCut: commissionResult.platformCut,
      transferId: commissionResult.transferId,
      referrerStripeAccountId: commissionResult.referrerStripeAccountId,
      appliedCommissionRule: commissionResult.appliedCommissionRule,
      customerEmail,
      lineItems: lineItems.data
    });
    
    if (transactionResult.success) {
      console.log(`[WEBHOOK] ✅ Payment processed, transaction logged, payout ${commissionResult.transferId ? 'sent' : 'pending'}.`);
    } else {
      console.error(`[WEBHOOK ERROR] Failed to log transaction:`, transactionResult.error);
    }
    
    console.log(`[CHECKOUT] Checkout session processing completed successfully`);
    
  } catch (error) {
    console.error(`[CHECKOUT ERROR] Error processing checkout session:`, error);
    console.error(`[CHECKOUT ERROR] Stack trace:`, error.stack);
    // We don't rethrow to avoid breaking the webhook flow
  }
}

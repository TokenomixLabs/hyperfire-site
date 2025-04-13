
import Stripe from "https://esm.sh/stripe@13.7.0";
import { logInfo, logError, getCustomerDetails } from "../utils.ts";

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
    // Extract important information from the session
    console.log(`[CHECKOUT] Session object ID: ${session.id}`);
    console.log(`[CHECKOUT] Customer ID: ${session.customer}`);
    console.log(`[CHECKOUT] Customer email: ${session.customer_details?.email}`);
    
    const customer = session.customer 
      ? await getCustomerDetails(session.customer as string, stripe) 
      : null;
    
    console.log(`[CHECKOUT] Retrieved customer details:`, customer?.email || "No email found");
    
    const customerEmail = customer?.email || session.customer_details?.email;
    
    if (!customerEmail) {
      console.error(`[CHECKOUT ERROR] No customer email found in session or customer object`);
      throw new Error("No customer email found in session or customer object");
    }
    console.log(`[CHECKOUT] Using customer email: ${customerEmail}`);

    // Get user ID from customer email - Using Admin API
    console.log(`[CHECKOUT] Looking up user ID for email: ${customerEmail}`);
    
    // First try with auth.users via admin API
    let userData = null;
    let userError = null;
    
    try {
      const { data: authUsers, error } = await supabase.auth.admin.listUsers({
        filters: {
          email: customerEmail
        }
      });
      
      if (error) {
        console.error(`[CHECKOUT ERROR] Auth users lookup error:`, error);
        userError = error;
      } else if (authUsers && authUsers.users && authUsers.users.length > 0) {
        userData = { id: authUsers.users[0].id };
        console.log(`[CHECKOUT] Found user in auth.users with ID: ${userData.id}`);
      } else {
        console.log(`[CHECKOUT] No matching user found in auth.users for email: ${customerEmail}`);
      }
    } catch (error) {
      console.error(`[CHECKOUT ERROR] Error accessing admin API:`, error);
      userError = error;
    }
    
    // If not found in auth.users, try with public users table as fallback
    if (!userData) {
      try {
        console.log(`[CHECKOUT] Trying fallback lookup in public users table`);
        const { data, error } = await supabase
          .from("users")
          .select("id")
          .eq("email", customerEmail)
          .maybeSingle();
        
        if (error) {
          console.error(`[CHECKOUT ERROR] Public users lookup error:`, error);
          if (!userError) userError = error;
        } else if (data) {
          userData = data;
          console.log(`[CHECKOUT] Found user in public users table with ID: ${userData.id}`);
        } else {
          console.log(`[CHECKOUT] No matching user found in public users table for email: ${customerEmail}`);
        }
      } catch (error) {
        console.error(`[CHECKOUT ERROR] Error accessing public users table:`, error);
        if (!userError) userError = error;
      }
    }
    
    console.log(`[CHECKOUT] User lookup result:`, userData || "No user found");

    // Extract line items to get product and amount details
    console.log(`[CHECKOUT] Retrieving line items for session: ${session.id}`);
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    console.log(`[CHECKOUT] Line items count: ${lineItems.data.length}`);
    
    if (!lineItems || lineItems.data.length === 0) {
      console.error(`[CHECKOUT ERROR] No line items found in session`);
      throw new Error("No line items found in session");
    }

    const amount = session.amount_total || 0;
    const customerId = userData?.id || null;
    
    console.log(`[CHECKOUT] Parsed transaction details: amount=${amount}, customerId=${customerId}`);
    
    // Get metadata
    const metadata = session.metadata || {};
    console.log(`[CHECKOUT] Session metadata:`, metadata);
    
    const referrerId = metadata.referrerId || null;
    const funnelId = metadata.funnelId || null;
    
    console.log(`[CHECKOUT] Extracted referrerId: ${referrerId}, funnelId: ${funnelId}`);
    
    // If there's a referrer, prepare to process the referral payment
    let referrerCut = null;
    let platformCut = null;
    let referrerStripeAccountId = null;
    let transferId = null;
    
    if (referrerId) {
      console.log(`[CHECKOUT] Payment has a referrer: ${referrerId}, processing referral`);
      
      // Get referrer's commission rate and Stripe account
      console.log(`[CHECKOUT] Looking up referrer's Stripe account for user: ${referrerId}`);
      const { data: referrerData, error: referrerError } = await supabase
        .from("stripe_accounts")
        .select("stripe_account_id")
        .eq("user_id", referrerId)
        .eq("is_active", true)
        .single();
      
      console.log(`[CHECKOUT] Referrer Stripe account lookup result:`, referrerData || "No account found");
      console.log(`[CHECKOUT] Referrer lookup error:`, referrerError || "No error");
      
      if (referrerError || !referrerData) {
        console.log(`[CHECKOUT] No active Stripe account found for referrer: ${referrerId}`);
      } else {
        referrerStripeAccountId = referrerData.stripe_account_id;
        console.log(`[CHECKOUT] Found referrer's Stripe account: ${referrerStripeAccountId}`);
        
        // Fetch the product to get commission rate
        const lineItem = lineItems.data[0];
        console.log(`[CHECKOUT] Getting commission rate for product with price: ${lineItem.price?.id}`);
        
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("revenue_share_percent")
          .eq("stripe_price_id", lineItem.price?.id)
          .single();
        
        console.log(`[CHECKOUT] Product commission lookup result:`, productData || "No product found");
        console.log(`[CHECKOUT] Product lookup error:`, productError || "No error");
        
        const commissionRate = productData?.revenue_share_percent || 80; // Default 80% if not found
        console.log(`[CHECKOUT] Using commission rate: ${commissionRate}%`);
        
        // Calculate the split
        referrerCut = Math.floor((amount * commissionRate) / 100);
        platformCut = amount - referrerCut;
        
        console.log(`[CHECKOUT] Commission calculation: ${amount} * ${commissionRate}% = ${referrerCut} for referrer, ${platformCut} for platform`);
        
        // Process transfer to the referrer's connected account if they have one
        if (referrerStripeAccountId) {
          try {
            // Create a transfer to the connected account
            console.log(`[CHECKOUT] Creating transfer to referrer account: ${referrerStripeAccountId}`);
            console.log(`[CHECKOUT] Transfer amount: ${referrerCut}, currency: ${session.currency || 'usd'}`);
            
            const transfer = await stripe.transfers.create({
              amount: referrerCut,
              currency: session.currency || 'usd',
              destination: referrerStripeAccountId,
              transfer_group: `session_${session.id}`,
              metadata: {
                sessionId: session.id,
                referrerId: referrerId,
                customerId: customerId,
              },
            });
            
            transferId = transfer.id;
            console.log(`[CHECKOUT] Successfully transferred ${referrerCut} to referrer account ${referrerStripeAccountId}`);
            console.log(`[CHECKOUT] Transfer ID: ${transferId}`);
          } catch (transferError) {
            console.error(`[CHECKOUT ERROR] Error creating transfer:`, transferError);
            console.error(`[CHECKOUT ERROR] Transfer failed from ${session.id} to ${referrerStripeAccountId}`);
            // We don't throw here to avoid breaking the webhook flow
            // The transfer can be retried manually if needed
          }
        } else {
          console.log(`[CHECKOUT] Referrer does not have an active Stripe account, skipping transfer`);
        }
      }
    } else {
      console.log(`[CHECKOUT] No referrer specified in this transaction`);
    }
    
    // Log the transaction in the database
    console.log(`[CHECKOUT] Inserting transaction record`);
    console.log(`[CHECKOUT] Transaction details:`, {
      customer_user_id: customerId,
      referrer_user_id: referrerId,
      amount: amount,
      currency: session.currency || 'usd',
      referrer_amount: referrerCut,
      platform_amount: platformCut,
    });
    
    const { data: transactionData, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        customer_user_id: customerId,
        referrer_user_id: referrerId,
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
          line_items: lineItems.data.map(item => ({
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
      console.error(`[CHECKOUT ERROR] Error logging transaction:`, transactionError);
    } else {
      console.log(`[CHECKOUT] Transaction logged successfully with ID: ${transactionData[0]?.id}`);
    }
    
    console.log(`[CHECKOUT] Checkout session processing completed successfully`);
    
  } catch (error) {
    console.error(`[CHECKOUT ERROR] Error processing checkout session:`, error);
    console.error(`[CHECKOUT ERROR] Stack trace:`, error.stack);
    // We don't rethrow to avoid breaking the webhook flow
  }
}

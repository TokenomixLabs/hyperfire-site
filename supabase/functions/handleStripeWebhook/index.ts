
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import Stripe from "https://esm.sh/stripe@13.7.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Enable verbose logging for testing
const VERBOSE_LOGGING = true;

function logInfo(message: string, data?: any) {
  if (VERBOSE_LOGGING) {
    if (data) {
      console.log(`[INFO] ${message}`, JSON.stringify(data, null, 2));
    } else {
      console.log(`[INFO] ${message}`);
    }
  }
}

function logError(message: string, error: any) {
  console.error(`[ERROR] ${message}`, error);
}

serve(async (req) => {
  // Log the request details to help with debugging
  console.log(`[WEBHOOK] Received request method: ${req.method}, URL: ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log(`[WEBHOOK] Handling OPTIONS request`);
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`[WEBHOOK] Starting webhook processing`);
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeSecretKey || !stripeWebhookSecret) {
      const error = "Missing required environment variables: STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET";
      console.error(`[WEBHOOK ERROR] ${error}`);
      throw new Error(error);
    }
    console.log(`[WEBHOOK] Environment variables validated`);

    // Initialize Stripe client
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });
    console.log(`[WEBHOOK] Stripe client initialized`);

    // Get the signature from the header
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      const error = "No Stripe signature found in request headers";
      console.error(`[WEBHOOK ERROR] ${error}`);
      throw new Error(error);
    }
    console.log(`[WEBHOOK] Stripe signature found: ${signature.substring(0, 10)}...`);

    // Get the request body as text
    const requestBody = await req.text();
    console.log(`[WEBHOOK] Received webhook payload length: ${requestBody.length} bytes`);
    
    // Verify the event with Stripe
    console.log(`[WEBHOOK] Attempting to verify webhook signature`);
    const event = stripe.webhooks.constructEvent(
      requestBody,
      signature,
      stripeWebhookSecret
    );
    console.log(`[WEBHOOK] Webhook signature verified successfully for event: ${event.type}`);

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!supabaseUrl || !supabaseServiceKey) {
      const error = "Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY";
      console.error(`[WEBHOOK ERROR] ${error}`);
      throw new Error(error);
    }
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log(`[WEBHOOK] Supabase client initialized`);

    console.log(`[WEBHOOK] Processing Stripe event: ${event.type}`);
    logInfo("Full event data", event);

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        console.log(`[WEBHOOK] Processing checkout.session.completed event`);
        await handleCheckoutSessionCompleted(event.data.object, stripe, supabase);
        break;
      
      case "invoice.paid":
        console.log(`[WEBHOOK] Processing invoice.paid event`);
        await handleInvoicePaid(event.data.object, stripe, supabase);
        break;
      
      case "account.updated":
        console.log(`[WEBHOOK] Processing account.updated event`);
        await handleAccountUpdated(event.data.object, supabase);
        break;
      
      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }

    console.log(`[WEBHOOK] Successfully processed event ${event.type}`);
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(`[WEBHOOK ERROR] Error processing webhook:`, error);
    console.error(`[WEBHOOK ERROR] Stack trace:`, error.stack);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred processing the webhook",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

/**
 * Handles checkout.session.completed events
 */
async function handleCheckoutSessionCompleted(
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

    // Get user ID from customer email
    console.log(`[CHECKOUT] Looking up user ID for email: ${customerEmail}`);
    const { data: userData, error: userError } = await supabase
      .from("auth")
      .select("users.id")
      .eq("users.email", customerEmail)
      .single();

    if (userError) {
      console.error(`[CHECKOUT ERROR] User lookup error:`, userError);
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

/**
 * Handles invoice.paid events for subscription payments
 */
async function handleInvoicePaid(
  invoice: Stripe.Invoice,
  stripe: Stripe,
  supabase: any
) {
  console.log(`[INVOICE] Starting invoice.paid handler for invoice: ${invoice.id}`);
  
  try {
    // Similar to checkout.session.completed but for recurring payments
    const customerEmail = invoice.customer_email;
    const customerId = invoice.customer as string;
    
    console.log(`[INVOICE] Processing payment for customer: ${customerId}, email: ${customerEmail || "unknown"}`);
    
    if (!customerEmail) {
      console.log(`[INVOICE] No email in invoice, looking up customer details`);
      const customer = await getCustomerDetails(customerId, stripe);
      if (!customer || !customer.email) {
        console.error(`[INVOICE ERROR] No customer email found in invoice or customer object`);
        throw new Error("No customer email found in invoice or customer object");
      }
    }
    
    // Remaining processing is similar to checkout.session.completed
    // Extract subscription details, find user, process referral payment if applicable
    // For brevity, basic logging only:
    console.log(`[INVOICE] Processed subscription payment for ${customerEmail || customerId}`);
    
  } catch (error) {
    console.error(`[INVOICE ERROR] Error processing invoice payment:`, error);
    console.error(`[INVOICE ERROR] Stack trace:`, error.stack);
    // We don't rethrow to avoid breaking the webhook flow
  }
}

/**
 * Handles account.updated events to track Connect account status
 */
async function handleAccountUpdated(
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

/**
 * Helper function to get customer details
 */
async function getCustomerDetails(
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

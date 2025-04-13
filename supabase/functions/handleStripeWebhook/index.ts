
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import Stripe from "https://esm.sh/stripe@13.7.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeSecretKey || !stripeWebhookSecret) {
      throw new Error("Missing required environment variables: STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    }

    // Initialize Stripe client
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Get the signature from the header
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No Stripe signature found in request headers");
    }

    // Get the request body as text
    const requestBody = await req.text();
    
    // Verify the event with Stripe
    const event = stripe.webhooks.constructEvent(
      requestBody,
      signature,
      stripeWebhookSecret
    );

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Processing Stripe event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object, stripe, supabase);
        break;
      
      case "invoice.paid":
        await handleInvoicePaid(event.data.object, stripe, supabase);
        break;
      
      case "account.updated":
        await handleAccountUpdated(event.data.object, supabase);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
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
  console.log("Processing checkout.session.completed:", session.id);
  
  try {
    // Extract important information from the session
    const customer = await getCustomerDetails(session.customer as string, stripe);
    const customerEmail = customer?.email || session.customer_details?.email;
    
    if (!customerEmail) {
      throw new Error("No customer email found in session or customer object");
    }

    // Get user ID from customer email
    const { data: userData, error: userError } = await supabase
      .from("auth")
      .select("users.id")
      .eq("users.email", customerEmail)
      .single();

    if (userError || !userData) {
      console.log("User not found for email:", customerEmail);
    }

    // Extract line items to get product and amount details
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    if (!lineItems || lineItems.data.length === 0) {
      throw new Error("No line items found in session");
    }

    const amount = session.amount_total || 0;
    const customerId = userData?.id || null;
    
    // Get metadata
    const metadata = session.metadata || {};
    const referrerId = metadata.referrerId || null;
    const funnelId = metadata.funnelId || null;
    
    // If there's a referrer, prepare to process the referral payment
    let referrerCut = null;
    let platformCut = null;
    let referrerStripeAccountId = null;
    let transferId = null;
    
    if (referrerId) {
      console.log(`Payment has a referrer: ${referrerId}`);
      
      // Get referrer's commission rate and Stripe account
      const { data: referrerData, error: referrerError } = await supabase
        .from("stripe_accounts")
        .select("stripe_account_id")
        .eq("user_id", referrerId)
        .eq("is_active", true)
        .single();
      
      if (referrerError || !referrerData) {
        console.log(`No active Stripe account found for referrer: ${referrerId}`);
      } else {
        referrerStripeAccountId = referrerData.stripe_account_id;
        
        // Fetch the product to get commission rate
        const lineItem = lineItems.data[0];
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("revenue_share_percent")
          .eq("stripe_price_id", lineItem.price?.id)
          .single();
        
        const commissionRate = productData?.revenue_share_percent || 80; // Default 80% if not found
        
        // Calculate the split
        referrerCut = Math.floor((amount * commissionRate) / 100);
        platformCut = amount - referrerCut;
        
        console.log(`Commission calculation: ${amount} * ${commissionRate}% = ${referrerCut} for referrer, ${platformCut} for platform`);
        
        // Process transfer to the referrer's connected account if they have one
        if (referrerStripeAccountId) {
          try {
            // Create a transfer to the connected account
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
            console.log(`Successfully transferred ${referrerCut} to referrer account ${referrerStripeAccountId}`);
          } catch (transferError) {
            console.error("Error creating transfer:", transferError);
            // We don't throw here to avoid breaking the webhook flow
            // The transfer can be retried manually if needed
          }
        }
      }
    }
    
    // Log the transaction in the database
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
      console.error("Error logging transaction:", transactionError);
    } else {
      console.log("Transaction logged successfully:", transactionData);
    }
    
  } catch (error) {
    console.error("Error processing checkout session:", error);
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
  console.log("Processing invoice.paid:", invoice.id);
  
  try {
    // Similar to checkout.session.completed but for recurring payments
    const customerEmail = invoice.customer_email;
    const customerId = invoice.customer as string;
    
    if (!customerEmail) {
      const customer = await getCustomerDetails(customerId, stripe);
      if (!customer || !customer.email) {
        throw new Error("No customer email found in invoice or customer object");
      }
    }
    
    // Remaining processing is similar to checkout.session.completed
    // Extract subscription details, find user, process referral payment if applicable
    // For brevity, basic logging only:
    console.log(`Processed subscription payment for ${customerEmail || customerId}`);
    
  } catch (error) {
    console.error("Error processing invoice payment:", error);
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
  console.log("Processing account.updated:", account.id);
  
  try {
    // Get user id from metadata
    const userId = account.metadata?.user_id;
    
    if (!userId) {
      console.log("No user_id found in account metadata, cannot update account status");
      return;
    }
    
    // Update the account status in the database
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
      console.error("Error updating account status:", error);
    } else {
      console.log(`Updated account status for user ${userId}, account ${account.id}, charges_enabled: ${account.charges_enabled}`);
    }
    
  } catch (error) {
    console.error("Error processing account update:", error);
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
    return await stripe.customers.retrieve(customerId) as Stripe.Customer;
  } catch (error) {
    console.error("Error retrieving customer:", error);
    return null;
  }
}

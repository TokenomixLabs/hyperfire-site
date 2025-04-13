
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import Stripe from "https://esm.sh/stripe@13.7.0";
import { corsHeaders, logInfo, logError } from "./utils.ts";
import { handleCheckoutSessionCompleted } from "./handlers/checkoutSession.ts";
import { handleInvoicePaid } from "./handlers/invoice.ts";
import { handleAccountUpdated } from "./handlers/account.ts";

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

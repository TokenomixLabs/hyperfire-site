
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import Stripe from "https://esm.sh/stripe@13.7.0";

// CORS headers for all responses
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
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create a sample checkout.session.completed event
    const event = {
      id: `evt_test_${Date.now()}`,
      object: "event",
      api_version: "2023-10-16",
      created: Math.floor(Date.now() / 1000),
      type: "checkout.session.completed",
      data: {
        object: {
          id: `cs_test_${Date.now()}`,
          object: "checkout.session",
          amount_total: 4999,
          currency: "usd",
          customer: "cus_test123456",
          customer_details: {
            email: "test@example.com",
          },
          metadata: {
            referrerId: "test-referrer-id", // Simulate a referral
            funnelId: "test-funnel-id"
          },
          payment_intent: `pi_test_${Date.now()}`,
          line_items: {
            data: [
              {
                id: `li_test_${Date.now()}`,
                amount_total: 4999,
                currency: "usd",
                description: "Test Product",
                quantity: 1,
                price: {
                  id: "price_test123456",
                }
              }
            ]
          }
        }
      }
    };
    
    // Get the webhook endpoint URL
    const { data: urlData, error: urlError } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "webhook_endpoint_url")
      .single();
    
    let webhookUrl = "http://localhost:54321/functions/v1/handleStripeWebhook";
    
    if (!urlError && urlData && urlData.value) {
      webhookUrl = urlData.value;
    }
    
    console.log(`[SIMULATE] Sending test webhook to: ${webhookUrl}`);
    
    // Create a signature for the event
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = JSON.stringify(event);
    
    const signature = await createStripeSignature(
      payload,
      stripeWebhookSecret,
      timestamp
    );
    
    // Send the event to the webhook endpoint
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Stripe-Signature": `t=${timestamp},v1=${signature}`,
      },
      body: payload,
    });
    
    const responseText = await response.text();
    
    return new Response(
      JSON.stringify({
        success: response.ok,
        status: response.status,
        response: responseText,
        event: {
          id: event.id,
          type: event.type,
          timestamp: timestamp,
        },
        message: "Test webhook sent successfully. Check the logs for handleStripeWebhook to see the results."
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`[SIMULATE ERROR] Error sending test webhook:`, error);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while sending test webhook",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Helper function to create a Stripe signature
async function createStripeSignature(
  payload: string,
  secret: string,
  timestamp: number
): Promise<string> {
  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signedPayload)
  );
  
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

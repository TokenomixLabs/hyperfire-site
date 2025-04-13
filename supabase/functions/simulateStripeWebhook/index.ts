
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

    // Try to get a real user email for testing
    let testEmail = "test@example.com";
    
    try {
      // First try with auth.users (admin API)
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers({ 
        page: 1, 
        perPage: 1
      });
      
      if (!authError && authData && authData.users && authData.users.length > 0) {
        testEmail = authData.users[0].email;
        console.log(`[SIMULATE] Using existing auth user email: ${testEmail}`);
      } else {
        console.log(`[SIMULATE] No auth users found or error: ${authError?.message}`);
        
        // Fallback to public users table
        try {
          const { data: users, error: usersError } = await supabase
            .from("users")
            .select("email")
            .limit(1);
          
          if (!usersError && users && users.length > 0) {
            testEmail = users[0].email;
            console.log(`[SIMULATE] Using existing public user email: ${testEmail}`);
          } else {
            console.log(`[SIMULATE] No users found in public table: ${usersError?.message}`);
          }
        } catch (e) {
          console.log(`[SIMULATE] Error fetching users from public table: ${e.message}`);
        }
      }
    } catch (e) {
      console.log(`[SIMULATE] Error accessing auth users: ${e.message}`);
    }
    
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
            email: testEmail,
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
    
    // Get the webhook endpoint URL - either from the database or construct it
    const supabaseProjectId = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1] || '';
    
    // First try to get from the system_settings table if it exists
    let webhookUrl = '';
    
    try {
      const { data: urlData } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "webhook_endpoint_url")
        .single();
      
      if (urlData?.value) {
        webhookUrl = urlData.value;
        console.log(`[SIMULATE] Using stored webhook URL: ${webhookUrl}`);
      }
    } catch (e) {
      console.log(`[SIMULATE] No stored webhook URL found: ${e.message}`);
    }
    
    // If no URL was found in the database, construct it
    if (!webhookUrl) {
      // Use the same Supabase project as this function is running in
      webhookUrl = `https://${supabaseProjectId}.supabase.co/functions/v1/handleStripeWebhook`;
      console.log(`[SIMULATE] Generated webhook URL: ${webhookUrl}`);
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
    
    let responseText = "";
    try {
      responseText = await response.text();
    } catch (e) {
      console.error(`[SIMULATE ERROR] Error reading response text: ${e.message}`);
    }
    
    if (!response.ok) {
      console.error(`[SIMULATE ERROR] Webhook response error: ${response.status} ${responseText}`);
    } else {
      console.log(`[SIMULATE SUCCESS] Webhook response: ${response.status} ${responseText}`);
    }
    
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
        message: response.ok 
          ? "Test webhook sent successfully. Check the logs for handleStripeWebhook to see the results."
          : `Error sending webhook: ${response.status} ${responseText}`,
        webhookUrl: webhookUrl
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

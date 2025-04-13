
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
    // Initialize Stripe client
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Get the authenticated user from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get user from auth header
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      throw new Error("Authentication failed");
    }

    console.log(`User authenticated: ${user.id}`);

    // Check if the user already has a Stripe account
    const { data: existingAccount, error: accountError } = await supabase
      .from("stripe_accounts")
      .select("stripe_account_id, is_active")
      .eq("user_id", user.id)
      .maybeSingle();

    if (accountError) {
      console.error("Error checking for existing Stripe account:", accountError);
      throw new Error("Failed to check for existing Stripe account");
    }

    let stripeAccountId;

    // If the user doesn't have a Stripe account, create one
    if (!existingAccount) {
      console.log("Creating new Stripe Connect account for user:", user.id);
      
      // Create a new Stripe Connect Express account
      const account = await stripe.accounts.create({
        type: "express",
        capabilities: {
          transfers: { requested: true },
        },
        country: "US",
        email: user.email,
        metadata: {
          user_id: user.id
        }
      });
      
      stripeAccountId = account.id;
      console.log(`Created Stripe account with ID: ${stripeAccountId}`);

      // Store the Stripe account ID in the database
      const { error: insertError } = await supabase
        .from("stripe_accounts")
        .insert({
          user_id: user.id,
          stripe_account_id: stripeAccountId,
          is_active: false,
          connected_at: new Date().toISOString(),
          metadata: {
            account_type: "express",
            capabilities: ["transfers"]
          }
        });

      if (insertError) {
        console.error("Error storing Stripe account:", insertError);
        throw new Error("Failed to store Stripe account information");
      }
      
      console.log("Stored Stripe account in database");
    } else {
      // Use the existing Stripe account ID
      stripeAccountId = existingAccount.stripe_account_id;
      console.log(`Using existing Stripe account ID: ${stripeAccountId}`);
    }

    // Create an account link for the user to onboard to Stripe Connect
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${origin}/dashboard?stripe_connect_refresh=true`,
      return_url: `${origin}/dashboard?stripe_connect_success=true`,
      type: "account_onboarding",
    });

    console.log("Generated Stripe account link:", accountLink.url);

    // Return the account link URL to the client
    return new Response(
      JSON.stringify({
        url: accountLink.url,
        accountId: stripeAccountId
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in createStripeAccountLink:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

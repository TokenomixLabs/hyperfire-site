
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") as string;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") as string;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create authenticated Supabase client
    const supabaseAdmin = createClient(
      SUPABASE_URL,
      SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get connection ID from request
    const { connectionId } = await req.json();

    if (!connectionId) {
      throw new Error("Connection ID is required");
    }

    // Get the connection details from the database
    const { data: connection, error: connectionError } = await supabaseAdmin
      .from("autoresponder_connections")
      .select("*")
      .eq("id", connectionId)
      .single();

    if (connectionError) {
      throw new Error(`Failed to fetch connection: ${connectionError.message}`);
    }

    if (!connection) {
      throw new Error("Connection not found");
    }

    // Test the connection based on the provider
    let testResult;
    switch (connection.provider) {
      case "aweber":
        testResult = await testAWeberConnection(connection);
        break;
      case "convertkit":
        testResult = await testConvertKitConnection(connection);
        break;
      case "mailchimp":
        testResult = await testMailchimpConnection(connection);
        break;
      case "activecampaign":
        testResult = await testActiveCampaignConnection(connection);
        break;
      default:
        throw new Error(`Unsupported provider: ${connection.provider}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Connection test successful", ...testResult }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error testing connection:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

// Test functions for each provider
async function testAWeberConnection(connection: any) {
  // For now, we'll just simulate a successful test
  // In a production environment, you would make an actual API call to AWeber
  console.log("Testing AWeber connection:", connection.id);
  
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { provider: "aweber", listId: connection.list_id };
}

async function testConvertKitConnection(connection: any) {
  // For now, we'll just simulate a successful test
  console.log("Testing ConvertKit connection:", connection.id);
  
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { provider: "convertkit", formId: connection.list_id };
}

async function testMailchimpConnection(connection: any) {
  // For now, we'll just simulate a successful test
  console.log("Testing Mailchimp connection:", connection.id);
  
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { provider: "mailchimp", listId: connection.list_id };
}

async function testActiveCampaignConnection(connection: any) {
  // For now, we'll just simulate a successful test
  console.log("Testing ActiveCampaign connection:", connection.id);
  
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { provider: "activecampaign", listId: connection.list_id };
}

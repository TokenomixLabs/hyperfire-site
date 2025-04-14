
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

    // Get lead ID and referrer ID from request
    const { leadId, referrerId } = await req.json();

    if (!leadId || !referrerId) {
      throw new Error("Lead ID and referrer ID are required");
    }

    // Get the lead details from the database
    const { data: lead, error: leadError } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError) {
      throw new Error(`Failed to fetch lead: ${leadError.message}`);
    }

    if (!lead) {
      throw new Error("Lead not found");
    }

    // Check if the referrer has any autoresponder connections
    const { data: connections, error: connectionsError } = await supabaseAdmin
      .from("autoresponder_connections")
      .select("*")
      .eq("user_id", referrerId)
      .eq("is_active", true);

    if (connectionsError) {
      throw new Error(`Failed to fetch connections: ${connectionsError.message}`);
    }

    if (!connections || connections.length === 0) {
      // No active connections found, just return success
      console.log("No active ESP connections found for referrer:", referrerId);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No active ESP connections found" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Process each connection
    const syncResults = await Promise.all(
      connections.map(async (connection) => {
        try {
          // Sync lead to the ESP based on provider
          const syncResult = await syncLeadToESP(lead, connection);
          
          // Update the lead with ESP status
          const { error: updateError } = await supabaseAdmin
            .from("leads")
            .update({
              esp_status: "synced",
              esp_provider: connection.provider,
              esp_response: syncResult
            })
            .eq("id", leadId);

          if (updateError) {
            console.error("Error updating lead status:", updateError);
          }

          return {
            connectionId: connection.id,
            provider: connection.provider,
            success: true,
            ...syncResult
          };
        } catch (error) {
          console.error(`Error syncing lead to ${connection.provider}:`, error);
          
          // Update the lead with error status
          const { error: updateError } = await supabaseAdmin
            .from("leads")
            .update({
              esp_status: "error",
              esp_provider: connection.provider,
              esp_response: { error: error.message }
            })
            .eq("id", leadId);

          if (updateError) {
            console.error("Error updating lead status:", updateError);
          }

          return {
            connectionId: connection.id,
            provider: connection.provider,
            success: false,
            error: error.message
          };
        }
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Lead synced to ESP providers",
        results: syncResults
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error syncing lead:", error);
    
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

async function syncLeadToESP(lead: any, connection: any) {
  // For now, we'll simulate API calls to the ESPs
  // In a production environment, you would make actual API calls
  
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Prepare common subscriber data
  const subscriber = {
    email: lead.email,
    first_name: lead.first_name,
    last_name: lead.last_name,
    phone: lead.phone,
    // Additional custom fields could be included based on the ESP's requirements
  };

  // Call the appropriate function based on the provider
  switch (connection.provider) {
    case "aweber":
      return syncToAWeber(subscriber, connection);
    case "convertkit":
      return syncToConvertKit(subscriber, connection);
    case "mailchimp":
      return syncToMailchimp(subscriber, connection);
    case "activecampaign":
      return syncToActiveCampaign(subscriber, connection);
    default:
      throw new Error(`Unsupported provider: ${connection.provider}`);
  }
}

// Provider-specific sync functions
async function syncToAWeber(subscriber: any, connection: any) {
  console.log("Syncing to AWeber:", {
    subscriber,
    listId: connection.list_id,
    tag: connection.tag
  });
  
  // Simulate successful API response
  return {
    subscriber_id: `aweber_${Date.now()}`,
    list_id: connection.list_id,
    tags: connection.tag ? [connection.tag] : []
  };
}

async function syncToConvertKit(subscriber: any, connection: any) {
  console.log("Syncing to ConvertKit:", {
    subscriber,
    formId: connection.list_id,
    tag: connection.tag
  });
  
  // Simulate successful API response
  return {
    subscriber_id: `ck_${Date.now()}`,
    form_id: connection.list_id,
    tags: connection.tag ? [connection.tag] : []
  };
}

async function syncToMailchimp(subscriber: any, connection: any) {
  console.log("Syncing to Mailchimp:", {
    subscriber,
    listId: connection.list_id,
    tag: connection.tag
  });
  
  // Simulate successful API response
  return {
    subscriber_id: `mc_${Date.now()}`,
    list_id: connection.list_id,
    tags: connection.tag ? [connection.tag] : []
  };
}

async function syncToActiveCampaign(subscriber: any, connection: any) {
  console.log("Syncing to ActiveCampaign:", {
    subscriber,
    listId: connection.list_id,
    tag: connection.tag
  });
  
  // Simulate successful API response
  return {
    subscriber_id: `ac_${Date.now()}`,
    list_id: connection.list_id,
    tags: connection.tag ? [connection.tag] : []
  };
}


import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

serve(async (req) => {
  // Create a Supabase client with the Auth context of the logged in user
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  // Get the referrer ID from the request
  const { p_referrer_id } = await req.json()

  // Check for required parameters
  if (!p_referrer_id) {
    return new Response(
      JSON.stringify({ error: 'Referrer ID is required' }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }

  try {
    // Check user's permission
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Query the commission_rules table to count rules for this referrer
    const { count, error: countError } = await supabaseClient
      .from('commission_rules')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', p_referrer_id)

    if (countError) {
      throw countError
    }

    return new Response(
      JSON.stringify(count),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

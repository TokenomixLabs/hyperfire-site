
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

serve(async (req) => {
  // Create a Supabase client
  const url = Deno.env.get('SUPABASE_URL') ?? ''
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const supabase = createClient(url, key)

  // Get user ID from request
  const auth = req.headers.get('Authorization')?.split(' ')[1]
  
  if (!auth) {
    return new Response(
      JSON.stringify({ error: 'No authorization header' }),
      { headers: { 'Content-Type': 'application/json' }, status: 401 }
    )
  }

  // Verify the token and get the user
  const { data: { user }, error: userError } = await supabase.auth.getUser(auth)

  if (userError || !user) {
    return new Response(
      JSON.stringify({ error: 'Authentication failed' }),
      { headers: { 'Content-Type': 'application/json' }, status: 401 }
    )
  }

  // Get the user's brand settings
  const { data, error } = await supabase
    .from('brand_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }

  return new Response(
    JSON.stringify(data || {}),
    { headers: { 'Content-Type': 'application/json' } }
  )
})

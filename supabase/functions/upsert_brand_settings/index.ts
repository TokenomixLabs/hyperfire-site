
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

interface BrandSettingsInput {
  p_logo_url?: string
  p_favicon_url?: string
  p_primary_color: string
  p_secondary_color: string
  p_accent_color: string
  p_font: string
  p_theme_mode: string
  p_button_style: string
}

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

  try {
    // Parse request body
    const input: BrandSettingsInput = await req.json()
    
    // Upsert the brand settings
    const { data, error } = await supabase
      .from('brand_settings')
      .upsert({
        user_id: user.id,
        logo_url: input.p_logo_url,
        favicon_url: input.p_favicon_url,
        primary_color: input.p_primary_color,
        secondary_color: input.p_secondary_color,
        accent_color: input.p_accent_color,
        font: input.p_font,
        theme_mode: input.p_theme_mode,
        button_style: input.p_button_style
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify(data),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

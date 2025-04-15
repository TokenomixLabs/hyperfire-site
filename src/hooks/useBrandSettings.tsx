
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface BrandSettings {
  logo_url?: string;
  favicon_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font: string;
  theme_mode: string;
  button_style: string;
}

const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  primary_color: '#0A84FF',
  secondary_color: '#5E5CE6',
  accent_color: '#FF2D55',
  font: 'Inter',
  theme_mode: 'auto',
  button_style: 'pill'
};

export const useBrandSettings = () => {
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(DEFAULT_BRAND_SETTINGS);

  useEffect(() => {
    const fetchBrandSettings = async () => {
      try {
        // Use the fetch API directly to call the RPC function
        const { data, error } = await supabase.functions.invoke('get_brand_settings');
        
        if (data && !error) {
          setBrandSettings({
            ...DEFAULT_BRAND_SETTINGS,
            ...data as BrandSettings
          });
        }
      } catch (error) {
        console.error("Error fetching brand settings:", error);
      }
    };

    fetchBrandSettings();
  }, []);

  return brandSettings;
};

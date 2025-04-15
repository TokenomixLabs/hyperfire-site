
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

export const useBrandSettingsAPI = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const fetchBrandSettings = async (): Promise<BrandSettings | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get_brand_settings');
      
      if (error) {
        console.error("Error fetching brand settings:", error);
        return null;
      }
      
      return data as BrandSettings;
    } catch (error) {
      console.error("Error fetching brand settings:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveBrandSettings = async (settings: BrandSettings): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('upsert_brand_settings', {
        body: {
          p_logo_url: settings.logo_url,
          p_favicon_url: settings.favicon_url,
          p_primary_color: settings.primary_color,
          p_secondary_color: settings.secondary_color,
          p_accent_color: settings.accent_color,
          p_font: settings.font,
          p_theme_mode: settings.theme_mode,
          p_button_style: settings.button_style
        }
      });

      if (error) {
        toast({ 
          title: "Error", 
          description: "Could not save brand settings: " + error.message, 
          variant: "destructive" 
        });
        return false;
      } 
      
      toast({ 
        title: "Success", 
        description: "Brand settings updated" 
      });
      return true;
    } catch (error) {
      console.error("Error saving brand settings:", error);
      toast({ 
        title: "Error", 
        description: "Could not save brand settings", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchBrandSettings,
    saveBrandSettings,
    isLoading
  };
};

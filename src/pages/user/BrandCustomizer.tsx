
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PageTitle } from "@/components/ui/page-headers";
import { ChromePicker } from 'react-color';
import { useAuth } from '@/context/AuthContext';

const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
  'Poppins', 'Source Sans Pro', 'Nunito', 'Raleway', 'Playfair Display'
];

const THEME_MODES = ['auto', 'light', 'dark'];
const BUTTON_STYLES = ['pill', 'square'];

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

const BrandCustomizer: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    logo_url: '',
    favicon_url: '',
    primary_color: '#0A84FF',
    secondary_color: '#5E5CE6',
    accent_color: '#FF2D55',
    font: 'Inter',
    theme_mode: 'auto',
    button_style: 'pill'
  });

  useEffect(() => {
    fetchBrandSettings();
  }, []);

  const fetchBrandSettings = async () => {
    try {
      // Use type assertion to tell TypeScript this is okay
      const { data, error } = await supabase
        .rpc('get_brand_settings') as { data: BrandSettings | null, error: Error | null };

      if (data) {
        setBrandSettings(prev => ({
          ...prev,
          ...data as BrandSettings
        }));
      }
    } catch (error) {
      console.error("Error fetching brand settings:", error);
    }
  };

  const handleSave = async () => {
    try {
      // Use type assertion to tell TypeScript this is okay
      const { data, error } = await supabase
        .rpc('upsert_brand_settings', {
          p_logo_url: brandSettings.logo_url,
          p_favicon_url: brandSettings.favicon_url,
          p_primary_color: brandSettings.primary_color,
          p_secondary_color: brandSettings.secondary_color,
          p_accent_color: brandSettings.accent_color,
          p_font: brandSettings.font,
          p_theme_mode: brandSettings.theme_mode,
          p_button_style: brandSettings.button_style
        }) as { data: any, error: Error | null };

      if (error) {
        toast({ 
          title: "Error", 
          description: "Could not save brand settings: " + error.message, 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Success", 
          description: "Brand settings updated" 
        });
      }
    } catch (error) {
      console.error("Error saving brand settings:", error);
      toast({ 
        title: "Error", 
        description: "Could not save brand settings", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <PageTitle>Brand Customization</PageTitle>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Logo & Favicon</h2>
          <Input 
            placeholder="Logo URL" 
            value={brandSettings.logo_url || ''}
            onChange={(e) => setBrandSettings({...brandSettings, logo_url: e.target.value})}
          />
          <Input 
            placeholder="Favicon URL" 
            value={brandSettings.favicon_url || ''}
            onChange={(e) => setBrandSettings({...brandSettings, favicon_url: e.target.value})}
          />

          <h2 className="text-xl font-semibold mt-4">Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            {['primary', 'secondary', 'accent'].map(colorType => (
              <div key={colorType}>
                <label>{colorType.charAt(0).toUpperCase() + colorType.slice(1)} Color</label>
                <ChromePicker 
                  color={brandSettings[`${colorType}_color` as keyof BrandSettings] as string}
                  onChange={(color) => setBrandSettings({
                    ...brandSettings, 
                    [`${colorType}_color`]: color.hex
                  } as BrandSettings)}
                />
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mt-4">Appearance</h2>
          <Select 
            value={brandSettings.font}
            onValueChange={(value) => setBrandSettings({...brandSettings, font: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Font" />
            </SelectTrigger>
            <SelectContent>
              {GOOGLE_FONTS.map(font => (
                <SelectItem key={font} value={font}>{font}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={brandSettings.theme_mode}
            onValueChange={(value) => setBrandSettings({...brandSettings, theme_mode: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Theme Mode" />
            </SelectTrigger>
            <SelectContent>
              {THEME_MODES.map(mode => (
                <SelectItem key={mode} value={mode}>{mode}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={brandSettings.button_style}
            onValueChange={(value) => setBrandSettings({...brandSettings, button_style: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Button Style" />
            </SelectTrigger>
            <SelectContent>
              {BUTTON_STYLES.map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSave} className="w-full mt-4">
            Save Brand Settings
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
          <div 
            className="border p-4 rounded-lg" 
            style={{
              fontFamily: brandSettings.font,
              backgroundColor: brandSettings.primary_color,
              color: 'white'
            }}
          >
            Preview Area
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCustomizer;

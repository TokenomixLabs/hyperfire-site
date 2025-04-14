
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PageTitle } from "@/components/ui/page-headers";
import { ChromePicker } from 'react-color';

const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
  'Poppins', 'Source Sans Pro', 'Nunito', 'Raleway', 'Playfair Display'
];

const THEME_MODES = ['auto', 'light', 'dark'];
const BUTTON_STYLES = ['pill', 'square'];

const BrandCustomizer: React.FC = () => {
  const { toast } = useToast();
  const [brandSettings, setBrandSettings] = useState({
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
    const { data, error } = await supabase
      .from('brand_settings')
      .select('*')
      .single();

    if (data) {
      setBrandSettings(data);
    }
  };

  const handleSave = async () => {
    const { data, error } = await supabase
      .from('brand_settings')
      .upsert(brandSettings, { 
        onConflict: 'user_id' 
      });

    if (error) {
      toast({ 
        title: "Error", 
        description: "Could not save brand settings", 
        variant: "destructive" 
      });
    } else {
      toast({ 
        title: "Success", 
        description: "Brand settings updated" 
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
            value={brandSettings.logo_url}
            onChange={(e) => setBrandSettings({...brandSettings, logo_url: e.target.value})}
          />
          <Input 
            placeholder="Favicon URL" 
            value={brandSettings.favicon_url}
            onChange={(e) => setBrandSettings({...brandSettings, favicon_url: e.target.value})}
          />

          <h2 className="text-xl font-semibold mt-4">Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            {['primary', 'secondary', 'accent'].map(colorType => (
              <div key={colorType}>
                <label>{colorType.charAt(0).toUpperCase() + colorType.slice(1)} Color</label>
                <ChromePicker 
                  color={brandSettings[`${colorType}_color`]}
                  onChange={(color) => setBrandSettings({
                    ...brandSettings, 
                    [`${colorType}_color`]: color.hex
                  })}
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


import React, { useState, useEffect } from 'react';
import { PageTitle } from "@/components/ui/page-headers";
import { useAuth } from '@/context/AuthContext';
import BrandSettingsForm from '@/components/brand/BrandSettingsForm';
import BrandPreview from '@/components/brand/BrandPreview';
import { useBrandSettingsAPI } from '@/hooks/useBrandSettingsAPI';

// Constants
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

const DEFAULT_SETTINGS: BrandSettings = {
  logo_url: '',
  favicon_url: '',
  primary_color: '#0A84FF',
  secondary_color: '#5E5CE6',
  accent_color: '#FF2D55',
  font: 'Inter',
  theme_mode: 'auto',
  button_style: 'pill'
};

const BrandCustomizer: React.FC = () => {
  const { user } = useAuth();
  const { fetchBrandSettings, saveBrandSettings, isLoading } = useBrandSettingsAPI();
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const loadBrandSettings = async () => {
      const settings = await fetchBrandSettings();
      if (settings) {
        setBrandSettings(prev => ({
          ...prev,
          ...settings
        }));
      }
    };
    
    loadBrandSettings();
  }, []);

  const handleSave = async () => {
    await saveBrandSettings(brandSettings);
  };

  return (
    <div className="container mx-auto p-6">
      <PageTitle>Brand Customization</PageTitle>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <BrandSettingsForm 
            brandSettings={brandSettings}
            setBrandSettings={setBrandSettings}
            onSave={handleSave}
            googleFonts={GOOGLE_FONTS}
            themeModes={THEME_MODES}
            buttonStyles={BUTTON_STYLES}
          />
        </div>

        <div>
          <BrandPreview 
            font={brandSettings.font}
            primaryColor={brandSettings.primary_color}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandCustomizer;

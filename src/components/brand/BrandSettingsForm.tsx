
import React from 'react';
import { Button } from "@/components/ui/button";
import URLInputField from './URLInputField';
import ColorPickerField from './ColorPickerField';
import SelectField from './SelectField';

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

interface BrandSettingsFormProps {
  brandSettings: BrandSettings;
  setBrandSettings: React.Dispatch<React.SetStateAction<BrandSettings>>;
  onSave: () => Promise<void>;
  googleFonts: string[];
  themeModes: string[];
  buttonStyles: string[];
}

const BrandSettingsForm: React.FC<BrandSettingsFormProps> = ({ 
  brandSettings, 
  setBrandSettings, 
  onSave,
  googleFonts,
  themeModes,
  buttonStyles
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Logo & Favicon</h2>
      <URLInputField 
        placeholder="Logo URL" 
        value={brandSettings.logo_url || ''}
        onChange={(value) => setBrandSettings({...brandSettings, logo_url: value})}
      />
      <URLInputField 
        placeholder="Favicon URL" 
        value={brandSettings.favicon_url || ''}
        onChange={(value) => setBrandSettings({...brandSettings, favicon_url: value})}
      />

      <h2 className="text-xl font-semibold mt-4">Colors</h2>
      <div className="grid grid-cols-3 gap-4">
        <ColorPickerField 
          label="Primary Color"
          color={brandSettings.primary_color}
          onChange={(color) => setBrandSettings({...brandSettings, primary_color: color})}
        />
        <ColorPickerField 
          label="Secondary Color"
          color={brandSettings.secondary_color}
          onChange={(color) => setBrandSettings({...brandSettings, secondary_color: color})}
        />
        <ColorPickerField 
          label="Accent Color"
          color={brandSettings.accent_color}
          onChange={(color) => setBrandSettings({...brandSettings, accent_color: color})}
        />
      </div>

      <h2 className="text-xl font-semibold mt-4">Appearance</h2>
      <SelectField 
        value={brandSettings.font}
        onValueChange={(value) => setBrandSettings({...brandSettings, font: value})}
        placeholder="Select Font"
        options={googleFonts}
      />

      <SelectField 
        value={brandSettings.theme_mode}
        onValueChange={(value) => setBrandSettings({...brandSettings, theme_mode: value})}
        placeholder="Theme Mode"
        options={themeModes}
      />

      <SelectField 
        value={brandSettings.button_style}
        onValueChange={(value) => setBrandSettings({...brandSettings, button_style: value})}
        placeholder="Button Style"
        options={buttonStyles}
      />

      <Button onClick={onSave} className="w-full mt-4">
        Save Brand Settings
      </Button>
    </div>
  );
};

export default BrandSettingsForm;

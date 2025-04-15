
import React from 'react';
import { ChromePicker } from 'react-color';

interface ColorPickerFieldProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

const ColorPickerField: React.FC<ColorPickerFieldProps> = ({ label, color, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <ChromePicker 
        color={color}
        onChange={(colorResult) => onChange(colorResult.hex)}
      />
    </div>
  );
};

export default ColorPickerField;

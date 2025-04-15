
import React from 'react';
import { Input } from "@/components/ui/input";

interface URLInputFieldProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const URLInputField: React.FC<URLInputFieldProps> = ({ placeholder, value, onChange }) => {
  return (
    <Input 
      placeholder={placeholder} 
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default URLInputField;

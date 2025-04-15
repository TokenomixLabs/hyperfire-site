
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: string[];
}

const SelectField: React.FC<SelectFieldProps> = ({ value, onValueChange, placeholder, options }) => {
  return (
    <Select 
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option} value={option}>{option}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectField;

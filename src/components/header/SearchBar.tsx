
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  isOpen: boolean;
}

const SearchBar = ({ isOpen }: SearchBarProps) => {
  return (
    <div 
      className={`mt-4 transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input 
          className="pl-10 w-full glass-input" 
          placeholder="Search content, documents, and events..." 
        />
      </div>
    </div>
  );
};

export default SearchBar;

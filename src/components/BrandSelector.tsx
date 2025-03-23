
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

type Brand = {
  id: string;
  name: string;
  color: string;
};

const brands: Brand[] = [
  { id: 'all', name: 'All Brands', color: 'bg-gray-500' },
  { id: 'insiderlife', name: 'InsiderLife', color: 'bg-insider-600' },
  { id: 'tokenomix', name: 'Tokenomix', color: 'bg-blue-600' },
  { id: 'insiderdao', name: 'InsiderDAO', color: 'bg-purple-600' },
];

const BrandSelector = () => {
  const [selectedBrand, setSelectedBrand] = useState<Brand>(brands[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${selectedBrand.color} mr-2`} />
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            {selectedBrand.name}
          </span>
        </div>
        <ChevronDown size={16} className="text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 glass-card">
        {brands.map((brand) => (
          <DropdownMenuItem 
            key={brand.id}
            onClick={() => setSelectedBrand(brand)}
            className="flex items-center cursor-pointer"
          >
            <div className={`w-2 h-2 rounded-full ${brand.color} mr-2`} />
            <span>{brand.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BrandSelector;


import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CourseFilters, CourseCategory, CourseFormat, CourseLevel, CourseAccess } from '@/types/courses';

interface CourseFiltersSidebarProps {
  filters: CourseFilters;
  onFilterChange: (filters: CourseFilters) => void;
}

export default function CourseFiltersSidebar({ filters, onFilterChange }: CourseFiltersSidebarProps) {
  const categories: CourseCategory[] = ['AI', 'Business', 'Sovereignty', 'Marketing', 'Technology', 'Personal Growth'];
  const formats: CourseFormat[] = ['video', 'series'];
  const levels: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const accessLevels: CourseAccess[] = ['free', 'vip', 'premium'];
  
  const handleCategoryChange = (category: CourseCategory, checked: boolean) => {
    const currentCategories = filters.categories || [];
    const newCategories = checked 
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category);
    
    onFilterChange({
      ...filters,
      categories: newCategories.length > 0 ? newCategories : undefined
    });
  };
  
  const handleFormatChange = (format: CourseFormat) => {
    onFilterChange({ ...filters, format });
  };
  
  const handleLevelChange = (level: CourseLevel) => {
    onFilterChange({ ...filters, level });
  };
  
  const handleAccessChange = (access: CourseAccess, checked: boolean) => {
    const currentAccess = filters.access || [];
    const newAccess = checked
      ? [...currentAccess, access]
      : currentAccess.filter(a => a !== access);
    
    onFilterChange({
      ...filters,
      access: newAccess.length > 0 ? newAccess : undefined
    });
  };
  
  const resetFilters = () => {
    onFilterChange({});
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Filters</h3>
        <button 
          onClick={resetFilters}
          className="text-sm text-primary hover:underline"
        >
          Reset
        </button>
      </div>
      
      <Accordion type="multiple" defaultValue={['categories', 'format', 'level', 'access']} className="space-y-2">
        <AccordionItem value="categories" className="border rounded-md">
          <AccordionTrigger className="px-4">Categories</AccordionTrigger>
          <AccordionContent className="px-4 pb-3 pt-1">
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={(filters.categories || []).includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                  />
                  <Label htmlFor={`category-${category}`} className="cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="format" className="border rounded-md">
          <AccordionTrigger className="px-4">Format</AccordionTrigger>
          <AccordionContent className="px-4 pb-3 pt-1">
            <RadioGroup 
              value={filters.format} 
              onValueChange={(value) => handleFormatChange(value as CourseFormat)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="format-video" />
                <Label htmlFor="format-video" className="cursor-pointer">Single Video</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="series" id="format-series" />
                <Label htmlFor="format-series" className="cursor-pointer">Multi-Part Series</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="" id="format-all" />
                <Label htmlFor="format-all" className="cursor-pointer">All Formats</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="level" className="border rounded-md">
          <AccordionTrigger className="px-4">Level</AccordionTrigger>
          <AccordionContent className="px-4 pb-3 pt-1">
            <RadioGroup 
              value={filters.level} 
              onValueChange={(value) => handleLevelChange(value as CourseLevel)}
            >
              {levels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level} id={`level-${level}`} />
                  <Label htmlFor={`level-${level}`} className="cursor-pointer">{level}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="" id="level-all" />
                <Label htmlFor="level-all" className="cursor-pointer">All Levels</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="access" className="border rounded-md">
          <AccordionTrigger className="px-4">Access Level</AccordionTrigger>
          <AccordionContent className="px-4 pb-3 pt-1">
            <div className="space-y-2">
              {accessLevels.map((access) => (
                <div key={access} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`access-${access}`} 
                    checked={(filters.access || []).includes(access)}
                    onCheckedChange={(checked) => handleAccessChange(access, checked as boolean)}
                  />
                  <Label htmlFor={`access-${access}`} className="cursor-pointer capitalize">
                    {access}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

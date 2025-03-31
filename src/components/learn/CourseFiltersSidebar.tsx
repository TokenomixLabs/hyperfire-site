
import React from 'react';
import { CourseFilters, CourseCategory, CourseFormat, CourseLevel, CourseAccess } from '@/types/courses';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface CourseFiltersSidebarProps {
  filters: CourseFilters;
  onFilterChange: (filters: CourseFilters) => void;
}

export default function CourseFiltersSidebar({ filters, onFilterChange }: CourseFiltersSidebarProps) {
  // Category filters
  const handleCategoryChange = (category: CourseCategory, checked: boolean) => {
    let updatedCategories: CourseCategory[] = [...(filters.categories || [])];
    
    if (checked) {
      updatedCategories.push(category);
    } else {
      updatedCategories = updatedCategories.filter(c => c !== category);
    }
    
    onFilterChange({
      ...filters,
      categories: updatedCategories.length > 0 ? updatedCategories : undefined
    });
  };
  
  // Format filter
  const handleFormatChange = (format: CourseFormat) => {
    onFilterChange({
      ...filters,
      format
    });
  };
  
  // Level filter
  const handleLevelChange = (level: CourseLevel) => {
    onFilterChange({
      ...filters,
      level
    });
  };
  
  // Access level filter
  const handleAccessChange = (access: CourseAccess, checked: boolean) => {
    let updatedAccess: CourseAccess[] = [...(filters.access || [])];
    
    if (checked) {
      updatedAccess.push(access);
    } else {
      updatedAccess = updatedAccess.filter(a => a !== access);
    }
    
    onFilterChange({
      ...filters,
      access: updatedAccess.length > 0 ? updatedAccess : undefined
    });
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    onFilterChange({});
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="category-ai"
              checked={filters.categories?.includes('AI')}
              onCheckedChange={(checked) => handleCategoryChange('AI', checked as boolean)}
            />
            <Label htmlFor="category-ai">AI</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="category-business"
              checked={filters.categories?.includes('Business')}
              onCheckedChange={(checked) => handleCategoryChange('Business', checked as boolean)}
            />
            <Label htmlFor="category-business">Business</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="category-sovereignty"
              checked={filters.categories?.includes('Sovereignty')}
              onCheckedChange={(checked) => handleCategoryChange('Sovereignty', checked as boolean)}
            />
            <Label htmlFor="category-sovereignty">Sovereignty</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="category-marketing"
              checked={filters.categories?.includes('Marketing')}
              onCheckedChange={(checked) => handleCategoryChange('Marketing', checked as boolean)}
            />
            <Label htmlFor="category-marketing">Marketing</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="category-technology"
              checked={filters.categories?.includes('Technology')}
              onCheckedChange={(checked) => handleCategoryChange('Technology', checked as boolean)}
            />
            <Label htmlFor="category-technology">Technology</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="category-personal-growth"
              checked={filters.categories?.includes('Personal Growth')}
              onCheckedChange={(checked) => handleCategoryChange('Personal Growth', checked as boolean)}
            />
            <Label htmlFor="category-personal-growth">Personal Growth</Label>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-3">Format</h3>
        <RadioGroup 
          value={filters.format || 'all'} 
          onValueChange={(value) => {
            if (value === 'all') {
              const { format, ...rest } = filters;
              onFilterChange(rest);
            } else {
              handleFormatChange(value as CourseFormat);
            }
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="format-all" />
            <Label htmlFor="format-all">All Formats</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="format-video" />
            <Label htmlFor="format-video">Single Video</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="series" id="format-series" />
            <Label htmlFor="format-series">Multi-Part Series</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-3">Level</h3>
        <RadioGroup 
          value={filters.level || 'all'} 
          onValueChange={(value) => {
            if (value === 'all') {
              const { level, ...rest } = filters;
              onFilterChange(rest);
            } else {
              handleLevelChange(value as CourseLevel);
            }
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="level-all" />
            <Label htmlFor="level-all">All Levels</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Beginner" id="level-beginner" />
            <Label htmlFor="level-beginner">Beginner</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Intermediate" id="level-intermediate" />
            <Label htmlFor="level-intermediate">Intermediate</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Advanced" id="level-advanced" />
            <Label htmlFor="level-advanced">Advanced</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-3">Access</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="access-free"
              checked={filters.access?.includes('free')}
              onCheckedChange={(checked) => handleAccessChange('free', checked as boolean)}
            />
            <Label htmlFor="access-free">Free</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="access-premium"
              checked={filters.access?.includes('premium')}
              onCheckedChange={(checked) => handleAccessChange('premium', checked as boolean)}
            />
            <Label htmlFor="access-premium">Premium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="access-vip"
              checked={filters.access?.includes('vip')}
              onCheckedChange={(checked) => handleAccessChange('vip', checked as boolean)}
            />
            <Label htmlFor="access-vip">VIP</Label>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleResetFilters}
      >
        Reset Filters
      </Button>
    </div>
  );
}

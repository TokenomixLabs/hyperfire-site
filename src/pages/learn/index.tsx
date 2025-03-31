
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Course, CourseFilters, CourseSortOption, CourseCategory } from '@/types/courses';
import { useCourses } from '@/hooks/useCourses';
import CourseCard from '@/components/learn/CourseCard';
import CourseListItem from '@/components/learn/CourseListItem';
import CourseFiltersSidebar from '@/components/learn/CourseFiltersSidebar';
import Loading from '@/components/Loading';

const sortOptions: CourseSortOption[] = [
  { label: 'Newest', value: 'newest', direction: 'desc' },
  { label: 'Most Popular', value: 'popular', direction: 'desc' },
  { label: 'Title (A-Z)', value: 'title', direction: 'asc' },
  { label: 'Duration (Shortest)', value: 'duration', direction: 'asc' },
  { label: 'Duration (Longest)', value: 'duration', direction: 'desc' },
];

const categories: CourseCategory[] = [
  'AI', 'Business', 'Sovereignty', 'Marketing', 'Technology', 'Personal Growth'
];

export default function Learn() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<CourseFilters>({});
  const [sortOption, setSortOption] = useState<CourseSortOption>(sortOptions[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<CourseCategory[]>([]);
  
  const { courses, isLoading, error } = useCourses(filters, sortOption);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery });
  };

  const toggleCategory = (category: CourseCategory) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    setFilters({ ...filters, categories: newCategories.length > 0 ? newCategories : undefined });
  };

  const handleCourseClick = (course: Course) => {
    navigate(`/learn/${course.slug}`);
  };

  return (
    <AnimatedTransition className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">SignalFire Education Hub</h1>
          <p className="text-muted-foreground">
            Discover courses and trainings to accelerate your growth and sovereignty
          </p>
        </div>

        <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6">
          {/* Filters Sidebar - hidden on mobile, shown on larger screens */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <CourseFiltersSidebar 
              filters={filters} 
              onFilterChange={(newFilters) => setFilters(newFilters)} 
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and View Controls */}
            <div className="flex flex-col space-y-4 mb-6">
              <form onSubmit={handleSearch} className="flex w-full space-x-2">
                <Input 
                  placeholder="Search courses..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Search</Button>
              </form>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
                  {categories.map((category) => (
                    <Badge 
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select
                    value={sortOption.value}
                    onValueChange={(value) => {
                      const newOption = sortOptions.find(opt => opt.value === value);
                      if (newOption) setSortOption(newOption);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={`${option.value}-${option.direction}`} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Courses Display */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loading />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive">
                <p>Error loading courses. Please try again later.</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No courses found matching your criteria.</p>
              </div>
            ) : (
              <Tabs defaultValue={viewMode} value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
                <TabsList className="hidden">
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="grid" className="m-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        onClick={() => handleCourseClick(course)} 
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="list" className="m-0">
                  <div className="flex flex-col space-y-4">
                    {courses.map((course) => (
                      <CourseListItem 
                        key={course.id} 
                        course={course} 
                        onClick={() => handleCourseClick(course)} 
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
}

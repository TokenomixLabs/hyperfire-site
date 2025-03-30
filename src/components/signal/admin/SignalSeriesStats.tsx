
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignalSeriesWithStats } from '@/types/signal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface SignalSeriesStatsProps {
  series: SignalSeriesWithStats[];
}

// Define a color palette for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#FF8042'];

const SignalSeriesStats: React.FC<SignalSeriesStatsProps> = ({ series }) => {
  const [timeRange, setTimeRange] = useState('all-time');
  const [sortField, setSortField] = useState('views');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Sort the series data
  const sortedSeries = [...series].sort((a, b) => {
    const valueA = a.stats[sortField as keyof typeof a.stats];
    const valueB = b.stats[sortField as keyof typeof b.stats];
    return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
  });

  // Calculate summary stats
  const totalViews = series.reduce((sum, item) => sum + item.stats.views, 0);
  const totalClicks = series.reduce((sum, item) => sum + item.stats.ctaClicks, 0);
  const totalConversions = series.reduce((sum, item) => sum + item.stats.conversions, 0);
  const totalShares = series.reduce((sum, item) => sum + item.stats.shares, 0);
  
  // Calculate average conversion rate
  const avgConversionRate = totalClicks > 0 
    ? ((totalConversions / totalClicks) * 100).toFixed(2) 
    : '0.00';

  // Prepare data for pie chart
  const pieData = series.map(item => ({
    name: item.name,
    value: item.stats[sortField as keyof typeof item.stats],
  }));

  // Prepare data for bar chart comparison
  const barData = series.map(item => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
    views: item.stats.views,
    clicks: item.stats.ctaClicks,
    conversions: item.stats.conversions,
    shares: item.stats.shares,
  }));

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportData = () => {
    // In a real app, this would generate a CSV or Excel file
    console.log('Exporting data...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Performance Analytics</h2>
        <div className="flex space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="last-30">Last 30 Days</SelectItem>
              <SelectItem value="last-90">Last 90 Days</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CTA Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Series Performance</CardTitle>
              <CardDescription>
                Compare the performance of all your Signal Series
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Series Name</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort('views')}>
                      <div className="flex items-center">
                        Views
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort('ctaClicks')}>
                      <div className="flex items-center">
                        CTA Clicks
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort('conversions')}>
                      <div className="flex items-center">
                        Conversions
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Conv. Rate</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort('shares')}>
                      <div className="flex items-center">
                        Shares
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSeries.map((item) => {
                    const convRate = item.stats.ctaClicks > 0 
                      ? ((item.stats.conversions / item.stats.ctaClicks) * 100).toFixed(2) 
                      : '0.00';
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.stats.views.toLocaleString()}</TableCell>
                        <TableCell>{item.stats.ctaClicks.toLocaleString()}</TableCell>
                        <TableCell>{item.stats.conversions.toLocaleString()}</TableCell>
                        <TableCell>{convRate}%</TableCell>
                        <TableCell>{item.stats.shares.toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="charts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Series Comparison</CardTitle>
                <CardDescription>View performance metrics side by side</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#8884d8" name="Views" />
                    <Bar dataKey="clicks" fill="#82ca9d" name="CTA Clicks" />
                    <Bar dataKey="conversions" fill="#ffc658" name="Conversions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{`${sortField.charAt(0).toUpperCase() + sortField.slice(1)} Distribution`}</CardTitle>
                <CardDescription>Relative performance of each series</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value.toLocaleString()} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SignalSeriesStats;

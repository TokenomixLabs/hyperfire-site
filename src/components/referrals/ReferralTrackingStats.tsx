
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, ArrowUpDown } from 'lucide-react';

// Mock data for CTA tracking
const mockCTAStats = [
  { id: '1', campaignId: 'insiderdao', contentTitle: 'Crypto Market Analysis', clicks: 156, signups: 23, revenue: 2760 },
  { id: '2', campaignId: 'societi', contentTitle: 'Social Trading Guide', clicks: 132, signups: 18, revenue: 1440 },
  { id: '3', campaignId: 'aifc', contentTitle: 'AI Development Tutorial', clicks: 98, signups: 12, revenue: 960 },
  { id: '4', campaignId: 'insiderlife', contentTitle: 'NFT Investment Strategies', clicks: 86, signups: 11, revenue: 880 },
  { id: '5', campaignId: 'insiderdao', contentTitle: 'DeFi Yield Farming', clicks: 74, signups: 9, revenue: 1080 },
  { id: '6', campaignId: 'societi', contentTitle: 'Community Growth Tactics', clicks: 68, signups: 8, revenue: 640 },
  { id: '7', campaignId: 'aifc', contentTitle: 'LLM Fine-Tuning Guide', clicks: 62, signups: 6, revenue: 480 },
  { id: '8', campaignId: 'insiderlife', contentTitle: 'Market Sentiment Analysis', clicks: 58, signups: 7, revenue: 560 },
];

// Data for Platform breakdown
const platformData = [
  { name: 'InsiderDAO', value: 32, color: '#9b87f5' },
  { name: 'Societi', value: 26, color: '#48bb78' },
  { name: 'AI Freedom', value: 18, color: '#f97316' },
  { name: 'InsiderLife', value: 24, color: '#0ea5e9' },
];

// Data for Content performance
const contentPerformanceData = [
  { name: 'Crypto Market Analysis', clicks: 156, signups: 23 },
  { name: 'Social Trading Guide', clicks: 132, signups: 18 },
  { name: 'AI Development Tutorial', clicks: 98, signups: 12 },
  { name: 'NFT Investment Strategies', clicks: 86, signups: 11 },
  { name: 'DeFi Yield Farming', clicks: 74, signups: 9 }
];

const ReferralTrackingStats: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('30days');
  const [sortBy, setSortBy] = useState<string>('clicks');
  
  const getFilteredData = () => {
    // In a real app, you would filter based on the dateRange
    // For this mock, we'll just return the data as is
    return mockCTAStats;
  };

  const getSortedData = () => {
    const data = getFilteredData();
    return [...data].sort((a, b) => {
      if (sortBy === 'revenue') return b.revenue - a.revenue;
      if (sortBy === 'signups') return b.signups - a.signups;
      return b.clicks - a.clicks; // default sort by clicks
    });
  };

  const exportData = () => {
    // In a real app, this would generate a CSV or Excel file
    console.log('Exporting data:', getSortedData());
    
    // For demonstration purposes, let's show a toast or alert
    alert('Data exported successfully!');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <TabsList className="mb-4 sm:mb-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Performance</TabsTrigger>
            <TabsTrigger value="platforms">Platform Breakdown</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
                <SelectItem value="alltime">All time</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={exportData} className="flex items-center gap-1">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>
      
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">734</div>
                <p className="text-xs text-muted-foreground mt-1">+12.5% from last period</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Signups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">94</div>
                <p className="text-xs text-muted-foreground mt-1">+8.2% from last period</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Estimated Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$8,800</div>
                <p className="text-xs text-muted-foreground mt-1">+15.3% from last period</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>CTA clicks and conversions over time</CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={contentPerformanceData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="clicks" fill="#9b87f5" name="Clicks" />
                    <Bar dataKey="signups" fill="#48bb78" name="Signups" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Content Performance</CardTitle>
                  <CardDescription>Which content is generating the most engagement</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => {
                  if (sortBy === 'clicks') setSortBy('signups');
                  else if (sortBy === 'signups') setSortBy('revenue');
                  else setSortBy('clicks');
                }}>
                  Sort by {sortBy === 'clicks' ? 'Clicks' : sortBy === 'signups' ? 'Signups' : 'Revenue'}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getSortedData().map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{item.contentTitle}</h4>
                        <p className="text-sm text-muted-foreground mt-1">Campaign: {item.campaignId}</p>
                      </div>
                      <div className="flex space-x-6 text-right">
                        <div>
                          <div className="text-xl font-bold">{item.clicks}</div>
                          <p className="text-xs text-muted-foreground">Clicks</p>
                        </div>
                        <div>
                          <div className="text-xl font-bold">{item.signups}</div>
                          <p className="text-xs text-muted-foreground">Signups</p>
                        </div>
                        <div>
                          <div className="text-xl font-bold">${item.revenue}</div>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="platforms" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Breakdown by referral platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>Conversion rates by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="font-medium">InsiderDAO</div>
                      <div>14.3% conversion</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '14.3%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="font-medium">Societi</div>
                      <div>13.2% conversion</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '13.2%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="font-medium">AI Freedom Code</div>
                      <div>11.8% conversion</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '11.8%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="font-medium">InsiderLife</div>
                      <div>12.5% conversion</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '12.5%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReferralTrackingStats;

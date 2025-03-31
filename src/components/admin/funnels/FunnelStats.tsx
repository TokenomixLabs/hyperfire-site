
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Funnel } from '@/types/funnel';

interface FunnelStatsProps {
  funnel: Funnel;
}

export default function FunnelStats({ funnel }: FunnelStatsProps) {
  const stats = funnel.stats;
  
  if (!stats) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6 h-64">
          <p className="text-muted-foreground">No stats available for this funnel yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Convert step stats to format for charts
  const stepData = stats.stepStats.map((step, index) => ({
    name: `Step ${index + 1}`,
    visits: step.visits,
    clicks: step.ctaClicks,
    dropOff: step.dropOff,
  }));
  
  // Conversion data for pie chart
  const conversionData = [
    { name: 'Converted', value: stats.conversions },
    { name: 'Not Converted', value: stats.visits - stats.conversions },
  ];
  
  const COLORS = ['#9b87f5', '#d6d6d6'];
  
  // Simulate time-series data for last 14 days
  const getDaysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const timeSeriesData = Array.from({ length: 14 }, (_, i) => ({
    date: getDaysAgo(13 - i),
    visits: Math.floor(Math.random() * 100) + 10,
    conversions: Math.floor(Math.random() * 30),
  }));
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visits.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTA Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ctaClicks.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversions.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Funnel Step Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stepData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#9b87f5" name="Visits" />
                  <Bar dataKey="clicks" fill="#7E69AB" name="CTA Clicks" />
                  <Bar dataKey="dropOff" fill="#D6BCFA" name="Drop Off" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conversion Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conversionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Conversion rate: {((stats.conversions / stats.visits) * 100).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Traffic over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeSeriesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#9b87f5" activeDot={{ r: 8 }} name="Visits" />
                <Line type="monotone" dataKey="conversions" stroke="#F97316" name="Conversions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step</TableHead>
                <TableHead>Visitors</TableHead>
                <TableHead>CTA Clicks</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Drop-off</TableHead>
                <TableHead>Drop-off Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.stepStats.map((step, index) => (
                <TableRow key={step.stepId}>
                  <TableCell className="font-medium">Step {index + 1}</TableCell>
                  <TableCell>{step.visits}</TableCell>
                  <TableCell>{step.ctaClicks}</TableCell>
                  <TableCell>{((step.ctaClicks / step.visits) * 100).toFixed(1)}%</TableCell>
                  <TableCell>{step.dropOff}</TableCell>
                  <TableCell>{((step.dropOff / step.visits) * 100).toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

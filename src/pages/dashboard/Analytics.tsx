import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from 'lucide-react'; // Example icons

const Analytics: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Overview</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bookings Trend</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Services</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Beauty Services</div>
            <p className="text-xs text-muted-foreground">Most popular category</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detailed Reports</CardTitle>
          <CardDescription>Coming soon: In-depth analytics and customizable reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">We are working on providing more detailed insights into your service performance and customer engagement.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

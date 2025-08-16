import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueTrend } from "@/types";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface RevenueChartProps {
  data: RevenueTrend[];
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  const chartData = data.map(item => ({
    ...item,
    month: new Date(item.month).toLocaleString('default', { month: 'short' }),
    total_amount: parseFloat(item.total_amount),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Ksh ${value}`} />
            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="total_amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
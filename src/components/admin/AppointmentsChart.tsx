import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentStatusBreakdown } from "@/types";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from "recharts";

interface AppointmentsChartProps {
  data: AppointmentStatusBreakdown[];
}

const COLORS: { [key: string]: string } = {
  completed: '#22c55e', // green-500
  confirmed: '#3b82f6', // blue-500
  pending: '#f97316',   // orange-500
  cancelled: '#ef4444', // red-500
};

const AppointmentsChart = ({ data }: AppointmentsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
            <Legend />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
              nameKey="status"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#8884d8'} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AppointmentsChart;
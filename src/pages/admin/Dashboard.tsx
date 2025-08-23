import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminDashboardData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Calendar, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import RevenueChart from "@/components/admin/RevenueChart";
import AppointmentsChart from "@/components/admin/AppointmentsChart";
import { motion } from "framer-motion";
import StatCard from "@/components/dashboard/StatCard"; // Changed to default import

const fetchAdminDashboardData = async () => {
  const { data } = await api.get('/admin/dashboard');
  return data as AdminDashboardData;
};

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: fetchAdminDashboardData,
  });

  const stats = data?.stats;
  const charts = data?.charts;

  const statCards = [
    { icon: DollarSign, title: "Total Revenue", value: `Ksh ${parseFloat(stats?.total_revenue || '0').toLocaleString()}`, subtext: "All-time revenue" },
    { icon: Users, title: "Total Users", value: stats?.total_users || 0, subtext: `${stats?.total_customers} Customers, ${stats?.total_sellers} Sellers` },
    { icon: Briefcase, title: "Active Services", value: stats?.active_services || 0, subtext: `out of ${stats?.total_services} total services` },
    { icon: Calendar, title: "Pending Bookings", value: stats?.pending_appointments || 0, subtext: "Action required" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-4xl font-bold tracking-tighter">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
            <StatCard 
              title={card.title}
              value={card.value}
              icon={card.icon}
              description={card.subtext}
              isLoading={isLoading}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="md:col-span-3">
          {isLoading || !charts ? (
            <Card className="h-[400px]"><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-full w-full" /></CardContent></Card>
          ) : (
            <RevenueChart data={charts.revenue_trend_last_6_months} />
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="md:col-span-2">
          {isLoading || !charts ? (
            <Card className="h-[400px]"><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-full w-full" /></CardContent></Card>
          ) : (
            <AppointmentsChart data={charts.appointment_status_breakdown} />
          )}
        </motion.div>
      </div>
      
      {/* Additional placeholder sections for future enhancements */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <Card className="bg-muted/40 border-border/40">
            <CardHeader><CardTitle className="flex items-center"><TrendingUp className="mr-2"/>Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Live activity feed coming soon...</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
          <Card className="bg-muted/40 border-border/40">
            <CardHeader><CardTitle className="flex items-center"><AlertCircle className="mr-2"/>System Status</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">System health monitoring coming soon...</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

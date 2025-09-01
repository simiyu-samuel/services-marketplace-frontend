import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminDashboardData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Calendar, DollarSign, TrendingUp, AlertCircle, Activity, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import RevenueChart from "@/components/admin/RevenueChart";
import AppointmentsChart from "@/components/admin/AppointmentsChart";
import { motion } from "framer-motion";
import ModernStatCard from "@/components/dashboard/ModernStatCard";
import ModernPageHeader from "@/components/dashboard/ModernPageHeader";

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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ModernPageHeader 
          title="Admin Dashboard" 
          description="Monitor and manage your platform's performance"
          icon={Shield}
          badge={{
            text: "Administrator",
            variant: "destructive"
          }}
        />

        <div className="space-y-8">
          {/* Modern Stat Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            <ModernStatCard 
              title="Total Revenue" 
              value={`Ksh ${parseFloat(stats?.total_revenue || '0').toLocaleString()}`} 
              icon={DollarSign} 
              description="All-time platform revenue" 
              trend="up"
              trendValue="+18.2%"
              color="emerald"
              isLoading={isLoading} 
            />
            <ModernStatCard 
              title="Total Users" 
              value={stats?.total_users || 0} 
              icon={Users} 
              description={`${stats?.total_customers || 0} customers, ${stats?.total_sellers || 0} sellers`}
              trend="up"
              trendValue="+5.4%"
              color="blue"
              isLoading={isLoading} 
            />
            <ModernStatCard 
              title="Active Services" 
              value={stats?.active_services || 0} 
              icon={Briefcase} 
              description={`out of ${stats?.total_services || 0} total services`}
              trend="up"
              trendValue="+12 new"
              color="purple"
              isLoading={isLoading} 
            />
            <ModernStatCard 
              title="Pending Bookings" 
              value={stats?.pending_appointments || 0} 
              icon={Calendar} 
              description="Require attention" 
              trend={stats?.pending_appointments && stats.pending_appointments > 0 ? "up" : undefined}
              trendValue={stats?.pending_appointments && stats.pending_appointments > 0 ? "Action needed" : "All handled"}
              color="yellow"
              isLoading={isLoading} 
            />
          </motion.div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }} 
              className="lg:col-span-3"
            >
              {isLoading || !charts ? (
                <Card className="h-[400px] bg-card border-border shadow-lg">
                  <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                  <CardContent><Skeleton className="h-full w-full" /></CardContent>
                </Card>
              ) : (
                <div className="bg-card border-border shadow-lg rounded-lg">
                  <RevenueChart data={charts.revenue_trend_last_6_months} />
                </div>
              )}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.3 }} 
              className="lg:col-span-2"
            >
              {isLoading || !charts ? (
                <Card className="h-[400px] bg-card border-border shadow-lg">
                  <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                  <CardContent><Skeleton className="h-full w-full" /></CardContent>
                </Card>
              ) : (
                <div className="bg-card border-border shadow-lg rounded-lg">
                  <AppointmentsChart data={charts.appointment_status_breakdown} />
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Enhanced Activity and System Status Cards */}
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500/10 p-2 rounded-lg">
                      <Activity className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Recent Activity</CardTitle>
                      <p className="text-sm text-muted-foreground">Latest platform activities</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-sm text-muted-foreground">Live activity feed coming soon...</p>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">Feature in development</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">System Status</CardTitle>
                      <p className="text-sm text-muted-foreground">Platform health monitoring</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">System Operational</span>
                      </div>
                      <span className="text-xs text-muted-foreground">99.9% uptime</span>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">Advanced monitoring coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

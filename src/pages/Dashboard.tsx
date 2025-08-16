import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Briefcase, Star, DollarSign, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { SellerDashboardStats, CustomerDashboardStats, PaginatedResponse, Booking } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fetchDashboardStats = async () => {
  const { data } = await api.get('/dashboard');
  return data.data;
};

const fetchRecentBookings = async () => {
  const { data } = await api.get('/appointments', { params: { per_page: 5, sort: '-created_at' } });
  return data as PaginatedResponse<Booking>;
};

const StatCard = ({ title, value, icon: Icon, description, isLoading }: { title: string, value: string | number, icon: React.ElementType, description: string, isLoading: boolean }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{value}</div>}
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const CustomerDashboard = ({ stats, isLoading }: { stats?: CustomerDashboardStats, isLoading: boolean }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Your Activity</h2>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Upcoming Bookings" value={stats?.upcoming_bookings_count ?? 0} icon={Calendar} description="View your upcoming appointments" isLoading={isLoading} />
      <StatCard title="Reviews to Write" value={stats?.reviews_to_write_count ?? 0} icon={Star} description="Share your experience" isLoading={isLoading} />
      <StatCard title="Completed Bookings" value={stats?.completed_bookings_count ?? 0} icon={CheckCircle} description="Total appointments completed" isLoading={isLoading} />
      <StatCard title="Total Spent" value={`Ksh ${parseFloat(stats?.total_spent ?? '0').toLocaleString()}`} icon={DollarSign} description="Your lifetime spending" isLoading={isLoading} />
    </div>
  </div>
);

const SellerDashboard = ({ stats, isLoading }: { stats?: SellerDashboardStats, isLoading: boolean }) => {
  const { data: bookingsResponse, isLoading: bookingsLoading } = useQuery({
    queryKey: ['recentBookings'],
    queryFn: fetchRecentBookings,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Business</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active Services" value={stats?.active_services_count ?? 0} icon={Briefcase} description="Manage your service listings" isLoading={isLoading} />
          <StatCard title="Pending Bookings" value={stats?.pending_bookings_count ?? 0} icon={Calendar} description="Respond to new clients" isLoading={isLoading} />
          <StatCard title="Completed Bookings" value={stats?.completed_bookings_count ?? 0} icon={CheckCircle} description="Total appointments fulfilled" isLoading={isLoading} />
          <StatCard title="Total Revenue" value={`Ksh ${parseFloat(stats?.total_earnings ?? '0').toLocaleString()}`} icon={DollarSign} description="Your all-time earnings" isLoading={isLoading} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Your 5 most recent appointment requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
          ) : bookingsResponse && bookingsResponse.data.length > 0 ? (
            <div className="space-y-4">
              {bookingsResponse.data.map((booking) => (
                <div key={booking.id} className="flex items-center">
                  <Avatar className="h-9 w-9"><AvatarImage src={booking.customer.profile_image || undefined} /><AvatarFallback>{booking.customer.name.charAt(0)}</AvatarFallback></Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{booking.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{booking.service.title}</p>
                  </div>
                  <div className="ml-auto font-medium">{new Date(booking.appointment_date).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">No recent bookings found.</p>
          )}
        </CardContent>
        <div className="border-t p-4">
          <Button size="sm" variant="outline" className="w-full" asChild>
            <Link to="/dashboard/bookings">View All Bookings</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

const Dashboard = () => {
    const { user } = useAuth();
    const { data: stats, isLoading, isError } = useQuery({
        queryKey: ['dashboardStats', user?.id],
        queryFn: fetchDashboardStats,
        enabled: !!user,
    });

    if (!user) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return (
            <div>
                <h1 className="text-3xl font-bold mb-6">Welcome back, {user.name}!</h1>
                <Card className="border-destructive">
                    <CardHeader><CardTitle>Error</CardTitle></CardHeader>
                    <CardContent><p>Could not load your dashboard statistics. Please try again later.</p></CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Welcome back, {user.name}!</h1>
            {user.user_type === 'seller' 
                ? <SellerDashboard stats={stats} isLoading={isLoading} /> 
                : <CustomerDashboard stats={stats} isLoading={isLoading} />}
        </div>
    );
};

export default Dashboard;
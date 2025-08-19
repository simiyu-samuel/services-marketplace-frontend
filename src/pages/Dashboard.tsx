import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar, Briefcase, Star, DollarSign, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { SellerDashboardStats, CustomerDashboardStats, PaginatedResponse, Booking, User } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fetchDashboardStats = async (userType: 'customer' | 'seller') => {
  const endpoint = userType === 'seller' ? '/seller/dashboard/insights' : '/customer/dashboard/insights';
  const { data } = await api.get(endpoint);
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

const CustomerDashboard = ({ stats, isLoading }: { stats?: CustomerDashboardStats, isLoading: boolean }) => {
  const recentAppointments = stats?.recent_appointments || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Activity</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Upcoming Bookings" value={stats?.upcoming_appointments_count ?? 0} icon={Calendar} description="View your upcoming appointments" isLoading={isLoading} />
          <StatCard title="Completed Bookings" value={stats?.completed_appointments_count ?? 0} icon={CheckCircle} description="Total appointments completed" isLoading={isLoading} />
          <StatCard title="Total Bookings" value={stats?.total_appointments_count ?? 0} icon={Briefcase} description="All your appointments" isLoading={isLoading} />
          <StatCard title="Total Spent" value={`Ksh ${parseFloat(stats?.total_amount_spent?.toString() ?? '0').toLocaleString()}`} icon={DollarSign} description="Your lifetime spending" isLoading={isLoading} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>Here are your most recent appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
          ) : recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map((booking) => (
                <div key={booking.id} className="flex items-center">
                  <Avatar className="h-9 w-9"><AvatarImage src={booking.seller.profile_image || undefined} /><AvatarFallback>{booking.seller.name.charAt(0)}</AvatarFallback></Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{booking.service.title}</p>
                    <p className="text-sm text-muted-foreground">with {booking.seller.name}</p>
                  </div>
                  <div className="ml-auto font-medium">{new Date(booking.appointment_date).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">You have no recent appointments.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline" className="w-full" asChild>
            <Link to="/dashboard/bookings">View All Bookings</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const SellerDashboard = ({ user, stats, isLoading }: { user: User, stats?: SellerDashboardStats, isLoading: boolean }) => {
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
<StatCard title="Total Revenue" value={`Ksh ${parseFloat((stats?.all_time_earnings ?? 0).toString()).toLocaleString()}`} icon={DollarSign} description="Your all-time earnings" isLoading={isLoading} />
        </div>
      </div>

      {/* Package Overview Section */}
      <Card className={`mb-6 ${
        (() => {
          if (!user.seller_package || !user.package_expiry_date) return 'border-gray-400';
          const expiryDate = new Date(user.package_expiry_date);
          const today = new Date();
          const timeDiff = expiryDate.getTime() - today.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

          if (daysDiff < 0) return 'border-red-500 bg-red-50'; // Expired
          if (daysDiff <= 7) return 'border-yellow-500 bg-yellow-50'; // Expiring Soon
          return 'border-green-500 bg-green-50'; // Active
        })()
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{user.seller_package ? `${user.seller_package.charAt(0).toUpperCase() + user.seller_package.slice(1)} Package` : 'No Active Package'}</span>
            {(() => {
              if (!user.seller_package || !user.package_expiry_date) return null;
              const expiryDate = new Date(user.package_expiry_date);
              const today = new Date();
              const timeDiff = expiryDate.getTime() - today.getTime();
              const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

              if (daysDiff < 0) return <span className="text-sm font-bold text-red-600">Expired! Please renew.</span>;
              if (daysDiff <= 7) return <span className="text-sm font-bold text-yellow-600 animate-pulse">Expiring Soon!</span>;
              return <span className="text-sm font-normal text-green-600">Active</span>;
            })()}
          </CardTitle>
          {user.package_expiry_date && user.seller_package && (
            <CardDescription>
              Expires on: {new Date(user.package_expiry_date).toLocaleDateString()}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {user.seller_package ? (
            <p>You have <span className="font-bold">{stats?.active_services_count ?? 0}</span> active services.</p>
          ) : (
            <p>You need an active package to start selling. Choose a plan to get started!</p>
          )}
        </CardContent>
        <CardFooter>
          <Button size="sm" className="w-full" asChild>
            <Link to="/dashboard/seller/package-upgrade">
              {user.seller_package ? 'Upgrade / Renew Package' : 'Choose a Package'}
            </Link>
          </Button>
        </CardFooter>
      </Card>

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
        queryFn: () => fetchDashboardStats(user!.user_type as 'customer' | 'seller'),
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

            {user.user_type === 'customer' && user.pending_seller_package && (
                <Card className="mb-6 border-yellow-500 bg-yellow-50/50">
                    <CardHeader>
                        <CardTitle className="text-yellow-800">Action Required: Complete Seller Registration</CardTitle>
                        <CardDescription className="text-yellow-700">
                            You registered as a seller, but your payment for the <span className="font-semibold capitalize">{user.pending_seller_package}</span> package is pending.
                            Please complete the payment to activate your seller account and access all features.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild>
                            <Link to="/seller-onboarding/payment">Complete Payment Now</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {user.user_type === 'seller'
                ? <SellerDashboard user={user} stats={stats} isLoading={isLoading} />
                : <CustomerDashboard stats={stats} isLoading={isLoading} />}
        </div>
    );
};

export default Dashboard;

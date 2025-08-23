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
import StatCard from "@/components/dashboard/StatCard"; // Changed to default import

const fetchDashboardStats = async (userType: 'customer' | 'seller') => {
  const endpoint = userType === 'seller' ? '/seller/dashboard/insights' : '/customer/dashboard/insights';
  const { data } = await api.get(endpoint);
  return data.data;
};

const fetchRecentBookings = async () => {
  const { data } = await api.get('/appointments', { params: { per_page: 5, sort: '-created_at' } });
  return data as PaginatedResponse<Booking>;
};

const CustomerDashboard = ({ stats, isLoading }: { stats?: CustomerDashboardStats, isLoading: boolean }) => {
  const recentAppointments = stats?.recent_appointments || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Your Activity</h2> {/* Added text-foreground */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"> {/* Enhanced responsiveness */}
          <StatCard title="Upcoming Bookings" value={stats?.upcoming_appointments_count ?? 0} icon={Calendar} description="View your upcoming appointments" isLoading={isLoading} />
          <StatCard title="Completed Bookings" value={stats?.completed_appointments_count ?? 0} icon={CheckCircle} description="Total appointments completed" isLoading={isLoading} />
          <StatCard title="Total Bookings" value={stats?.total_appointments_count ?? 0} icon={Briefcase} description="All your appointments" isLoading={isLoading} />
          <StatCard title="Total Spent" value={`Ksh ${parseFloat(stats?.total_amount_spent?.toString() ?? '0').toLocaleString()}`} icon={DollarSign} description="Your lifetime spending" isLoading={isLoading} />
        </div>
      </div>
      <Card className="bg-card border-border shadow-md"> {/* Enhanced card styling */}
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Appointments</CardTitle> {/* Enhanced title */}
          <CardDescription className="text-muted-foreground">Here are your most recent appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
          ) : recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map((booking) => (
                <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border-b border-border/50 last:border-b-0"> {/* Enhanced item styling and responsiveness */}
                  <div className="flex items-center mb-2 sm:mb-0 sm:w-1/2">
                    <Avatar className="h-10 w-10 border border-primary/20"><AvatarImage src={booking.seller.profile_image || undefined} /><AvatarFallback>{booking.seller.name.charAt(0)}</AvatarFallback></Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-base font-medium leading-none text-foreground">{booking.service.title}</p> {/* Enhanced text */}
                      <p className="text-sm text-muted-foreground">with {booking.seller.name}</p>
                    </div>
                  </div>
                  <div className="ml-auto text-sm font-medium text-muted-foreground sm:w-1/2 sm:text-right"> {/* Responsive alignment */}
                    {new Date(booking.appointment_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">You have no recent appointments.</p>
          )}
        </CardContent>
        <CardFooter className="border-t border-border/50 p-4"> {/* Enhanced footer styling */}
          <Button size="sm" variant="outline" className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-primary/30" asChild>
            <Link to="/dashboard/bookings">View All Bookings</Link>
          </Button> {/* Enhanced button styling */}
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
        <h2 className="text-2xl font-bold mb-4 text-foreground">Your Business</h2> {/* Added text-foreground */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"> {/* Enhanced responsiveness */}
          <StatCard title="Active Services" value={stats?.active_services_count ?? 0} icon={Briefcase} description="Manage your service listings" isLoading={isLoading} />
          <StatCard title="Pending Bookings" value={stats?.pending_bookings_count ?? 0} icon={Calendar} description="Respond to new clients" isLoading={isLoading} />
          <StatCard title="Completed Bookings" value={stats?.completed_bookings_count ?? 0} icon={CheckCircle} description="Total appointments fulfilled" isLoading={isLoading} />
          <StatCard title="Total Revenue" value={`Ksh ${parseFloat((stats?.all_time_earnings ?? 0).toString()).toLocaleString()}`} icon={DollarSign} description="Your all-time earnings" isLoading={isLoading} />
        </div>
      </div>

      {/* Package Overview Section */}
      <Card className={`mb-6 bg-card border-border shadow-md ${ /* Enhanced card styling */
        (() => {
          if (!user.seller_package || !user.package_expiry_date) return 'border-gray-400 dark:border-gray-600';
          const expiryDate = new Date(user.package_expiry_date);
          const today = new Date();
          const timeDiff = expiryDate.getTime() - today.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

          if (daysDiff < 0) return 'border-red-500 bg-red-50/50 dark:bg-red-900/20'; // Expired
          if (daysDiff <= 7) return 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20'; // Expiring Soon
          return 'border-green-500 bg-green-50/50 dark:bg-green-900/20'; // Active
        })()
      }`} /* Closing the template literal here */>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xl font-semibold"> {/* Enhanced title and responsiveness */}
            <span>{user.seller_package ? `${user.seller_package.charAt(0).toUpperCase() + user.seller_package.slice(1)} Package` : 'No Active Package'}</span>
            {(() => {
              if (!user.seller_package || !user.package_expiry_date) return null;
              const expiryDate = new Date(user.package_expiry_date);
              const today = new Date();
              const timeDiff = expiryDate.getTime() - today.getTime();
              const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

              if (daysDiff < 0) return <span className="text-sm font-bold text-red-600 dark:text-red-400 mt-2 sm:mt-0">Expired! Please renew.</span>;
              if (daysDiff <= 7) return <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400 animate-pulse mt-2 sm:mt-0">Expiring Soon!</span>;
              return <span className="text-sm font-normal text-green-600 dark:text-green-400 mt-2 sm:mt-0">Active</span>;
            })()}
          </CardTitle>
          {user.package_expiry_date && user.seller_package && (
            <CardDescription className="text-muted-foreground">
              Expires on: {new Date(user.package_expiry_date).toLocaleDateString()}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {user.seller_package ? (
            <p className="text-foreground">You have <span className="font-bold">{stats?.active_services_count ?? 0}</span> active services.</p>
          ) : (
            <p className="text-foreground">You need an active package to start selling. Choose a plan to get started!</p>
          )}
        </CardContent>
        <CardFooter className="border-t border-border/50 p-4"> {/* Enhanced footer styling */}
          <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link to="/dashboard/seller/package-upgrade">
              {user.seller_package ? 'Upgrade / Renew Package' : 'Choose a Package'}
            </Link>
          </Button> {/* Enhanced button styling */}
        </CardFooter>
      </Card>

      <Card className="bg-card border-border shadow-md"> {/* Enhanced card styling */}
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Bookings</CardTitle> {/* Enhanced title */}
          <CardDescription className="text-muted-foreground">Your 5 most recent appointment requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
          ) : bookingsResponse && bookingsResponse.data.length > 0 ? (
            <div className="space-y-4">
              {bookingsResponse.data.map((booking) => (
                <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border-b border-border/50 last:border-b-0"> {/* Enhanced item styling and responsiveness */}
                  <div className="flex items-center mb-2 sm:mb-0 sm:w-1/2">
                    <Avatar className="h-10 w-10 border border-primary/20"><AvatarImage src={booking.customer.profile_image || undefined} /><AvatarFallback>{booking.customer.name.charAt(0)}</AvatarFallback></Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-base font-medium leading-none text-foreground">{booking.customer.name}</p> {/* Enhanced text */}
                      <p className="text-sm text-muted-foreground">{booking.service.title}</p>
                    </div>
                  </div>
                  <div className="ml-auto text-sm font-medium text-muted-foreground sm:w-1/2 sm:text-right"> {/* Responsive alignment */}
                    {new Date(booking.appointment_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">No recent bookings found.</p>
          )}
        </CardContent>
        <div className="border-t border-border/50 p-4"> {/* Enhanced footer styling */}
          <Button size="sm" variant="outline" className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-primary/30" asChild>
            <Link to="/dashboard/bookings">View All Bookings</Link>
          </Button> {/* Enhanced button styling */}
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
        <div className="py-6 sm:py-8 lg:py-10"> {/* Added responsive padding */}
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text"> {/* Enhanced title */}
                Welcome back, {user.name}!
            </h1>

            {user.user_type === 'customer' && user.pending_seller_package && (
                <Card className="mb-6 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20 dark:border-yellow-700"> {/* Added dark mode styles */}
                    <CardHeader>
                        <CardTitle className="text-yellow-800 dark:text-yellow-300">Action Required: Complete Seller Registration</CardTitle> {/* Dark mode text */}
                        <CardDescription className="text-yellow-700 dark:text-yellow-400"> {/* Dark mode text */}
                            You registered as a seller, but your payment for the <span className="font-semibold capitalize">{user.pending_seller_package}</span> package is pending.
                            Please complete the payment to activate your seller account and access all features.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white" asChild> {/* Enhanced button style */}
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

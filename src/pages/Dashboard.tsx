import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar, Briefcase, Star, DollarSign, CheckCircle, TrendingUp, Users, ArrowUpRight, Clock, Plus, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { SellerDashboardStats, CustomerDashboardStats, PaginatedResponse, Booking, User } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import React, { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import ModernStatCard from "@/components/dashboard/ModernStatCard";
import { cn } from "@/lib/utils";

// Dynamically import StatCard for backward compatibility
const StatCard = lazy(() => import("@/components/dashboard/StatCard"));

const fetchDashboardStats = async (userType: 'customer' | 'seller') => {
  const endpoint = userType === 'seller' ? '/seller/dashboard/insights' : '/customer/dashboard/insights';
  const { data } = await api.get(endpoint);
  return data.data;
};

const fetchRecentBookings = async () => {
  const { data } = await api.get('/appointments', { params: { per_page: 5, sort: '-created_at' } });
  return data as PaginatedResponse<Booking>;
};

// CustomerDashboardComponent definition
const CustomerDashboardComponent = ({ stats, isLoading }: { stats?: CustomerDashboardStats, isLoading: boolean }) => {
  const recentAppointments = stats?.recent_appointments || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Your Activity</h2> {/* Added text-foreground */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ModernStatCard 
            title="Upcoming Bookings" 
            value={stats?.upcoming_appointments_count ?? 0} 
            icon={Calendar} 
            description="View your upcoming appointments" 
            trend="up"
            trendValue="+12%"
            color="blue"
            isLoading={isLoading} 
          />
          <ModernStatCard 
            title="Completed Bookings" 
            value={stats?.completed_appointments_count ?? 0} 
            icon={CheckCircle} 
            description="Total appointments completed" 
            trend="up"
            trendValue="+8%"
            color="green"
            isLoading={isLoading} 
          />
          <ModernStatCard 
            title="Total Bookings" 
            value={stats?.total_appointments_count ?? 0} 
            icon={Briefcase} 
            description="All your appointments" 
            color="purple"
            isLoading={isLoading} 
          />
          <ModernStatCard 
            title="Total Spent" 
            value={`Ksh ${parseFloat(stats?.total_amount_spent?.toString() ?? '0').toLocaleString()}`} 
            icon={DollarSign} 
            description="Your lifetime spending" 
            trend="up"
            trendValue="+5%"
            color="orange"
            isLoading={isLoading} 
          />
        </div>
      </div>

      {/* Quick Actions Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Link to="/dashboard/bookings" className="block p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">View Bookings</p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">Manage appointments</p>
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Link to="/services" className="block p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">Book Service</p>
                    <p className="text-sm text-green-600 dark:text-green-300">Find new services</p>
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Link to="/dashboard/profile" className="block p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-purple-900 dark:text-purple-100">Edit Profile</p>
                    <p className="text-sm text-purple-600 dark:text-purple-300">Update your info</p>
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Link to="/services/favorites" className="block p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-orange-900 dark:text-orange-100">Favorites</p>
                    <p className="text-sm text-orange-600 dark:text-orange-300">Saved services</p>
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>
        </div>
      </motion.div>

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

// SellerDashboardComponent definition
const SellerDashboardComponent = ({ user, stats, isLoading }: { user: User, stats?: SellerDashboardStats, isLoading: boolean }) => {
  const { data: bookingsResponse, isLoading: bookingsLoading } = useQuery({
    queryKey: ['recentBookings'],
    queryFn: fetchRecentBookings,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Your Business</h2> {/* Added text-foreground */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ModernStatCard 
            title="Active Services" 
            value={stats?.active_services_count ?? 0} 
            icon={Briefcase} 
            description="Manage your service listings" 
            trend="up"
            trendValue="+3 this week"
            color="blue"
            isLoading={isLoading} 
          />
          <ModernStatCard 
            title="Pending Bookings" 
            value={stats?.pending_bookings_count ?? 0} 
            icon={Clock} 
            description="Respond to new clients" 
            trend={stats?.pending_bookings_count && stats.pending_bookings_count > 0 ? "up" : undefined}
            trendValue={stats?.pending_bookings_count && stats.pending_bookings_count > 0 ? "Needs attention" : "All caught up"}
            color="yellow"
            isLoading={isLoading} 
          />
          <ModernStatCard 
            title="Completed Bookings" 
            value={stats?.completed_bookings_count ?? 0} 
            icon={CheckCircle} 
            description="Total appointments fulfilled" 
            trend="up"
            trendValue="+15%"
            color="green"
            isLoading={isLoading} 
          />
          <ModernStatCard 
            title="Total Revenue" 
            value={`Ksh ${parseFloat((stats?.all_time_earnings ?? 0).toString()).toLocaleString()}`} 
            icon={DollarSign} 
            description="Your all-time earnings" 
            trend="up"
            trendValue="+22%"
            color="emerald"
            isLoading={isLoading} 
          />
        </div>
      </div>

      {/* Quick Actions Section for Sellers */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Link to="/dashboard/seller/services/create" className="block p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">Add Service</p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">Create new listing</p>
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Link to="/dashboard/seller/services" className="block p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">View Services</p>
                    <p className="text-sm text-green-600 dark:text-green-300">Manage listings</p>
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Link to="/dashboard/bookings" className="block p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-purple-900 dark:text-purple-100">Bookings</p>
                    <p className="text-sm text-purple-600 dark:text-purple-300">Manage appointments</p>
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Link to="/dashboard/seller/analytics" className="block p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-orange-900 dark:text-orange-100">Analytics</p>
                    <p className="text-sm text-orange-600 dark:text-orange-300">View insights</p>
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>
        </div>
      </motion.div>

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
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading dashboard..." />
            </div>
        );
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
                ? <SellerDashboardComponent user={user} stats={stats} isLoading={isLoading} />
                : <CustomerDashboardComponent stats={stats} isLoading={isLoading} />}
        </div>
    );
};

export default Dashboard;

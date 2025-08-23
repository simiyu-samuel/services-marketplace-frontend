const CustomerDashboard = ({ stats, isLoading }: { stats?: CustomerDashboardStats, isLoading: boolean }) => {
  const recentAppointments = stats?.recent_appointments || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Activity</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Upcoming Bookings" value={stats?.upcoming_appointments_count ?? 0} icon={Calendar} description="View your upcoming appointments" isLoading={isLoading} />
          <StatCard title="Completed Bookings" value={stats?.completed_appointments_count ?? 0} icon={CheckCircle} description="Total appointments completed" isLoading={isLoading} />
          <StatCard title="Total Bookings" value={stats?.total_appointments_count ?? 0} icon={Briefcase} description="All your appointments" isLoading={isLoading} />
          <StatCard title="Total Spent" value={`Ksh ${parseFloat(stats?.total_amount_spent?.toString() ?? '0').toLocaleString()}`} icon={DollarSign} description="Your lifetime spending" isLoading={isLoading} />
        </div>
      </div>
      {/* ... existing code ... */}
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active Services" value={stats?.active_services_count ?? 0} icon={Briefcase} description="Manage your service listings" isLoading={isLoading} />
          <StatCard title="Pending Bookings" value={stats?.pending_bookings_count ?? 0} icon={Calendar} description="Respond to new clients" isLoading={isLoading} />
          <StatCard title="Completed Bookings" value={stats?.completed_bookings_count ?? 0} icon={CheckCircle} description="Total appointments fulfilled" isLoading={isLoading} />
          <StatCard title="Total Revenue" value={`Ksh ${parseFloat((stats?.all_time_earnings ?? 0).toString()).toLocaleString()}`} icon={DollarSign} description="Your all-time earnings" isLoading={isLoading} />
        </div>
      </div>
      {/* ... existing code ... */}
    </div>
  );
};
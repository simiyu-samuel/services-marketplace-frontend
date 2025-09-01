import React, { useState } from 'react';
import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Calendar, 
  Briefcase, 
  User, 
  Settings, 
  CreditCard, 
  LucideProps,
  BarChart3,
  Heart,
  Menu,
  X,
  Sparkles,
  ArrowRight
} from "lucide-react";
import ImprovedHeader from "../layout/ImprovedHeader";
import Footer from "../layout/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { motion } from "framer-motion";

interface NavLinkType {
  to: string;
  label: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  end?: boolean;
  badge?: string;
}

const baseNavLinks: NavLinkType[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/bookings", label: "My Bookings", icon: Calendar },
];

const sellerNavLinks: NavLinkType[] = [
  { to: "/dashboard/services", label: "My Services", icon: Briefcase },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

const accountNavLinks: NavLinkType[] = [
  { to: "/dashboard/payments", label: "Payment History", icon: CreditCard },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

const ImprovedDashboardLayout = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const navLinks = user?.user_type === 'seller' 
    ? [...baseNavLinks, ...sellerNavLinks, ...accountNavLinks] 
    : [...baseNavLinks, ...accountNavLinks];

  const getPackageStatus = () => {
    if (!user?.seller_package || !user?.package_expiry_date) return null;
    
    const expiryDate = new Date(user.package_expiry_date);
    const today = new Date();
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) return { status: 'expired', variant: 'destructive' as const, text: 'Expired' };
    if (daysDiff <= 7) return { status: 'expiring', variant: 'secondary' as const, text: `${daysDiff} days left` };
    return { status: 'active', variant: 'default' as const, text: 'Active' };
  };

  const packageStatus = getPackageStatus();

  const SidebarContent = () => (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Modern User Profile Card */}
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <Card className="bg-gradient-to-br from-primary/8 via-primary/4 to-secondary/8 border-border/30 shadow-lg backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <Avatar className="h-14 w-14 border-2 border-primary/30 shadow-md">
                  <AvatarImage src={user?.profile_image || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base truncate text-foreground">{user?.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs capitalize bg-background/50">
                    {user?.user_type}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Enhanced Package Status for Sellers */}
            {user?.user_type === 'seller' && packageStatus && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 mt-4 pt-4 border-t border-border/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-foreground">Package</span>
                  </div>
                  <Badge 
                    variant={packageStatus.variant} 
                    className={cn(
                      "text-xs font-medium",
                      packageStatus.status === 'active' && "bg-green-100 text-green-800 border-green-200",
                      packageStatus.status === 'expiring' && "bg-yellow-100 text-yellow-800 border-yellow-200",
                      packageStatus.status === 'expired' && "bg-red-100 text-red-800 border-red-200"
                    )}
                  >
                    {packageStatus.text}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-foreground capitalize">
                  {user.seller_package} Plan
                </p>
                {packageStatus.status !== 'active' && (
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Button size="sm" className="w-full text-xs bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90" asChild>
                      <Link to="/dashboard/seller/package-upgrade" className="flex items-center gap-2">
                        {packageStatus.status === 'expired' ? 'Renew Now' : 'Upgrade Plan'}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modern Navigation */}
      <nav className="space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">Navigation</h3>
        {navLinks.map((link, index) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <NavLink
              to={link.to}
              end={link.end}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-muted/60 hover:text-primary group relative overflow-hidden",
                  isActive ? "bg-gradient-to-r from-primary/15 to-secondary/15 text-primary border border-primary/20 shadow-md" : "text-muted-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <link.icon className={cn(
                    "h-4 w-4 transition-all duration-200 group-hover:scale-110 relative z-10",
                    isActive && "text-primary"
                  )} />
                  <span className="flex-1 relative z-10">{link.label}</span>
                  {link.badge && (
                    <Badge variant="secondary" className="text-xs relative z-10">
                      {link.badge}
                    </Badge>
                  )}
                  {isActive && <div className="h-2 w-2 bg-primary rounded-full relative z-10" />}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Enhanced Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-muted/40 to-muted/20 border-border/30">
          <CardHeader className="pb-3">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Quick Actions
            </h3>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {user?.user_type === 'seller' && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="sm" variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary" asChild>
                    <Link to="/dashboard/services/new" onClick={() => setIsMobileMenuOpen(false)}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      Add New Service
                    </Link>
                  </Button>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="sm" variant="ghost" className="w-full justify-start hover:bg-secondary/10 hover:text-secondary" asChild>
                  <Link to="/services" onClick={() => setIsMobileMenuOpen(false)}>
                    <Heart className="mr-2 h-4 w-4" />
                    Browse Services
                  </Link>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      <ImprovedHeader />
      <div className="container py-8 pt-24">
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8"> {/* Changed to flex-col for mobile */}
          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex justify-end w-full mb-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open Dashboard Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col w-full sm:w-[300px] p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Dashboard Menu</h2>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close Menu</span>
                    </Button>
                  </SheetClose>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <SidebarContent />
            </div>
          </aside>

          {/* Main Content */}
          <main className="w-full lg:col-span-4 pt-0 lg:pt-24"> {/* Adjusted pt for mobile */}
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ImprovedDashboardLayout;

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
  Menu, // Import Menu icon
  X // Import X icon
} from "lucide-react";
import ImprovedHeader from "../layout/ImprovedHeader";
import Footer from "../layout/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"; // Import Sheet components

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
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-border/40">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={user?.profile_image || undefined} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.user_type}</p>
            </div>
          </div>
          
          {/* Package Status for Sellers */}
          {user?.user_type === 'seller' && packageStatus && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Package</span>
                <Badge variant={packageStatus.variant} className="text-xs">
                  {packageStatus.text}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground capitalize">
                {user.seller_package} Plan
              </p>
              {packageStatus.status !== 'active' && (
                <Button size="sm" variant="outline" className="w-full text-xs" asChild>
                  <Link to="/dashboard/seller/package-upgrade">
                    {packageStatus.status === 'expired' ? 'Renew' : 'Upgrade'}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <nav className="space-y-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on navigation
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all hover:bg-muted/50 hover:text-primary group",
                isActive && "bg-primary/10 text-primary border border-primary/20 shadow-sm"
              )
            }
          >
            <link.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="flex-1">{link.label}</span>
            {link.badge && (
              <Badge variant="secondary" className="text-xs">
                {link.badge}
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick Actions */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {user?.user_type === 'seller' && (
              <Button size="sm" variant="outline" className="w-full justify-start" asChild>
                <Link to="/dashboard/services/new" onClick={() => setIsMobileMenuOpen(false)}>
                  <Briefcase className="mr-2 h-3 w-3" />
                  Add Service
                </Link>
              </Button>
            )}
            <Button size="sm" variant="outline" className="w-full justify-start" asChild>
              <Link to="/services" onClick={() => setIsMobileMenuOpen(false)}>
                <Heart className="mr-2 h-3 w-3" />
                Browse Services
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
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

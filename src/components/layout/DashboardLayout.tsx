import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, Briefcase, User, Settings, CreditCard, LucideProps } from "lucide-react";
import PremiumHeader from "./PremiumHeader";
import Footer from "./Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavLinkType {
  to: string;
  label: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  end?: boolean;
}

const baseNavLinks: NavLinkType[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/bookings", label: "My Bookings", icon: Calendar },
];

const sellerNavLinks = [
  { to: "/dashboard/services", label: "My Services", icon: Briefcase, end: undefined },
];

const accountNavLinks = [
  { to: "/dashboard/payments", label: "Payment History", icon: CreditCard, end: undefined },
  { to: "/dashboard/profile", label: "Profile", icon: User, end: undefined },
  { to: "/dashboard/settings", label: "Settings", icon: Settings, end: undefined },
];

const DashboardLayout = () => {
  const { user } = useAuth();

  const navLinks = user?.user_type === 'seller' 
    ? [...baseNavLinks, ...sellerNavLinks, ...accountNavLinks] 
    : [...baseNavLinks, ...accountNavLinks];

  return (
    <>
      <PremiumHeader />
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <nav className="flex flex-col space-y-1 sticky top-20 p-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      isActive && "bg-muted text-primary font-semibold"
                    )
                  }
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </aside>
          <main className="md:col-span-3 mt-16">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;

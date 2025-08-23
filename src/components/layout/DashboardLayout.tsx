import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, Briefcase, User, Settings, CreditCard, LucideProps } from "lucide-react";
import PremiumHeader from "./PremiumHeader";
import Footer from "./Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

const sellerNavLinks: NavLinkType[] = [
  { to: "/dashboard/services", label: "My Services", icon: Briefcase, end: undefined },
];

const accountNavLinks: NavLinkType[] = [
  { to: "/dashboard/payments", label: "Payment History", icon: CreditCard, end: undefined },
  { to: "/dashboard/profile", label: "Profile", icon: User, end: undefined },
  { to: "/dashboard/settings", label: "Settings", icon: Settings, end: undefined },
];

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <>
      <PremiumHeader />
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <Card className="sticky top-24 p-4">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user?.profile_image || undefined} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground capitalize">{user?.user_type}</p>
                  </div>
                </div>
              </CardHeader>
              <Separator className="my-4" />
              <nav className="flex flex-col space-y-1">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">General</h3>
                {baseNavLinks.map((link) => (
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

                {user?.user_type === 'seller' && (
                  <>
                    <Separator className="my-4" />
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Services</h3>
                    {sellerNavLinks.map((link) => (
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
                  </>
                )}

                <Separator className="my-4" />
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Account</h3>
                {accountNavLinks.map((link) => (
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
            </Card>
          </aside>
          <main className="md:col-span-3 mt-16">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardLayout;

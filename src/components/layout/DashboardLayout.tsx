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
      <div className="container py-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <aside className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profile_image || undefined} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">{user?.name}</CardTitle>
                    <p className="text-xs text-muted-foreground capitalize">{user?.user_type}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <nav className="flex flex-col space-y-1">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">General</h3>
                  {baseNavLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.end}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-all hover:text-primary hover:bg-muted/50",
                          isActive && "bg-muted text-primary font-medium"
                        )
                      }
                    >
                      <link.icon className="h-4 w-4 flex-shrink-0" />
                      {link.label}
                    </NavLink>
                  ))}

                  {user?.user_type === 'seller' && (
                    <>
                      <Separator className="my-3" />
                      <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Services</h3>
                      {sellerNavLinks.map((link) => (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          end={link.end}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-all hover:text-primary hover:bg-muted/50",
                              isActive && "bg-muted text-primary font-medium"
                            )
                          }
                        >
                          <link.icon className="h-4 w-4 flex-shrink-0" />
                          {link.label}
                        </NavLink>
                      ))}
                    </>
                  )}

                  <Separator className="my-3" />
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Account</h3>
                  {accountNavLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.end}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-all hover:text-primary hover:bg-muted/50",
                          isActive && "bg-muted text-primary font-medium"
                        )
                      }
                    >
                      <link.icon className="h-4 w-4 flex-shrink-0" />
                      {link.label}
                    </NavLink>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>
          <main className="lg:col-span-4">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardLayout;

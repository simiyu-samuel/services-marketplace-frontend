import { NavLink, Outlet, Link } from "react-router-dom";
import { Home, Users, Briefcase, Calendar, Settings, CreditCard, MessageSquare, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const adminNavLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Home },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/bookings", label: "Bookings", icon: Calendar },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/my-services", label: "My Admin Services", icon: Briefcase }, // Add new link
];

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="border-b p-4 flex flex-col">
          <NavLink to="/" className="flex items-center justify-center font-semibold">
            <img src="/public/logo.png" alt="Themabinti Logo" className="h-20 w-auto" />
          </NavLink>
          <Button asChild className="mt-4">
            <Link to="/">Go to Website</Link>
          </Button>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {adminNavLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
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
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        {/* A simple header can be added here if needed */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

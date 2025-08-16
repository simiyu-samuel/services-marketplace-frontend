import { NavLink, Outlet } from "react-router-dom";
import { Home, Users, Briefcase, Calendar, Settings, CreditCard, MessageSquare, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Home },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/bookings", label: "Bookings", icon: Calendar },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="border-b p-4">
          <NavLink to="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[hsl(262,55%,50%)] via-[hsl(320,60%,55%)] to-[hsl(340,70%,60%)] text-transparent bg-clip-text">
              Themabinti <span className="font-semibold text-muted-foreground/80">Admin</span>
            </span>
          </NavLink>
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
                      isActive && "bg-muted text-primary"
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
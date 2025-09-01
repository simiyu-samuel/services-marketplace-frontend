import React, { useState } from "react"; // Import useState
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { Home, Users, Briefcase, Calendar, Settings, CreditCard, MessageSquare, FileText, LogOut, LayoutDashboard, Menu, X } from "lucide-react"; // Import Menu and X icons
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"; // Import Sheet components

const adminNavLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Home },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/bookings", label: "Bookings", icon: Calendar },
  { to: "/admin/general-bookings", label: "General Bookings", icon: Calendar },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/my-services", label: "My Admin Services", icon: Briefcase },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  }

  const SidebarContent = () => (
    <>
      <div className="border-b p-4 flex flex-col items-center">
        <NavLink to="/" className="flex items-center justify-center font-semibold">
          <img src="/logo.png" alt="Themabinti Logo" className="h-20 w-auto" />
        </NavLink>
        <Button asChild className="mt-4 w-full">
          <Link to="/">Go to Website</Link>
        </Button>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {adminNavLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on navigation
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
    </>
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
        <SidebarContent />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Admin Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col w-full sm:w-[300px] p-0"> {/* p-0 to allow SidebarContent to manage its own padding */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Admin Menu</h2>
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

          <div className="relative ml-auto flex-1 md:grow-0" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profile_image || undefined} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                <Users className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:p-6"> {/* Adjusted pt for mobile */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, LogOut, LayoutDashboard, User as UserIcon, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  }

  const handleDashboardClick = () => {
    if (user?.user_type === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Themabinti
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-primary ${
                  isActive ? "text-primary bg-muted" : "text-muted-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profile_image || undefined} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDashboardClick}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </nav>
          )}

          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col w-full sm:w-[340px]">
                <div className="flex items-center justify-between">
                   <Link to="/" className="flex items-center space-x-2" onClick={() => setIsSheetOpen(false)}>
                      <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                        Themabinti
                      </span>
                    </Link>
                    <SheetClose asChild>
                       <Button variant="ghost" size="icon">
                          <X className="h-5 w-5" />
                          <span className="sr-only">Close Menu</span>
                       </Button>
                    </SheetClose>
                </div>
                <Separator className="my-4" />
                <nav className="flex-grow grid gap-4 text-lg font-medium">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsSheetOpen(false)}
                      className={({ isActive }) =>
                        `transition-colors hover:text-primary ${
                          isActive ? "text-primary font-semibold" : "text-muted-foreground"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>
                {!user && (
                  <div className="mt-auto">
                    <Separator className="my-4" />
                    <div className="flex flex-col gap-2">
                      <Button asChild onClick={() => setIsSheetOpen(false)}><Link to="/login">Login</Link></Button>
                      <Button variant="outline" asChild onClick={() => setIsSheetOpen(false)}><Link to="/register">Sign Up</Link></Button>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
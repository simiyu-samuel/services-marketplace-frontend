import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, LogOut, LayoutDashboard, User as UserIcon, X, Sparkles, Scissors, Shirt } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const categories = [
  {
    title: "Beauty Services",
    icon: Sparkles,
    description: "Makeup, nails, lashes, and more to enhance your natural beauty.",
    subcategories: ["Makeup", "Nails", "Eyebrows & Lashes", "Microblading", "Heena", "Tattoo & Piercings", "Waxing", "ASMR & Massage", "Beauty Hub"],
  },
  {
    title: "Hair Services",
    icon: Scissors,
    description: "From braiding and weaving to cuts and complete hair care.",
    subcategories: ["Braiding", "Weaving", "Locs", "Wig Makeovers", "Ladies Haircut", "Complete Hair Care"],
  },
  {
    title: "Fashion Services",
    icon: Shirt,
    description: "Unique and stylish African wear, Maasai designs, and crotchet fashion.",
    subcategories: ["African Wear", "Maasai Wear", "Crotchet/Wear"],
  },
];

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const scrolled = useScroll(10);

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
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled ? "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14" : "h-16"
    )}>
      <div className="container relative flex h-full items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-[hsl(262,55%,50%)] via-[hsl(320,60%,55%)] to-[hsl(340,70%,60%)] text-transparent bg-clip-text bg-[length:200%_auto] animate-gradient-pan transition-transform duration-300 hover:scale-105 [text-shadow:2px_2px_0px_hsl(var(--secondary)/0.4)]">
            Themabinti
          </span>
        </Link>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <nav className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.to}>
                    <NavLink to={link.to} className={({ isActive }) => cn(navigationMenuTriggerStyle(), "bg-transparent", isActive ? "text-primary" : "text-muted-foreground")}>
                      {link.label}
                    </NavLink>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-3 gap-4 p-4 w-[750px]">
                      <div className="col-span-1 flex flex-col gap-1">
                        {categories.map((category) => (
                          <div
                            key={category.title}
                            onMouseEnter={() => setActiveCategory(category)}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors",
                              activeCategory.title === category.title ? "bg-muted" : "hover:bg-muted/50"
                            )}
                          >
                            <category.icon className="h-5 w-5 text-primary flex-shrink-0" />
                            <div className="flex flex-col">
                              <p className="font-semibold text-sm">{category.title}</p>
                              <p className="text-xs text-muted-foreground">{category.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-2 p-3">
                        {activeCategory.subcategories.map((item) => (
                          <ListItem key={item} to={`/services?category=${encodeURIComponent(item)}`}>
                            {item}
                          </ListItem>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-2">
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
                      <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-[hsl(262,55%,50%)] via-[hsl(320,60%,55%)] to-[hsl(340,70%,60%)] text-transparent bg-clip-text">
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
                <nav className="flex-grow flex flex-col gap-4 text-lg font-medium">
                  {navLinks.map((link) => (
                    <SheetClose key={link.to} asChild>
                      <NavLink to={link.to} className={({ isActive }) => cn("hover:text-primary", isActive ? "text-primary font-semibold" : "text-muted-foreground")}>
                        {link.label}
                      </NavLink>
                    </SheetClose>
                  ))}
                  <Accordion type="single" collapsible className="w-full">
                    {categories.map((category) => (
                      <AccordionItem key={category.title} value={category.title}>
                        <AccordionTrigger className="text-lg font-medium text-muted-foreground hover:text-primary hover:no-underline">{category.title}</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-3 pl-4">
                            {category.subcategories.map((item) => (
                              <SheetClose key={item} asChild>
                                <Link to={`/services?category=${encodeURIComponent(item)}`} className="text-base text-muted-foreground hover:text-primary">
                                  {item}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
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

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { to: string }
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{children}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Header;
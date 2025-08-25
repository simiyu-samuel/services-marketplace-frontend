import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, LogOut, LayoutDashboard, User as UserIcon, X, Sparkles, Scissors, Shirt, Settings, Camera, Heart, HeartPulse, Gift, Dumbbell, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import MobileLocationSelector from './MobileLocationSelector';
import NotificationBell from '../ui/NotificationBell';

const navLinks = [
  { to: "/", label: "Home" },
  // { to: "/services", label: "Services" },
  // { to: "/blog", label: "Blog" },
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
    subcategories: ["African Wear", "Maasai Wear", "Crotchet/Weaving", "Personal Stylist", "Made in Kenya"],
  },
  {
    title: "Photography",
    icon: Camera, // Assuming Camera icon is available or needs to be imported
    description: "Capture your precious moments with professional photography services.",
    subcategories: ["Event", "Lifestyle", "Portrait"],
  },
  {
    title: "Bridal Services",
    icon: Heart, // Assuming Heart icon is available or needs to be imported
    description: "Everything you need for your special day, from makeup to wedding cakes.",
    subcategories: ["Bridal Makeup", "Bridal Hair", "Bridesmaids for Hire", "Gowns for Hire", "Wedding Cakes"],
  },
  {
    title: "Health Services",
    icon: HeartPulse, // Assuming HeartPulse icon is available or needs to be imported
    description: "Comprehensive health and wellness services for women.",
    subcategories: ["Dental", "Skin Consultation", "Reproductive Care", "Maternal Care", "Mental Care"],
  },
  {
    title: "Celebrate Her",
    icon: Gift, // Assuming Gift icon is available or needs to be imported
    description: "Make every occasion special with florists, decor, and unique experiences.",
    subcategories: ["Florist", "Decor", "Journey to Motherhood"],
  },
  {
    title: "Fitness Services",
    icon: Dumbbell, // Assuming Dumbbell icon is available or needs to be imported
    description: "Achieve your fitness goals with expert trainers and nutritionists.",
    subcategories: ["Gym", "Personal Trainers", "Nutritionist"],
  },
  {
    title: "Home & Lifestyles",
    icon: Home, // Assuming Home icon is available or needs to be imported
    description: "Enhance your living space and simplify your daily life.",
    subcategories: ["Cleaning Services", "Laundry Services", "Home & Home Decor"],
  },
];

const ImprovedHeader = () => {
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
      "sticky top-0 z-50 w-full transition-all duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      scrolled ? "border-b shadow-sm h-14" : "h-16"
    )}>
      <div className="container relative flex h-full items-center">
        {/* <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Themabinti Logo" className="h-32 w-auto" />
        </Link> */}
        <Link to="/" className="flex items-center justify-center font-semibold">
          <img src="/logo.png" alt="Themabinti Logo" className="h-20 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <nav className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.to}>
                    <NavLink 
                      to={link.to} 
                      className={({ isActive }) => cn(
                        navigationMenuTriggerStyle(), 
                        "bg-transparent transition-all duration-200", 
                        isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                      )}
                    >
                      {link.label}
                    </NavLink>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-3 gap-4 p-6 w-[800px]">
                      <div className="col-span-1 flex flex-col gap-2">
                        {categories.map((category) => (
                          <div
                            key={category.title}
                            onMouseEnter={() => setActiveCategory(category)}
                            className={cn(
                              "flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200",
                              activeCategory.title === category.title 
                                ? "bg-primary/10 border border-primary/20" 
                                : "hover:bg-muted/50 border border-transparent"
                            )}
                          >
                            <category.icon className="h-6 w-6 text-primary flex-shrink-0" />
                            <div className="flex flex-col">
                              <p className="font-semibold text-sm">{category.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-3 p-4">
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

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Mobile Quick Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-primary font-medium">
              <Link to="/services">Find Services</Link>
            </Button>
            <MobileLocationSelector />
          </div>

          {/* Notifications for logged-in users */}
          {user && <NotificationBell />}

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
                    <p className="text-xs leading-none text-primary capitalize">{user.user_type}</p>
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
                <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
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

          {/* Mobile Menu */}
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
                
                {/* User Info in Mobile Menu */}
                {user && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profile_image || undefined} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.user_type}</p>
                    </div>
                  </div>
                )}

                <nav className="flex-grow flex flex-col gap-4 text-lg font-medium">
                  {navLinks.map((link) => (
                    <SheetClose key={link.to} asChild>
                      <NavLink to={link.to} className={({ isActive }) => cn("hover:text-primary transition-colors", isActive ? "text-primary font-semibold" : "text-muted-foreground")}>
                        {link.label}
                      </NavLink>
                    </SheetClose>
                  ))}
                  
                  <Accordion type="single" collapsible className="w-full">
                    {categories.map((category) => (
                      <AccordionItem key={category.title} value={category.title}>
                        <AccordionTrigger className="text-lg font-medium text-muted-foreground hover:text-primary hover:no-underline">
                          {category.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-3 pl-4">
                            {category.subcategories.map((item) => (
                              <SheetClose key={item} asChild>
                                <Link 
                                  to={`/services?category=${encodeURIComponent(item)}`} 
                                  className="text-base text-muted-foreground hover:text-primary transition-colors"
                                >
                                  {item}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {user && (
                    <>
                      <Separator className="my-4" />
                      <SheetClose asChild>
                        <Button variant="ghost" onClick={handleDashboardClick} className="justify-start">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="ghost" onClick={() => navigate('/dashboard/profile')} className="justify-start">
                          <UserIcon className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="ghost" onClick={handleLogout} className="justify-start text-destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </nav>
                
                {!user && (
                  <div className="mt-auto">
                    <Separator className="my-4" />
                    <div className="flex flex-col gap-2">
                      <Button asChild onClick={() => setIsSheetOpen(false)}>
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button variant="outline" asChild onClick={() => setIsSheetOpen(false)}>
                        <Link to="/register">Sign Up</Link>
                      </Button>
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

export default ImprovedHeader;

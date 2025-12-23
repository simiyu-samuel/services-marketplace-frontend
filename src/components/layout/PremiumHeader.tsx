import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Button } from '@/components/ui/button';
import { Search, Menu, X, MapPin, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCategorySelector from './MobileCategorySelector'; // Import the new component
import { categories } from './MobileCategorySelector'; // Import categories from MobileCategorySelector

const kenyanCounties = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay',
  'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
  'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
  'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
  'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

// Location Selector Component
const LocationSelector: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('Location');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLocationSelect = (county: string) => {
    setSelectedLocation(county);
    setIsOpen(false);
    // Navigate to services page with location as a query parameter
    navigate(`/services?location=${encodeURIComponent(county)}`);
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-purple-100 hover:text-white hover:bg-purple-600/30 transition-colors rounded-md px-2 py-1"
      >
        <MapPin className="h-4 w-4" />
        <span className="text-xs sm:text-sm max-w-20 sm:max-w-none truncate">
          {selectedLocation}
        </span>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-56 max-h-60 overflow-y-auto bg-purple-900/95 backdrop-blur-lg border border-purple-600/40 rounded-md shadow-xl z-50"
          >
            <div className="p-2">
              <div className="text-sm font-medium text-purple-200 mb-2 px-2">
                Select County
              </div>
              {kenyanCounties.map((county) => (
                <button
                  key={county}
                  onClick={() => handleLocationSelect(county)} // Use the new handler
                  className={cn(
                    "w-full text-left px-2 py-2 text-sm rounded-md text-purple-100 hover:bg-purple-600/40 hover:text-white transition-colors",
                    selectedLocation === county && "bg-purple-600/60 text-white"
                  )}
                >
                  {county}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const PremiumHeader: React.FC = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false); // New state for category selector
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate for PremiumHeader
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: "/", text: "Home" },
    // { to: "/services", text: "Services" },
    { to: "/blog", text: "Blog" },
    { to: "/contact", text: "Contact" },
  ];

  const handleCommandSelect = (callback: () => void) => {
    callback();
    setIsCommandOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-lg border-b border-purple-500/20 shadow-lg"
      >
          <div className="container relative flex h-12 items-center justify-between">
            {/* Desktop Logo */}
            <Link to="/" className="hidden md:flex items-center space-x-2">
              {/* <img src="/logo.png" alt="Themabinti Logo" className="h-8 w-auto" /> */}
              <img src="/logo.png" alt="Themabinti Logo" className="h-32 w-auto" />
            </Link>

            {/* Mobile Logo - Compact version in center when menu is closed */}
            <div className="md:hidden flex items-center justify-center flex-1">
              {!isMobileMenuOpen && (
                <Link to="/" className="flex items-center">
                  <img src="/logo.png" alt="Themabinti" className="h-6 w-auto" />
                </Link>
              )}
            </div>
        
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Desktop navigation - hidden on mobile */}
            <nav className="hidden lg:flex items-center gap-4">
              {navLinks.map(link => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className={cn(
                    "text-sm font-medium text-purple-100 hover:text-white transition-colors relative group",
                    location.pathname === link.to && "text-white"
                  )}
                >
                  {link.text}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-purple-400 transition-all duration-200",
                    location.pathname === link.to ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              ))}
            </nav>

            {/* Always visible location selector - animated dropdown */}
            <LocationSelector />

            {/* Always visible Find Services button */}
            {isMobile ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsCategorySelectorOpen(true)} // Open category selector on mobile
                className="flex items-center gap-1 text-xs sm:text-sm bg-purple-600/20 border-purple-400/30 text-purple-100 hover:bg-purple-500/30 hover:text-white hover:border-purple-300/50 transition-all duration-200"
              >
                <span className="hidden xs:inline">Find</span> Services
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 text-xs sm:text-sm bg-purple-600/20 border-purple-400/30 text-purple-100 hover:bg-purple-500/30 hover:text-white hover:border-purple-300/50 transition-all duration-200"
                  >
                    <span className="hidden xs:inline">Find</span> Services <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-purple-900/95 border-purple-600/30 backdrop-blur-lg w-56">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => navigate(`/services?category=${encodeURIComponent(category)}`)}
                      className="text-purple-100 hover:bg-purple-600/30 hover:text-white"
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-purple-600/30" />
                  <DropdownMenuItem 
                    onClick={() => navigate('/services')}
                    className="text-purple-100 hover:bg-purple-600/30 hover:text-white"
                  >
                    View All Services
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu toggle - only for secondary navigation */}
            <div className="flex lg:hidden items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="text-purple-100 hover:text-white hover:bg-purple-600/30 transition-colors h-8 w-8"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>

            {/* Search button - always visible */}
            <Button variant="ghost" size="icon" onClick={() => setIsCommandOpen(true)} className="group text-purple-100 hover:text-white hover:bg-purple-600/30 transition-colors h-8 w-8">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            
            {/* CMD+K shortcut - desktop only */}
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden xl:flex items-center gap-2 bg-purple-600/20 border-purple-400/30 text-purple-200 hover:bg-purple-500/30 hover:text-white hover:border-purple-300/50 transition-all duration-200" 
              onClick={() => setIsCommandOpen(true)}
            >
              <span className="text-xs">⌘K</span>
            </Button>

            {/* User menu or login button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-purple-600/30 transition-colors h-8 w-8">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.profile_image || undefined} />
                      <AvatarFallback className="bg-purple-600 text-white text-xs">{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-purple-900/95 border-purple-600/30 backdrop-blur-lg">
                  {user.user_type === 'admin' ? (
                    <DropdownMenuItem asChild className="text-purple-100 hover:bg-purple-600/30 hover:text-white">
                      <Link to="/admin/dashboard">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild className="text-purple-100 hover:bg-purple-600/30 hover:text-white">
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className="text-purple-100 hover:bg-purple-600/30 hover:text-white">
                    <Link to="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-purple-600/30" />
                  <DropdownMenuItem onClick={() => logout()} className="text-purple-100 hover:bg-purple-600/30 hover:text-white">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="hidden sm:inline-flex bg-purple-600 hover:bg-purple-700 text-white border-0 transition-colors">
                <Link to="/login">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Mobile menu - now only contains secondary navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-12 left-0 right-0 z-40 bg-purple-900 backdrop-blur-lg border-b border-purple-500/30 lg:hidden"
          >
            {/* Mobile Logo - Centered when menu is open */}
            <div className="flex items-center justify-center py-3 border-b border-purple-600/30">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img src="/logo.png" alt="Themabinti Logo" className="h-8 w-auto" />
              </Link>
            </div>
            
            <div className="p-4">
              <nav className="flex flex-col gap-2"> {/* Reduced gap for better spacing */}
                {/* Main navigation links */}
                {navLinks.map(link => (
                  <Link 
                    key={link.to} 
                    to={link.to} 
                    className={cn(
                      "text-base font-medium text-white hover:bg-purple-700/50 rounded-md px-4 py-2 block transition-colors relative group", /* Changed text to white, added hover background, padding, and rounded corners */
                      location.pathname === link.to && "bg-purple-700/70" /* Highlight active link */
                    )}
                  >
                    {link.text}
                    <span className={cn(
                      "absolute -bottom-0.5 left-0 h-0.5 bg-purple-400 transition-all duration-200",
                      location.pathname === link.to ? "w-full" : "w-0 group-hover:w-full"
                    )} />
                  </Link>
                ))}
                
                {/* Additional mobile actions */}
                <div className="border-t border-purple-600/30 pt-4 mt-4">
                  <Button variant="outline" asChild className="w-full mb-2 bg-purple-600/20 border-purple-400/30 text-purple-100 hover:bg-purple-500/30 hover:text-white hover:border-purple-300/50">
                    <Link to="/register">Join as Provider</Link>
                  </Button>
                  
                  {!user && (
                    <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <Link to="/login">Get Started</Link>
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command dialog */}
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {navLinks.map(link => (
              <CommandItem key={link.to} onSelect={() => handleCommandSelect(() => window.location.href = link.to)}>
                {link.text}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Mobile Category Selector */}
      {isMobile && (
        <MobileCategorySelector 
          isOpen={isCategorySelectorOpen} 
          onOpenChange={setIsCategorySelectorOpen} 
        />
      )}
    </>
  );
};

export default PremiumHeader;

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Command, Search, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const PremiumHeader: React.FC = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

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
    { to: "/services", text: "Services" },
    { to: "/blog", text: "Blog" },
    { to: "/contact", text: "Contact" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-lg border-b border-border/40"
      >
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-1 bg-muted/50 border border-border/40 rounded-full px-4 py-2">
            {navLinks.map(link => (
              <Link 
                key={link.to} 
                to={link.to} 
                className={`text-sm font-medium transition-colors px-4 py-2 rounded-full ${
                  location.pathname === link.to 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.text}
              </Link>
            ))}
          </nav>
        </div>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <img src="/public/logo.png" alt="Themabinti Logo" className="h-32 w-auto" />
        </Link>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsCommandOpen(true)} className="group">
            <Search className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2" onClick={() => setIsCommandOpen(true)}>
            <span className="text-xs">CMD+K</span>
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profile_image || undefined} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="hidden md:inline-flex">
              <Link to="/login">Get Started</Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/40 p-4 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} className="text-base font-medium text-muted-foreground hover:text-primary transition-colors">
                  {link.text}
                </Link>
              ))}
              <Button asChild className="w-full mt-4">
                <Link to="/login">Get Started</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => { setIsCommandOpen(false); }}>
              <Link to="/" className="w-full">Home</Link>
            </CommandItem>
            <CommandItem onSelect={() => { setIsCommandOpen(false); }}>
              <Link to="/services" className="w-full">Services</Link>
            </CommandItem>
            <CommandItem onSelect={() => { setIsCommandOpen(false); }}>
              <Link to="/blog" className="w-full">Blog</Link>
            </CommandItem>
            <CommandItem onSelect={() => { setIsCommandOpen(false); }}>
              <Link to="/contact" className="w-full">Contact</Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default PremiumHeader;

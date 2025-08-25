import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Instagram, Linkedin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  const footerSections = [
    {
      title: "Services",
      links: [
        { label: "Beauty", href: "/services?category=beauty" },
        { label: "Wellness", href: "/services?category=wellness" },
        { label: "Health", href: "/services?category=health" },
        { label: "Home Services", href: "/services?category=home-services" },
        { label: "Events", href: "/services?category=events" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About us", href: "/about-us" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of use", href: "/terms-of-service" },
        { label: "Privacy policy", href: "/privacy-policy" },
        { label: "Cookie policy", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-background border-t border-border/40 text-foreground font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Link to="/">
              <img src="/public/logo.png" alt="Themabinti Logo" className="h-32 w-auto" />
            </Link>
            <p className="text-muted-foreground text-base mt-4 max-w-md">
              Your modern, inclusive hub for the best beauty, health, and lifestyle services across Kenya. Discover and book with ease.
            </p>
            <div className="flex items-center gap-5 mt-8">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  whileHover={{ scale: 1.2, rotate: -10, color: "hsl(var(--primary))" }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  aria-label={link.label}
                >
                  <link.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-lg tracking-wide text-foreground mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300 text-base relative group">
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h4 className="font-semibold text-lg tracking-wide text-foreground mb-4">Stay Updated</h4>
              <p className="text-muted-foreground text-base mb-4">Subscribe for latest updates.</p>
              <form className="flex items-center gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow bg-muted border-border/60 focus-visible:ring-primary/50 focus-visible:ring-offset-background" 
                  aria-label="Email for newsletter"
                />
                <Button size="icon" className="group">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 py-6 border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Themabinti Services Hub. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Designed<span role="img" aria-label="love"></span><span role="img" aria-label="coffee"></span> by ICORE Information Systems
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

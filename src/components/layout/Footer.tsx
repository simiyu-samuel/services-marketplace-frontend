import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h3 className="font-bold text-2xl mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              Themabinti
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Your modern, inclusive hub for the best beauty, health, and lifestyle services across Kenya.
            </p>
          </div>
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-lg mb-2">Stay Updated</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to our newsletter to get the latest news, updates, and special offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <Input type="email" placeholder="Enter your email" className="flex-grow" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-muted/50">
        <div className="container py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Themabinti Services Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
          </div>
          <div className="flex items-center gap-2">
            <a href="#" className="p-2 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="p-2 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="p-2 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="p-2 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"><Linkedin className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
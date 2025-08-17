import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, User, Briefcase } from "lucide-react";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-4xl text-center"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Join Themabinti
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Are you looking for services, or do you want to offer them? Choose your path below.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div whileHover={{ y: -10, scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="text-left h-full flex flex-col bg-muted/40 border-border/40 shadow-xl hover:border-primary transition-colors duration-300">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <User className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl font-bold">I'm a Customer</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Find and book the best beauty, health, and lifestyle services near you with ease.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Button asChild className="w-full group" size="lg">
                  <Link to="/register/customer">
                    Sign up as a Customer
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div whileHover={{ y: -10, scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="text-left h-full flex flex-col bg-muted/40 border-border/40 shadow-xl hover:border-primary transition-colors duration-300">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <Briefcase className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl font-bold">I'm a Seller</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Grow your business, manage bookings, and connect with new clients on our platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Button asChild className="w-full group" size="lg">
                  <Link to="/register/seller">
                    Sign up as a Seller
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

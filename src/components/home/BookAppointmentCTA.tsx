import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookAppointmentCTA = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 md:p-12 text-white shadow-2xl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full translate-x-24 translate-y-24" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12" />
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-4"
        >
          <div className="bg-white/20 p-4 rounded-full">
            <Calendar className="h-8 w-8" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Ready to Book Your Perfect Service?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto"
        >
          Join thousands of satisfied customers who've found their ideal beauty, health, and lifestyle services through our platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button 
            size="lg" 
            variant="secondary"
            className="group bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 text-lg"
            asChild
          >
            <Link to="/services">
              <Sparkles className="mr-2 h-5 w-5" />
              Explore All Services
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="group border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 text-lg"
            asChild
          >
            <Link to="/register">
              Join as Provider
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex justify-center items-center gap-6 text-sm opacity-80"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span>Verified Providers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span>Secure Booking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span>Quality Guaranteed</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookAppointmentCTA;
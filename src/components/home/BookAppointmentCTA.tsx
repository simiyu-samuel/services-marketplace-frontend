import React from 'react';
import { color, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Sparkles, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import GeneralBookingModal from './GeneralBookingModal';

const BookAppointmentCTA = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-3 sm:p-4 md:p-6 text-white shadow-2xl flex justify-center items-center"
      >
        <div className="relative z-10 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full flex flex-row gap-3 justify-center items-center max-w-2xl mx-auto"
          >
            <Button 
              size="lg" 
              variant="secondary"
              className="group bg-white text-primary hover:bg-white/90 font-semibold px-3 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg w-full sm:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              <Calendar className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              <span className="hidden sm:inline">Book Appointment</span>
              <span className="sm:hidden">Book</span>
              <ArrowRight className="ml-1 sm:ml-2 h-4 sm:h-5 w-4 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-3 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg w-full sm:w-auto transition-all duration-300"
              asChild
            >
              <Link to="/register/seller">
                <UserPlus className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                <span className="hidden sm:inline">Join as Provider</span>
                <span className="sm:hidden">Join</span>
                <ArrowRight className="ml-1 sm:ml-2 h-4 sm:h-5 w-4 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
      <GeneralBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default BookAppointmentCTA;

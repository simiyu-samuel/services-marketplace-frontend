import React from 'react';
import { color, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
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
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-4 md:p-6 text-white shadow-2xl flex justify-center items-center"
      >
        <div className="relative z-10 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <Button 
              size="lg" 
              variant="secondary"
              className="group bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 text-lg w-full md:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Appointment
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
      <GeneralBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default BookAppointmentCTA;

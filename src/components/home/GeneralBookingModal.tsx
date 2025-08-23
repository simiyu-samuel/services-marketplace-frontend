import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import GeneralBookingSection from './GeneralBookingSection';
import { motion } from 'framer-motion';

interface GeneralBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GeneralBookingModal: React.FC<GeneralBookingModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full h-full sm:max-w-[900px] md:h-auto p-0 overflow-hidden flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col h-full"
        >
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold text-center">Book a General Appointment</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Select your preferred date and time, then provide your details.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-4 flex-grow overflow-y-auto">
            <GeneralBookingSection />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default GeneralBookingModal;

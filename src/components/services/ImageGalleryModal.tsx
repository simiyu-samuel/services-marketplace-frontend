import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageGallery from './ImageGallery';
import { motion } from 'framer-motion';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaFiles: string[];
  serviceTitle: string;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ isOpen, onClose, mediaFiles, serviceTitle }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold text-center">{serviceTitle} - Gallery</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-4">
            <ImageGallery mediaFiles={mediaFiles} serviceTitle={serviceTitle} />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryModal;

import React from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100%",
    scale: 0.9,
  },
  in: {
    opacity: 1,
    x: "0%",
    scale: 1,
  },
  out: {
    opacity: 0,
    x: "100%",
    scale: 0.9,
  },
};

const pageTransition: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 25,
  mass: 1,
};

interface RouteTransitionsProps {
  children: React.ReactNode;
}

const RouteTransitions: React.FC<RouteTransitionsProps> = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default RouteTransitions;

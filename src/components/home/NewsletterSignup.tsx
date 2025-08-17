import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const NewsletterSignup = () => {
  return (
    <div className="text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-4"
      >
        Subscribe to Our Newsletter
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-xl mx-auto text-muted-foreground mb-8"
      >
        Get the latest news, updates, and special offers delivered directly to your inbox.
      </motion.p>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
      >
        <Input type="email" placeholder="Enter your email" className="flex-grow" />
        <Button type="submit">Subscribe</Button>
      </motion.form>
    </div>
  );
};

export default NewsletterSignup;

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: "Jane Doe",
    role: "Customer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    testimonial: "Themabinti has revolutionized how I find and book beauty services. The platform is intuitive, and the service providers are top-notch.",
    rating: 5,
  },
  {
    name: "John Smith",
    role: "Seller",
    avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    testimonial: "As a seller, Themabinti has provided me with a steady stream of clients. The platform is easy to use and has helped me grow my business.",
    rating: 5,
  },
  {
    name: "Alice Johnson",
    role: "Customer",
    avatar: "https://randomuser.me/api/portraits/women/71.jpg",
    testimonial: "I love the variety of services available on Themabinti. I've discovered so many talented professionals in my area.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="p-8 rounded-lg bg-muted/50"
        >
          <div className="flex items-center mb-4">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={testimonial.avatar} />
              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-bold">{testimonial.name}</h4>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-muted-foreground">{testimonial.testimonial}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default Testimonials;

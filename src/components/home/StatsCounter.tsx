import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Briefcase, Star } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Happy Customers",
  },
  {
    icon: Briefcase,
    value: "1,000+",
    label: "Verified Sellers",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Average Rating",
  },
];

const StatsCounter = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="p-8 rounded-lg bg-muted/50 text-center"
        >
          <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-4xl font-extrabold mb-2">{stat.value}</h3>
          <p className="text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCounter;

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Sparkles, Scissors, Shirt, ArrowRight, Camera, Heart, HeartPulse, Gift, Dumbbell, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const categories = [
  {
    title: "Beauty Services",
    icon: Sparkles,
    description: "Makeup, nails, lashes, and more to enhance your natural beauty.",
    link: "/services?category=Beauty Services",
    color: "from-pink-500 to-purple-500",
  },
  {
    title: "Hair Services",
    icon: Scissors,
    description: "From braiding and weaving to cuts and complete hair care.",
    link: "/services?category=Hair Services",
    color: "from-blue-500 to-teal-500",
  },
  {
    title: "Fashion Services",
    icon: Shirt,
    description: "Unique and stylish African wear, Maasai designs, and crotchet fashion.",
    link: "/services?category=Fashion Services",
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Photography",
    icon: Camera,
    description: "Capture your precious moments with professional photography services.",
    link: "/services?category=Photography",
    color: "from-green-500 to-blue-500",
  },
  {
    title: "Bridal Services",
    icon: Heart,
    description: "Everything you need for your special day, from makeup to wedding cakes.",
    link: "/services?category=Bridal Services",
    color: "from-red-500 to-pink-500",
  },
  {
    title: "Health Services",
    icon: HeartPulse,
    description: "Comprehensive health and wellness services for women.",
    link: "/services?category=Health Services",
    color: "from-teal-500 to-cyan-500",
  },
  {
    title: "Celebrate Her",
    icon: Gift,
    description: "Make every occasion special with florists, decor, and unique experiences.",
    link: "/services?category=Celebrate Her",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Fitness Services",
    icon: Dumbbell,
    description: "Achieve your fitness goals with expert trainers and nutritionists.",
    link: "/services?category=Fitness Services",
    color: "from-indigo-500 to-purple-500",
  },
  {
    title: "Home & Lifestyles",
    icon: Home,
    description: "Enhance your living space and simplify your daily life.",
    link: "/services?category=Home & Lifestyles",
    color: "from-gray-500 to-slate-500",
  },
];

const InteractiveCategories = () => {
  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.2,
        type: "spring",
        stiffness: 120,
      },
    }),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {categories.map((category, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          whileHover={{ y: -10, transition: { duration: 0.3 } }}
        >
          <Card className={`h-full flex flex-col bg-gradient-to-br ${category.color} text-white shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-2xl overflow-hidden`}>
            <CardHeader>
              <div className="bg-white/20 p-4 rounded-xl w-fit mb-4">
                <category.icon className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl font-bold">{category.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <p className="opacity-80 mb-6 flex-grow">{category.description}</p>
              <Link to={category.link} className="flex items-center font-semibold group-hover:underline">
                Explore
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default InteractiveCategories;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Briefcase, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutUs: React.FC = () => {
  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Customers" },
    { icon: Briefcase, value: "500+", label: "Verified Service Providers" },
    { icon: Heart, value: "20+", label: "Service Categories" },
    { icon: Star, value: "4.9/5", label: "Average Rating" },
  ];

  const teamMembers = [
    {
      name: "Jane Doe",
      role: "CEO & Founder",
      image: "https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Jane envisioned a platform that connects people with quality services seamlessly. Her passion for community and technology drives Themabinti's mission.",
    },
    {
      name: "John Smith",
      role: "Chief Technology Officer",
      image: "https://images.pexels.com/photos/5327653/pexels-photo-5327653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "With a background in scalable web architectures, John leads our engineering team, ensuring a robust and secure platform for all users.",
    },
    {
      name: "Emily White",
      role: "Head of Marketing",
      image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Emily crafts our brand story and connects us with our audience. Her innovative strategies help service providers reach their ideal customers.",
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="container mx-auto px-4 py-16 sm:px-6 lg:px-8"
    >
      <motion.h1 variants={fadeIn} className="text-5xl font-extrabold text-center text-primary mb-8">
        About Themabinti
      </motion.h1>
      <motion.p variants={fadeIn} className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-16">
        Connecting you to the best beauty, health, and lifestyle services across Kenya. Our mission is to empower local service providers and offer unparalleled convenience to customers.
      </motion.p>

      <section className="mb-20">
        <motion.h2 variants={fadeIn} className="text-4xl font-bold text-center text-foreground mb-12">
          Our Story
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeIn}>
            <img
              src="https://images.pexels.com/photos/1000445/pexels-photo-1000445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Our Story"
              className="rounded-lg shadow-xl w-full h-auto object-cover"
              loading="lazy" // Lazy load for images below the fold
            />
          </motion.div>
          <motion.div variants={fadeIn} className="space-y-6 text-lg text-muted-foreground">
            <p>
              Founded in {new Date().getFullYear() - 3}, Themabinti was born out of a simple idea: to create a seamless bridge between talented service providers and individuals seeking quality services. We noticed a gap in the market for a reliable, easy-to-use platform that caters specifically to the vibrant and diverse service industry in Kenya.
            </p>
            <p>
              From humble beginnings, we've grown into a thriving community, constantly evolving to meet the needs of our users. Our commitment to excellence, transparency, and supporting local businesses remains at the core of everything we do. We believe in the power of connection and the value of exceptional service.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mb-20">
        <motion.h2 variants={fadeIn} className="text-4xl font-bold text-center text-foreground mb-12">
          Our Values
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div variants={fadeIn} className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md border border-border">
            <Heart className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-3">Community</h3>
            <p className="text-muted-foreground">Fostering strong connections between customers and service providers.</p>
          </motion.div>
          <motion.div variants={fadeIn} className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md border border-border">
            <Star className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-3">Excellence</h3>
            <p className="text-muted-foreground">Committing to high standards in every service and interaction.</p>
          </motion.div>
          <motion.div variants={fadeIn} className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md border border-border">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-3">Innovation</h3>
            <p className="text-muted-foreground">Continuously improving our platform and services for a better experience.</p>
          </motion.div>
        </div>
      </section>

      <section className="mb-20">
        <motion.h2 variants={fadeIn} className="text-4xl font-bold text-center text-foreground mb-12">
          Our Impact
        </motion.h2>
        <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg shadow-md border border-border"
            >
              <stat.icon className="h-10 w-10 text-primary mb-3" />
              <p className="text-4xl font-bold text-foreground">{stat.value}</p>
              <p className="text-muted-foreground text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/*
      <section className="mb-20">
        <motion.h2 variants={fadeIn} className="text-4xl font-bold text-center text-foreground mb-12">
          Meet Our Team
        </motion.h2>
        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="flex flex-col items-center text-center bg-card rounded-lg shadow-lg p-8 border border-border"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-primary shadow-md"
              />
              <h3 className="text-2xl font-semibold text-foreground mb-2">{member.name}</h3>
              <p className="text-primary text-lg font-medium mb-4">{member.role}</p>
              <p className="text-muted-foreground text-base">{member.bio}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
      */}

      <section className="text-center">
        <motion.h2 variants={fadeIn} className="text-4xl font-bold text-foreground mb-6">
          Join Our Journey
        </motion.h2>
        <motion.p variants={fadeIn} className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Be a part of Themabinti's mission to revolutionize the service industry in Kenya. Whether you're a customer seeking quality services or a provider looking to grow your business, we welcome you.
        </motion.p>
        <motion.div variants={fadeIn}>
          <Link to="/register/seller">
            <Button size="lg" className="mr-4">Become a Service Provider</Button>
          </Link>
          <Link to="/services">
            <Button size="lg" variant="outline">Explore Services</Button>
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default AboutUs;

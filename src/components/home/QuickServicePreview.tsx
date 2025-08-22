import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, Service } from "@/types";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceCardSkeleton from "@/components/services/ServiceCardSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const fetchTrendingServices = async () => {
  const { data } = await api.get('/services', { 
    params: { 
      per_page: 6,
      sort: 'rating' // Get highest rated services
    } 
  });
  return (data as PaginatedResponse<Service>).data;
};

const QuickServicePreview = () => {
  const { data: trendingServices, isLoading } = useQuery<Service[]>({
    queryKey: ['trending-services'],
    queryFn: fetchTrendingServices,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Trending Services</h2>
          </div>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Discover the most popular and highly-rated services in your area
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ServiceCardSkeleton />
              </motion.div>
            ))
          ) : (
            trendingServices?.map((service, index) => (
              <motion.div key={service.id} variants={itemVariants}>
                <ServiceCard service={service} />
              </motion.div>
            ))
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Button size="lg" variant="outline" asChild className="group">
            <Link to="/services" className="gap-2">
              View All Services
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickServicePreview;
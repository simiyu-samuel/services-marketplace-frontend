import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, Service } from "@/types";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceCardSkeleton from "@/components/services/ServiceCardSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const fetchFeaturedServices = async () => {
  const { data } = await api.get('/services', { 
    params: { 
      per_page: 6,
      'filter[is_featured]': true,
      'filter[is_active]': true
    } 
  });
  return (data as PaginatedResponse<Service>).data;
};

const QuickServicePreview = () => {
  const { data: featuredServices, isLoading } = useQuery<Service[]>({
    queryKey: ['featured-services'],
    queryFn: fetchFeaturedServices,
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
    },
  };

  return (
    <section className="py-2 sm:py-4">
      <div className="container mx-auto px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-4">
            <Crown className="h-6 sm:h-8 w-6 sm:w-8 text-yellow-500" />
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Featured Services</h2>
            <Crown className="h-6 sm:h-8 w-6 sm:w-8 text-yellow-500" />
          </div>
          <p className="max-w-2xl mx-auto text-muted-foreground text-sm sm:text-lg px-4">
            Discover excellence with our handpicked, top-rated services
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ServiceCardSkeleton />
              </motion.div>
            ))
          ) : featuredServices && featuredServices.length > 0 ? (
            featuredServices?.map((service, index) => (
              <motion.div key={service.id} variants={itemVariants}>
                <ServiceCard service={service} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 sm:py-12 px-4">
              <Crown className="h-12 sm:h-16 w-12 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No Featured Services Yet</h3>
              <p className="text-muted-foreground text-sm sm:text-lg mb-4 sm:mb-6">
                Our team is curating the best services for you. Check back soon!
              </p>
              <Button size="lg" asChild>
                <Link to="/services">Browse All Services</Link>
              </Button>
            </div>
          )}
        </motion.div>

        {featuredServices && featuredServices.length > 0 && (
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
        )}
      </div>
    </section>
  );
};

export default QuickServicePreview;
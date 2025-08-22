import React from 'react';
import HeroSection from "@/components/home/HeroSection";
import BookAppointmentCTA from "@/components/home/BookAppointmentCTA";
import AdvancedServiceFilters from "@/components/home/AdvancedServiceFilters";
import QuickServicePreview from "@/components/home/QuickServicePreview";
import FeaturedServices from "@/components/home/FeaturedServices";
import RecentBlogPosts from "@/components/home/RecentBlogPosts";
import InteractiveCategories from "@/components/home/InteractiveCategories";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import StatsCounter from "@/components/home/StatsCounter";
import NewsletterSignup from "@/components/home/NewsletterSignup";

const Home: React.FC = () => {
  return (
    <div className="bg-background text-foreground font-sans overflow-x-hidden">
      <HeroSection />

      {/* Book Appointment CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <BookAppointmentCTA />
        </div>
      </section>

      {/* Advanced Service Filters */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Find Your Perfect Service</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
              Use our advanced filters to discover exactly what you're looking for
            </p>
          </div>
          <AdvancedServiceFilters />
        </div>
      </section>

      {/* Quick Service Preview */}
      <QuickServicePreview />

      {/* Interactive Service Categories */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 tracking-tight">Explore Our Categories</h2>
          <InteractiveCategories />
        </div>
      </section>

      {/* Featured Services */}
      <FeaturedServices />

      {/* Latest Blog Posts */}
      <RecentBlogPosts />

      {/* Testimonials */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 tracking-tight">What Our Clients Say</h2>
          <Testimonials />
        </div>
      </section>

      {/* Call-to-action sections */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <CallToAction />
        </div>
      </section>

      {/* Stats Counter Animation */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <StatsCounter />
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
};

export default Home;

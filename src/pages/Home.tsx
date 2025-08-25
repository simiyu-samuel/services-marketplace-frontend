import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; // Assuming LoadingSpinner is available

// Dynamically import components
const HeroSection = lazy(() => import('@/components/home/HeroSection'));
const BookAppointmentCTA = lazy(() => import('@/components/home/BookAppointmentCTA'));
const AdvancedServiceFilters = lazy(() => import('@/components/home/AdvancedServiceFilters'));
const QuickServicePreview = lazy(() => import('@/components/home/QuickServicePreview'));
const FeaturedServices = lazy(() => import('@/components/home/FeaturedServices'));
const RecentBlogPosts = lazy(() => import('@/components/home/RecentBlogPosts'));
const InteractiveCategories = lazy(() => import('@/components/home/InteractiveCategories'));
const Testimonials = lazy(() => import('@/components/home/Testimonials'));
const CallToAction = lazy(() => import('@/components/home/CallToAction'));
const StatsCounter = lazy(() => import('@/components/home/StatsCounter'));
const NewsletterSignup = lazy(() => import('@/components/home/NewsletterSignup'));
const GeneralBookingSection = lazy(() => import('@/components/home/GeneralBookingSection'));

const Home: React.FC = () => {
  return (
    <div className="bg-background text-foreground font-sans overflow-x-hidden">
      {/* Book Appointment CTA */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <Suspense fallback={<LoadingSpinner size="sm" />}>
            <BookAppointmentCTA />
          </Suspense>
        </div>
      </section>

      {/* Advanced Service Filters */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Find Your Perfect Service</h2>
      </div>
      {/* Quick Service Preview */}
      <QuickServicePreview />

      {/* Latest Blog Posts */}
      {/* Removed empty sections */}

      {/* Call-to-action sections */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Suspense fallback={<LoadingSpinner size="sm" />}>
            <CallToAction />
          </Suspense>
        </div>
      </section>

      {/* Stats Counter Animation */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <Suspense fallback={<LoadingSpinner size="sm" />}>
            <StatsCounter />
          </Suspense>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Suspense fallback={<LoadingSpinner size="sm" />}>
            <NewsletterSignup />
          </Suspense>
        </div>
      </section>

      {/* Placeholder for other components that might be loaded */}
      {/* <Suspense fallback={<LoadingSpinner size="sm" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<LoadingSpinner size="sm" />}>
        <FeaturedServices />
      </Suspense>
      <Suspense fallback={<LoadingSpinner size="sm" />}>
        <RecentBlogPosts />
      </Suspense>
      <Suspense fallback={<LoadingSpinner size="sm" />}>
        <InteractiveCategories />
      </Suspense>
      <Suspense fallback={<LoadingSpinner size="sm" />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<LoadingSpinner size="sm" />}>
        <GeneralBookingSection />
      </Suspense> */}
    </div>
  );
};

export default Home;

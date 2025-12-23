import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; // Assuming LoadingSpinner is available

// Dynamically import components
const BookAppointmentCTA = lazy(() => import('@/components/home/BookAppointmentCTA'));
const QuickServicePreview = lazy(() => import('@/components/home/QuickServicePreview'));
const RecentBlogPosts = lazy(() => import('@/components/home/RecentBlogPosts'));
const CallToAction = lazy(() => import('@/components/home/CallToAction'));
const StatsCounter = lazy(() => import('@/components/home/StatsCounter'));
const NewsletterSignup = lazy(() => import('@/components/home/NewsletterSignup'));

const Home: React.FC = () => {
  return (
    <div className="bg-background text-foreground font-sans overflow-x-hidden min-h-screen">
      {/* Book Appointment CTA */}
      <section className="py-1 sm:py-2 bg-background">
        <div className="container mx-auto px-2 sm:px-4">
          <Suspense fallback={<LoadingSpinner size="sm" />}>
            <BookAppointmentCTA />
          </Suspense>
        </div>
      </section>

      {/* Quick Service Preview - Now shows Featured Services */}
      <QuickServicePreview />

      {/* Latest Blog Posts */}
        <section className="py-1 sm:py-2 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-2 sm:px-4">
          <Suspense fallback={
            <div className="flex justify-center py-2">
              <LoadingSpinner size="lg" />
            </div>
          }>
            <RecentBlogPosts />
          </Suspense>
        </div>
      </section>
      {/* Removed empty sections */}

      {/* Call-to-action sections */}
      <section className="py-12 sm:py-24">
        <div className="container mx-auto px-2 sm:px-4">
          <Suspense fallback={<LoadingSpinner size="sm" />}>
            <CallToAction />
          </Suspense>
        </div>
      </section>

      {/* Stats Counter Animation */}
      <section className="py-12 sm:py-24 bg-muted/40">
        <div className="container mx-auto px-2 sm:px-4">
          <Suspense fallback={<LoadingSpinner size="sm" />}>
            <StatsCounter />
          </Suspense>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 sm:py-24">
        <div className="container mx-auto px-2 sm:px-4">
          <Suspense fallback={<LoadingSpinner size="sm" />}>
            <NewsletterSignup />
          </Suspense>
        </div>
      </section>

      {/* Placeholder for other components that might be loaded */}
    </div>
  );
};

export default Home;

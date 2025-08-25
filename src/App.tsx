import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import RouteTransitions from "./components/ui/RouteTransitions";
import AuthGuard from "./components/auth/AuthGuard";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const CreateAdminService = React.lazy(() => import("./pages/admin/CreateAdminService"));
const EditAdminService = React.lazy(() => import("./pages/admin/EditAdminService"));

// Layouts
const MainLayout = React.lazy(() => import("./components/layout/MainLayout"));
const PremiumLayout = React.lazy(() => import("./components/layout/PremiumLayout"));
const ImprovedLayout = React.lazy(() => import("./components/layout/ImprovedLayout"));
const ImprovedDashboardLayout = React.lazy(() => import("./components/dashboard/ImprovedDashboardLayout"));
const AdminLayout = React.lazy(() => import("./components/layout/AdminLayout"));

// Auth
const AdminRoute = React.lazy(() => import("./components/auth/AdminRoute"));
const ProtectedRoute = React.lazy(() => import("./components/auth/ProtectedRoute"));
const AuthGuard = React.lazy(() => import("./components/auth/AuthGuard"));


// Public Pages
const Home = React.lazy(() => import("./pages/Home"));
const Services = React.lazy(() => import("./pages/Services"));
const ServiceDetails = React.lazy(() => import("./pages/ServiceDetails"));
const SellerProfile = React.lazy(() => import("./pages/SellerProfile"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogDetails = React.lazy(() => import("./pages/BlogDetails"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const PremiumHeader = React.lazy(() => import("./components/layout/PremiumHeader"));
const AboutUs = React.lazy(() => import("./pages/AboutUs"));
const RegisterCustomer = React.lazy(() => import("./pages/RegisterCustomer"));
const RegisterSeller = React.lazy(() => import("./pages/RegisterSeller"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./pages/TermsOfService"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = React.lazy(() => import("./pages/VerifyEmail"));
const SellerOnboardingPayment = React.lazy(() => import("./pages/SellerOnboardingPayment")); // New import
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Dashboard Pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const MyBookings = React.lazy(() => import("./pages/dashboard/MyBookings"));
const MyServices = React.lazy(() => import("./pages/dashboard/MyServices"));
const CreateService = React.lazy(() => import("./pages/dashboard/CreateService"));
const EditService = React.lazy(() => import("./pages/dashboard/EditService"));
const Profile = React.lazy(() => import("./pages/dashboard/Profile"));
const Settings = React.lazy(() => import("./pages/dashboard/Settings"));
const PaymentHistory = React.lazy(() => import("./pages/dashboard/PaymentHistory"));
const Analytics = React.lazy(() => import("./pages/dashboard/Analytics")); // Import Analytics component

// Admin Pages
const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const AdminUsers = React.lazy(() => import("./pages/admin/Users"));
const AdminServices = React.lazy(() => import("./pages/admin/Services"));
const AdminBookings = React.lazy(() => import("./pages/admin/Bookings"));
const AdminGeneralBookings = React.lazy(() => import("./pages/admin/AdminGeneralBookings")); // Import the new AdminGeneralBookings page
const AdminSettings = React.lazy(() => import("./pages/admin/Settings"));
const AdminPayments = React.lazy(() => import("./pages/admin/Payments"));
const AdminContacts = React.lazy(() => import("./pages/admin/Contacts"));
const AdminBlog = React.lazy(() => import("./pages/admin/Blog"));
const CreateBlogPost = React.lazy(() => import("./pages/admin/CreateBlogPost"));
const EditBlogPost = React.lazy(() => import("./pages/admin/EditBlogPost"));
const PackageUpgrade = React.lazy(() => import("./pages/PackageUpgrade"));
const AdminMyServices = React.lazy(() => import("./pages/admin/MyServices"));


const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouteTransitions>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner size="lg" text="Loading application..." />
            </div>
          }>
            <Routes location={location}>
            {/* Public Routes */}
            <Route element={<PremiumLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/sellers/:id" element={<SellerProfile />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/customer" element={<RegisterCustomer />} />
              <Route path="/register/seller" element={<RegisterSeller />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/seller-onboarding/payment" element={<SellerOnboardingPayment />} /> {/* New route */}
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* User Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<ImprovedDashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="bookings" element={<MyBookings />} />
                  <Route path="services" element={<MyServices />} />
                  <Route path="services/new" element={<CreateService />} />
                  <Route path="services/:id/edit" element={<EditService />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="payments" element={<PaymentHistory />} />
                  <Route path="analytics" element={<Analytics />} /> {/* Add Analytics route */}
                  <Route path="seller/package-upgrade" element={<PackageUpgrade />} />
                </Route>
              </Route>

            {/* Admin Routes */}
<Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="general-bookings" element={<AdminGeneralBookings />} /> {/* New Admin General Bookings route */}
                <Route path="payments" element={<AdminPayments />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="blog/new" element={<CreateBlogPost />} />
                <Route path="blog/edit/:id" element={<EditBlogPost />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="my-services" element={<AdminMyServices />} />  {/* Add this line */}
                <Route path="my-services/create" element={<CreateAdminService />} /> {/* Add this line */}
                <Route path="my-services/:id/edit" element={<EditAdminService />} /> {/* Add this line */}
              </Route>
            </Route>
            </Routes>
          </Suspense>
        </RouteTransitions>
      </AuthProvider>
    </ErrorBoundary>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

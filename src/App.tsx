import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RouteTransitions from "./components/ui/RouteTransitions";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import MainLayout from "./components/layout/MainLayout";
import PremiumLayout from "./components/layout/PremiumLayout";
import AdminLayout from "./components/layout/AdminLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

// Auth
import AdminRoute from "./components/auth/AdminRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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

// Admin Pages
const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const AdminUsers = React.lazy(() => import("./pages/admin/Users"));
const AdminServices = React.lazy(() => import("./pages/admin/Services"));
const AdminBookings = React.lazy(() => import("./pages/admin/Bookings"));
const AdminSettings = React.lazy(() => import("./pages/admin/Settings"));
const AdminPayments = React.lazy(() => import("./pages/admin/Payments"));
const AdminContacts = React.lazy(() => import("./pages/admin/Contacts"));
const AdminBlog = React.lazy(() => import("./pages/admin/Blog"));
const CreateBlogPost = React.lazy(() => import("./pages/admin/CreateBlogPost"));
const EditBlogPost = React.lazy(() => import("./pages/admin/EditBlogPost"));
const PackageUpgrade = React.lazy(() => import("./pages/PackageUpgrade"));

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  return (
    <AuthProvider>
      <RouteTransitions>
        <Suspense fallback={<div>Loading...</div>}>
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
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* User Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="bookings" element={<MyBookings />} />
                  <Route path="services" element={<MyServices />} />
                  <Route path="services/new" element={<CreateService />} />
                  <Route path="services/:id/edit" element={<EditService />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="payments" element={<PaymentHistory />} />
                  <Route path="seller/package-upgrade" element={<PackageUpgrade />} />
                </Route>
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="blog/new" element={<CreateBlogPost />} />
                <Route path="blog/edit/:id" element={<EditBlogPost />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </RouteTransitions>
    </AuthProvider>
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

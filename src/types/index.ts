import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  errors: {
    [key: string]: string[];
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  user_type: 'customer' | 'seller' | 'admin';
  is_active?: boolean;
  profile_image?: string | null;
  profile_image_url?: string; // Keep for AuthContext compatibility for now
  seller_package?: 'basic' | 'standard' | 'premium' | null;
  package_expiry_date?: string | null;
  pending_seller_package?: 'basic' | 'standard' | 'premium' | null; // Added for seller registration flow
  email_verified_at?: string | null;
  location?: string | null;
  bio?: string | null;
  phone_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null; // Add this line
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
  token_type: string;
  needs_seller_payment?: boolean; // Added for seller registration flow
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
  user_type: 'customer' | 'seller';
  seller_package?: 'basic' | 'standard' | 'premium';
}

export interface ChangePasswordPayload {
  current_password?: string;
  password: string;
  password_confirmation: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  subcategory:string;
  price: string;
  duration: number;
  location: string;
  is_mobile: boolean;
  media_files: string[];
  user: Pick<User, 'id' | 'name' | 'profile_image' | 'phone_number'>;
  rating?: number;
  review_count?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  category: string;
  author?: {
    name: string;
    profile_image?: string | null;
    bio?: string;
  };
  published_at: string;
  reading_time: number; // in minutes
  status?: 'draft' | 'published';
}

export interface Booking {
  id: number;
  service_id: number;
  customer_id: number;
  seller_id: number;
  appointment_date: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  total_amount: string;
  notes?: string | null;
  service: Service;
  customer: User;
  seller: User;
}

export interface Review {
  id: number;
  sellerId: number;
  rating: number;
  comment: string;
  created_at: string;
  customer: Pick<User, 'name' | 'profile_image'>;
}

export interface Payment {
  id: number;
  user_id: number;
  amount: string;
  phone_number: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_type: 'seller_registration' | 'package_upgrade' | 'service_payment';
  checkout_request_id: string;
  mpesa_receipt_number?: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'responded';
    admin_response?: string | null;
    created_at: string;
    updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
  per_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

// Admin Dashboard Types
export interface AdminDashboardStats {
  total_users: number;
  total_customers: number;
  total_sellers: number;
  active_sellers: number;
  total_services: number;
  active_services: number;
  pending_services: number;
  total_appointments: number;
  pending_appointments: number;
  completed_appointments: number;
  total_revenue: string;
  monthly_revenue: string;
  unread_contacts: number;
}

export interface RevenueTrend {
  month: string;
  total_amount: string;
}

export interface AppointmentStatusBreakdown {
  status: string;
  count: number;
}

export interface AdminDashboardCharts {
  revenue_trend_last_6_months: RevenueTrend[];
  appointment_status_breakdown: AppointmentStatusBreakdown[];
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  charts: AdminDashboardCharts;
}

// User Dashboard Types
export interface SellerDashboardStats {
  active_services_count: number;
  pending_bookings_count: number;
  completed_bookings_count: number;
  total_earnings_last_30_days: number;
  all_time_earnings: number;
  monthly_earnings_trend: { month: string; total_amount: number }[];
}

export interface CustomerDashboardStats {
  total_appointments_count: number;
  upcoming_appointments_count: number;
  completed_appointments_count: number;
  cancelled_appointments_count: number;
  total_amount_spent: number; // Changed from string to number based on sample
  recent_appointments: Booking[]; // Added recent_appointments
}

export type DashboardStats = SellerDashboardStats | CustomerDashboardStats;

// Define UserPackageInfo based on the feedback and existing User type
export interface UserPackageInfo {
  seller_package: 'basic' | 'standard' | 'premium' | null;
  package_expiry_date: string | null;
  phone_number: string | null;
  name?: string;
  email?: string;
  user_type?: 'customer' | 'seller';
  // Define the structure of the package configs
  package_details?: {
    price: number;
    services_limit: number | null;
    photos_per_service: number;
    video_per_service: number | null;
    listing_visibility: string;
    support_level: string;
  } | null;
}

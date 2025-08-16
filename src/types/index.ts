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
  email_verified_at?: string | null;
  location?: string | null;
  bio?: string | null;
  phone_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
  token_type: string;
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
  author: Pick<User, 'name' | 'profile_image'>;
  published_at: string;
  reading_time: number; // in minutes
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

// Updated to match the new flat pagination structure from the API
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
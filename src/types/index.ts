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
  subcategory: string;
  price: string; // Changed from number
  duration: number; // in minutes
  location: string;
  is_mobile: boolean;
  media_files: string[]; // Changed from media: MediaFile[]
  user: Pick<User, 'id' | 'name' | 'profile_image' | 'phone_number'>; // Changed from seller
  rating?: number; // Made optional
  review_count?: number; // Made optional
  is_active: boolean;
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
  service: Pick<Service, 'id' | 'title' | 'price'>;
  customer: Pick<User, 'id' | 'name'>;
  seller: Pick<User, 'id' | 'name'>;
  booking_date: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

export interface Review {
  id: number;
  sellerId: number;
  rating: number;
  comment: string;
  created_at: string;
  customer: Pick<User, 'name' | 'profile_image'>;
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
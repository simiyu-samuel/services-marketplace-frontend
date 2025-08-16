export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  user_type: 'customer' | 'seller' | 'admin';
  is_active?: boolean;
  profile_image?: string | null; // Changed from profile_image_url
  profile_image_url?: string; // Keep for AuthContext compatibility for now
  seller_package?: 'basic' | 'standard' | 'premium';
  package_expiry_date?: string;
  email_verified_at?: string;
  location?: string;
  bio?: string;
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
  author: Pick<User, 'name' | 'profile_image_url'>;
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
  customer: Pick<User, 'name' | 'profile_image_url'>;
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
export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  user_type: 'customer' | 'seller' | 'admin';
  is_active: boolean;
  profile_image_url?: string;
  seller_package?: 'basic' | 'standard' | 'premium';
  package_expiry_date?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
  token_type: string;
}

export interface MediaFile {
  id: number;
  url: string;
  type: 'image' | 'video';
}

export interface Service {
  id: number;
  title: string;
  category: string;
  price: number;
  duration: number; // in minutes
  location: string;
  is_mobile: boolean;
  media: MediaFile[];
  seller: Pick<User, 'id' | 'name' | 'profile_image_url'>;
  rating: number;
  review_count: number;
  description: string;
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
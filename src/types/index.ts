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
}
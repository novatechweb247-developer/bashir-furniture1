export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  images: string[];
  category: string;
  availability: 'In Stock' | 'Made to Order' | 'Out of Stock';
  dimensions?: string;
  materials?: string;
  colours?: string[];
  featured?: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  item_count?: number;
}

export interface SiteSettings {
  id?: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  company_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  about_text: string;
  social_links: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface Enquiry {
  id: string;
  product_id?: string;
  product_name?: string;
  customer_name: string;
  phone: string;
  email?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Completed';
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

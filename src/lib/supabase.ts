import { createClient } from '@supabase/supabase-js';
import { Product, Category, SiteSettings, Enquiry } from '../types';

// Keep this site connected to the Bashir Furniture Supabase project.
// Avoid an accidental Vercel environment variable pointing the admin login
// at a different project's authentication service.
const supabaseUrl = 'https://efdtxbbhggdcohigelmw.supabase.co';
const supabaseKey = 'sb_publishable_FYuv4ejFnjYOOg8i29xD5w_3oKyytaD';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey && !supabaseKey.includes('placeholder'));

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initial Mock Data for robust fallback & immediate rich preview
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Sofas & Couches',
    slug: 'sofas-and-couches',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    description: 'Luxurious velvet, leather, and fabric sectional sofas crafted for ultimate comfort.'
  },
  {
    id: 'cat-2',
    name: 'Beds & Bedroom',
    slug: 'beds-and-bedroom',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    description: 'Master bed frames, upholstered headboards, nightstands, and wardrobes.'
  },
  {
    id: 'cat-3',
    name: 'Dining Tables & Chairs',
    slug: 'dining-tables-and-chairs',
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
    description: 'Solid mahogany and oak dining suites designed for family gatherings.'
  },
  {
    id: 'cat-4',
    name: 'Wardrobes & Storage',
    slug: 'wardrobes-and-storage',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    description: 'Spacious fitted wardrobes, chest of drawers, and modern console units.'
  },
  {
    id: 'cat-5',
    name: 'TV Stands & Cabinets',
    slug: 'tv-stands-and-cabinets',
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80',
    description: 'Sleek entertainment centers and display cabinets with integrated lighting.'
  },
  {
    id: 'cat-6',
    name: 'Office Furniture',
    slug: 'office-furniture',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    description: 'Executive desks, ergonomic chairs, and conference tables for modern workspaces.'
  },
  {
    id: 'cat-7',
    name: 'Custom-Made Furniture',
    slug: 'custom-made-furniture',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    description: 'Tailored furniture built exactly to your dimensions, wood finish, and fabric preference.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'The Royal Velvet L-Sectional Sofa',
    description: 'Experience supreme elegance with our handcrafted L-sectional sofa. Upholstered in premium stain-resistant emerald green velvet with high-density resilient foam cushioning and solid teak wood legs.',
    price: 850000,
    discount_price: 780000,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Sofas & Couches',
    availability: 'In Stock',
    dimensions: 'W 300cm x D 180cm x H 85cm',
    materials: 'Emerald Velvet, High-Density Foam, Teak Wood',
    colours: ['Emerald Green', 'Royal Navy', 'Charcoal Grey', 'Warm Beige'],
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Majestic King Size Upholstered Bed',
    description: 'Transform your bedroom into a five-star hotel suite. Features a grand tufted headboard with LED ambient backlighting and hydraulic under-bed storage.',
    price: 950000,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Beds & Bedroom',
    availability: 'In Stock',
    dimensions: 'King: 180cm x 200cm mattress space',
    materials: 'Italian Leatherette, Seasoned Mahogany Frame',
    colours: ['Off-White', 'Dark Espresso', 'Pearl Grey'],
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Grand 8-Seater Mahogany Dining Suite',
    description: 'Immaculately polished solid mahogany dining table accompanied by 8 ergonomically contoured leather chairs. Built for timeless family banquets.',
    price: 1250000,
    discount_price: 1150000,
    images: [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617806118233-18e1c0c684d0?auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Dining Tables & Chairs',
    availability: 'Made to Order',
    dimensions: 'L 240cm x W 110cm x H 78cm',
    materials: 'Solid Nigerian Mahogany, Genuine Cowhide Leather',
    colours: ['Dark Walnut', 'Natural Teak', 'Honey Oak'],
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Executive L-Shaped Office Desk & Credenza',
    description: 'Command respect in your boardroom or home office. Crafted from rich walnut veneer with integrated cable management and soft-close drawers.',
    price: 650000,
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Office Furniture',
    availability: 'In Stock',
    dimensions: 'Desk: 180cm x 90cm, Return: 140cm',
    materials: 'Walnut Wood Veneer, Brushed Steel',
    colours: ['Rich Walnut', 'Natural Oak'],
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Nordic Oak Media Console & TV Unit',
    description: 'Clean lines meet practical storage. Features slatted wooden louvered doors for remote control signal pass-through and ample interior shelving.',
    price: 320000,
    images: [
      'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'TV Stands & Cabinets',
    availability: 'In Stock',
    dimensions: 'W 200cm x D 45cm x H 55cm',
    materials: 'Solid Oak & Veneer',
    colours: ['Natural Oak', 'Smoked Walnut'],
    featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: '6-Door Fitted Mirrored Wardrobe',
    description: 'Maximise your clothing storage with floor-to-ceiling elegance. Includes hanging rails, compartmentalized shoe racks, and full-length dressing mirrors.',
    price: 880000,
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Wardrobes & Storage',
    availability: 'Made to Order',
    dimensions: 'W 280cm x D 60cm x H 220cm',
    materials: 'HDF Wood, Beveled Glass Mirrors',
    colours: ['Pure White', 'Matte Grey', 'Teak Woodgrain'],
    featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: 'Bespoke Solid Wood Coffee Table Set',
    description: 'A striking centerpiece for your living area. Consists of a primary coffee table and nesting side table crafted from live-edge wood with hairpin metal legs.',
    price: 180000,
    discount_price: 150000,
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Custom-Made Furniture',
    availability: 'In Stock',
    dimensions: 'Diameter 90cm x H 45cm',
    materials: 'Live-Edge Mahogany, Powder-Coated Steel',
    colours: ['Natural Live Edge', 'Ebony Stain'],
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: 'Contemporary Velvet Accent Armchair',
    description: 'Add a splash of luxury to any corner. Gold-finished stainless steel base paired with plush curved channel tufting.',
    price: 290000,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Sofas & Couches',
    availability: 'In Stock',
    dimensions: 'W 85cm x D 80cm x H 88cm',
    materials: 'Mustard Velvet, Gold Stainless Steel',
    colours: ['Mustard Yellow', 'Blush Pink', 'Forest Green'],
    featured: false,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  hero_title: 'Handcrafted Elegance For Modern Living Spaces',
  hero_subtitle: 'Discover bespoke Nigerian craftsmanship, premium imported materials, and timeless furniture designs tailored to your sophisticated lifestyle.',
  hero_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=85',
  company_name: 'Bashir Furniture',
  phone: '+234 803 123 4567',
  whatsapp: '+2348031234567',
  email: 'info@bashirfurniture.com',
  address: 'Plot 12, Ahmadu Bello Way, Victoria Island, Lagos, Nigeria',
  about_text: 'Founded on a dedication to uncompromising artistry and structural integrity, Bashir Furniture creates masterpieces that transform houses into cherished homes. Every joint is meticulously joined, every fabric carefully selected, and every finish polished to perfection.',
  social_links: {
    instagram: 'https://instagram.com/bashirfurniture',
    facebook: 'https://facebook.com/bashirfurniture',
    twitter: 'https://twitter.com/bashirfurniture'
  }
};

// Local storage helper wrappers for offline / standalone mode
const LOCAL_KEYS = {
  PRODUCTS: 'bashir_furniture_products',
  CATEGORIES: 'bashir_furniture_categories',
  SETTINGS: 'bashir_furniture_settings',
  ENQUIRIES: 'bashir_furniture_enquiries',
  CART: 'bashir_furniture_cart'
};

export function getLocalProducts(): Product[] {
  const data = localStorage.getItem(LOCAL_KEYS.PRODUCTS);
  if (!data) {
    localStorage.setItem(LOCAL_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(data);
}

export function saveLocalProducts(products: Product[]) {
  localStorage.setItem(LOCAL_KEYS.PRODUCTS, JSON.stringify(products));
}

export function getLocalCategories(): Category[] {
  const data = localStorage.getItem(LOCAL_KEYS.CATEGORIES);
  if (!data) {
    localStorage.setItem(LOCAL_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  return JSON.parse(data);
}

export function saveLocalCategories(categories: Category[]) {
  localStorage.setItem(LOCAL_KEYS.CATEGORIES, JSON.stringify(categories));
}

export function getLocalSettings(): SiteSettings {
  const data = localStorage.getItem(LOCAL_KEYS.SETTINGS);
  if (!data) {
    localStorage.setItem(LOCAL_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  }
  return JSON.parse(data);
}

export function saveLocalSettings(settings: SiteSettings) {
  localStorage.setItem(LOCAL_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getLocalEnquiries(): Enquiry[] {
  const data = localStorage.getItem(LOCAL_KEYS.ENQUIRIES);
  if (!data) {
    const initial: Enquiry[] = [
      {
        id: 'enq-1',
        product_id: 'prod-1',
        product_name: 'The Royal Velvet L-Sectional Sofa',
        customer_name: 'Alhaji Ibrahim Musa',
        phone: '+234 802 987 6543',
        email: 'ibrahim@example.com',
        message: 'I would like to know if this sofa can be delivered to Abuja within 5 days.',
        status: 'New',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'enq-2',
        product_id: 'prod-3',
        product_name: 'Grand 8-Seater Mahogany Dining Suite',
        customer_name: 'Mrs. Chioma Adeleke',
        phone: '+234 809 111 2233',
        email: 'chioma@example.com',
        message: 'Do you offer custom dimensions for a 10-seater version?',
        status: 'Contacted',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
    localStorage.setItem(LOCAL_KEYS.ENQUIRIES, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
}

export function saveLocalEnquiries(enquiries: Enquiry[]) {
  localStorage.setItem(LOCAL_KEYS.ENQUIRIES, JSON.stringify(enquiries));
}

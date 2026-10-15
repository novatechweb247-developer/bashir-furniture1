import React, { useState, useEffect } from 'react';
import { Product, Category, SiteSettings, Enquiry, CartItem } from './types';
import { 
  getLocalProducts, saveLocalProducts,
  getLocalCategories, saveLocalCategories,
  getLocalSettings, saveLocalSettings,
  getLocalEnquiries, saveLocalEnquiries,
  supabase, isSupabaseConfigured
} from './lib/supabase';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ShopView } from './components/ShopView';
import { CollectionsView } from './components/CollectionsView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Award } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(getLocalSettings());
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bashir_furniture_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [shopCategoryFilter, setShopCategoryFilter] = useState<string>('All');

  // Initialize Data
  useEffect(() => {
    const loadData = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: prodData } = await supabase.from('products').select('*');
          if (prodData && prodData.length > 0) {
            setProducts(prodData);
          } else {
            setProducts(getLocalProducts());
          }

          const { data: catData } = await supabase.from('categories').select('*');
          if (catData && catData.length > 0) {
            setCategories(catData);
          } else {
            setCategories(getLocalCategories());
          }

          const { data: setDa } = await supabase.from('site_settings').select('*').single();
          if (setDa) {
            setSettings(setDa);
          } else {
            setSettings(getLocalSettings());
          }

          const { data: enqDa } = await supabase.from('enquiries').select('*');
          if (enqDa) {
            setEnquiries(enqDa);
          } else {
            setEnquiries(getLocalEnquiries());
          }
        } else {
          setProducts(getLocalProducts());
          setCategories(getLocalCategories());
          setSettings(getLocalSettings());
          setEnquiries(getLocalEnquiries());
        }
      } catch (e) {
        console.warn('Using local storage fallback due to network or Supabase error:', e);
        setProducts(getLocalProducts());
        setCategories(getLocalCategories());
        setSettings(getLocalSettings());
        setEnquiries(getLocalEnquiries());
      }
    };

    loadData();
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('bashir_furniture_cart', JSON.stringify(cart));
  }, [cart]);

  // Save Products to LocalStorage on change
  useEffect(() => {
    if (products.length > 0) saveLocalProducts(products);
  }, [products]);

  // Save Categories to LocalStorage on change
  useEffect(() => {
    if (categories.length > 0) saveLocalCategories(categories);
  }, [categories]);

  // Save Settings to LocalStorage on change
  useEffect(() => {
    if (settings) saveLocalSettings(settings);
  }, [settings]);

  // Save Enquiries to LocalStorage on change
  useEffect(() => {
    if (enquiries.length > 0) saveLocalEnquiries(enquiries);
  }, [enquiries]);

  // Cart Functions
  const handleAddToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity, selectedColor }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, delta: number, color?: string) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedColor === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeCartItem = (productId: string, color?: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedColor === color)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleCategorySelect = (catName: string) => {
    setShopCategoryFilter(catName);
    setCurrentTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderEnquirySubmit = (orderData: { customerName: string; phone: string; address: string; notes: string }) => {
    const newEnquiry: Enquiry = {
      id: 'enq-' + Date.now(),
      customer_name: orderData.customerName,
      phone: orderData.phone,
      message: `Order / Enquiry. Address: ${orderData.address}. Notes: ${orderData.notes}`,
      status: 'New',
      created_at: new Date().toISOString()
    };
    setEnquiries([newEnquiry, ...enquiries]);
  };

  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#2C2825]">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        settings={settings}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1">
        {currentTab === 'home' && (
          <div>
            <Hero
              settings={settings}
              onShopClick={() => {
                setShopCategoryFilter('All');
                setCurrentTab('shop');
              }}
              onCollectionsClick={() => setCurrentTab('collections')}
            />

            {/* Category Grid Section */}
            <CategoryGrid
              categories={categories}
              onSelectCategory={handleCategorySelect}
            />

            {/* Featured Products Section */}
            <section className="py-20 bg-white border-t border-stone-200/60">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#B38F2D] font-bold block mb-2">
                      Handcrafted Masterpieces
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2825]">
                      Featured Furniture
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setShopCategoryFilter('All');
                      setCurrentTab('shop');
                    }}
                    className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-[#2C2825] hover:text-[#8C6D24] transition-colors group"
                  >
                    View Entire Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(prod) => handleAddToCart(prod, 1)}
                      onViewDetails={(prod) => setSelectedProduct(prod)}
                      whatsappNumber={settings.whatsapp}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Custom Furniture Banner */}
            <section className="py-24 bg-[#1A1715] text-white relative overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-30">
                <img
                  src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1600&q=80"
                  alt="Custom Workshop"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold tracking-wider uppercase inline-block">
                  Bespoke Woodwork & Upholstery
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold max-w-2xl mx-auto leading-tight">
                  Have A Custom Design In Mind?
                </h2>
                <p className="text-stone-300 text-base max-w-xl mx-auto">
                  Our master craftsmen can build custom sofas, dining tables, and wardrobes tailored precisely to your room dimensions, wood species, and fabric palette.
                </p>
                <div>
                  <button
                    onClick={() => setCurrentTab('contact')}
                    className="px-8 py-4 rounded-full bg-[#D4AF37] text-stone-950 font-semibold hover:bg-[#E5C158] transition-all shadow-lg"
                  >
                    Request Custom Consultation
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentTab === 'shop' && (
          <ShopView
            products={products}
            categories={categories}
            onAddToCart={(prod) => handleAddToCart(prod, 1)}
            onViewDetails={(prod) => setSelectedProduct(prod)}
            whatsappNumber={settings.whatsapp}
            initialCategory={shopCategoryFilter}
          />
        )}

        {currentTab === 'collections' && (
          <CollectionsView
            onExploreCategory={handleCategorySelect}
          />
        )}

        {currentTab === 'about' && (
          <AboutView settings={settings} />
        )}

        {currentTab === 'contact' && (
          <ContactView settings={settings} />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            products={products}
            setProducts={setProducts}
            categories={categories}
            setCategories={setCategories}
            settings={settings}
            setSettings={setSettings}
            enquiries={enquiries}
            setEnquiries={setEnquiries}
          />
        )}
      </main>

      <Footer settings={settings} setCurrentTab={(tab) => {
        setCurrentTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(prod, qty, color) => handleAddToCart(prod, qty, color)}
          whatsappNumber={settings.whatsapp}
          allProducts={products}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateCartQuantity}
        removeItem={removeCartItem}
        clearCart={clearCart}
        settings={settings}
        onSubmitEnquiry={handleOrderEnquirySubmit}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        onNavigateShopWithQuery={(q) => {
          setShopCategoryFilter('All');
          setCurrentTab('shop');
        }}
      />
    </div>
  );
}

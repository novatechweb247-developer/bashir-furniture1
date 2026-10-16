import React, { useState } from 'react';
import { Product, Category, SiteSettings, Enquiry } from '../types';
import { 
  Package, LayoutGrid, Settings, MessageSquare, Plus, Edit, Trash2, 
  Save, X, ShieldAlert, LogOut, CheckCircle2, TrendingUp, DollarSign, Users, Sparkles
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminDashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  enquiries: Enquiry[];
  setEnquiries: React.Dispatch<React.SetStateAction<Enquiry[]>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  setProducts,
  categories,
  setCategories,
  settings,
  setSettings,
  enquiries,
  setEnquiries
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'settings' | 'enquiries'>('overview');

  // Product Form Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Category Form Modal State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Settings State form
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [uploadingImage, setUploadingImage] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return null;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Please choose an image smaller than 10 MB.');
      return null;
    }
    setUploadingImage(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
      const { error } = await supabase.storage.from('bashir-images').upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from('bashir-images').getPublicUrl(path);
      return data.publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed. Please make sure you are signed in and try again.');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!isSupabaseConfigured) {
      setLoginError('Admin sign-in is disabled because Supabase is not configured. Configure the public Supabase URL and publishable key first.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        setLoginError(error?.message || 'Unable to sign in. Check your credentials.');
        return;
      }

      const { data: membership, error: membershipError } = await supabase
        .from('bashir_admin_users')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (membershipError || !membership) {
        await supabase.auth.signOut();
        setLoginError('This account is not authorized to manage Bashir Furniture.');
        return;
      }

      setIsAuthenticated(true);
    } catch {
      setLoginError('Sign-in failed. Check your connection and try again.');
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
  };

  // Product Handlers
  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imagesStr = formData.get('images') as string;
    const images = imagesStr ? imagesStr.split(',').map(s => s.trim()).filter(Boolean) : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'];

    const productData: Product = {
      id: editingProduct ? editingProduct.id : 'prod-' + Date.now(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      discount_price: formData.get('discount_price') ? Number(formData.get('discount_price')) : undefined,
      images,
      category: formData.get('category') as string,
      availability: formData.get('availability') as any,
      dimensions: formData.get('dimensions') as string,
      materials: formData.get('materials') as string,
      colours: (formData.get('colours') as string).split(',').map(s => s.trim()).filter(Boolean),
      featured: formData.get('featured') === 'true',
      created_at: editingProduct?.created_at || new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('bashir_products').upsert(productData);
      if (error) {
        alert('Could not save product. ' + error.message);
        return;
      }
    }
    setProducts(prev => editingProduct
      ? prev.map(p => p.id === productData.id ? productData : p)
      : [productData, ...prev]);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('bashir_products').delete().eq('id', id);
      if (error) {
        alert('Could not delete product. ' + error.message);
        return;
      }
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Category Handlers
  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const catData: Category = {
      id: editingCategory ? editingCategory.id : 'cat-' + Date.now(),
      name: formData.get('name') as string,
      slug: (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
      image: formData.get('image') as string,
      description: formData.get('description') as string,
    };

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('bashir_categories').upsert(catData);
      if (error) {
        alert('Could not save category. ' + error.message);
        return;
      }
    }
    setCategories(prev => editingCategory
      ? prev.map(c => c.id === catData.id ? catData : c)
      : [...prev, catData]);
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('bashir_categories').delete().eq('id', id);
      if (error) {
        alert('Could not delete category. ' + error.message);
        return;
      }
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Settings Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextSettings = { ...settingsForm, id: 'main' };
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('bashir_site_settings').upsert(nextSettings);
      if (error) {
        alert('Could not save site settings. ' + error.message);
        return;
      }
    }
    setSettings(nextSettings);
    alert('Site settings updated successfully!');
  };

  // Enquiry Status Update
  const updateEnquiryStatus = async (id: string, status: 'New' | 'Contacted' | 'Completed') => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('bashir_enquiries').update({ status }).eq('id', id);
      if (error) {
        alert('Could not update enquiry. ' + error.message);
        return;
      }
    }
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-[#FBF9F5] py-24 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#2C2825] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto font-serif text-2xl font-bold shadow">
              BF
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#2C2825]">Admin Portal Sign In</h2>
            <p className="text-stone-500 text-xs">
              Authorized administrators only. Manage catalog, pricing, and customer enquiries.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bashirfurniture.com"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#2C2825] text-white font-semibold hover:bg-[#3E3834] transition-colors shadow-md text-sm"
            >
              Sign In to Dashboard
            </button>
          </form>


        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Top Banner */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2C2825] text-[#D4AF37] flex items-center justify-center font-serif text-xl font-bold">
              BF
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#2C2825]">Admin Dashboard</h1>
              <p className="text-stone-500 text-xs">Managing Bashir Furniture Catalog & Enquiries</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors text-xs font-semibold flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'products', label: 'Products Management', icon: Package },
            { id: 'categories', label: 'Categories', icon: LayoutGrid },
            { id: 'enquiries', label: 'Customer Enquiries', icon: MessageSquare },
            { id: 'settings', label: 'Site Settings & Hero', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#2C2825] text-white shadow-md'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4 text-[#D4AF37]" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-50 text-[#D4AF37]">
                  <Package className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Total Products</p>
                  <h3 className="font-serif text-3xl font-bold text-[#2C2825] mt-1">{products.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
                  <LayoutGrid className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Categories</p>
                  <h3 className="font-serif text-3xl font-bold text-[#2C2825] mt-1">{categories.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Customer Enquiries</p>
                  <h3 className="font-serif text-3xl font-bold text-[#2C2825] mt-1">{enquiries.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-purple-50 text-purple-600">
                  <DollarSign className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Currency</p>
                  <h3 className="font-serif text-3xl font-bold text-[#2C2825] mt-1">Naira (₦)</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#2C2825]">Recent Enquiries</h3>
              <div className="space-y-4">
                {enquiries.slice(0, 5).map((enq) => (
                  <div key={enq.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#2C2825]">{enq.customer_name}</span>
                        <span className="text-xs text-stone-400">({enq.phone})</span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">{enq.message}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      enq.status === 'New' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {enq.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products Management */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl font-bold text-[#2C2825]">Products Catalogue</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="px-5 py-3 rounded-xl bg-[#2C2825] text-white font-semibold text-xs flex items-center gap-2 shadow hover:bg-[#3E3834] transition-colors"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" /> Add New Product
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-wider text-stone-600">
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (₦)</th>
                      <th className="p-4">Availability</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-stone-50/50">
                        <td className="p-4 flex items-center gap-3">
                          <img src={prod.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <span className="font-bold text-[#2C2825] block">{prod.name}</span>
                            <span className="text-xs text-stone-400 line-clamp-1">{prod.description}</span>
                          </div>
                        </td>
                        <td className="p-4 text-stone-600">{prod.category}</td>
                        <td className="p-4 font-semibold text-[#2C2825]">
                          ₦{(prod.discount_price || prod.price).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            prod.availability === 'In Stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {prod.availability}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setIsProductModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Categories */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl font-bold text-[#2C2825]">Categories Management</h2>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsCategoryModalOpen(true);
                }}
                className="px-5 py-3 rounded-xl bg-[#2C2825] text-white font-semibold text-xs flex items-center gap-2 shadow hover:bg-[#3E3834] transition-colors"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                  <img src={cat.image} alt={cat.name} className="w-full h-40 rounded-2xl object-cover" />
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#2C2825]">{cat.name}</h3>
                    <p className="text-stone-500 text-xs mt-1 line-clamp-2">{cat.description}</p>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Enquiries */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="font-serif text-2xl font-bold text-[#2C2825]">Customer Enquiries & Orders</h2>

            <div className="space-y-4">
              {enquiries.map((enq) => (
                <div key={enq.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-base text-[#2C2825]">{enq.customer_name}</h3>
                      <span className="text-xs text-stone-400 font-mono">{enq.phone}</span>
                    </div>
                    {enq.product_name && (
                      <p className="text-xs font-semibold text-[#8C6D24]">Item: {enq.product_name}</p>
                    )}
                    <p className="text-stone-600 text-sm bg-stone-50 p-3 rounded-xl border border-stone-200">
                      {enq.message}
                    </p>
                    <span className="text-[11px] text-stone-400 block">
                      Submitted on: {new Date(enq.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <select
                      value={enq.status}
                      onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as any)}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="New">Status: New</option>
                      <option value="Contacted">Status: Contacted</option>
                      <option value="Completed">Status: Completed</option>
                    </select>

                    <a
                      href={`https://wa.me/${enq.phone.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(`Hello ${enq.customer_name}, regarding your enquiry at Bashir Furniture...`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
                    >
                      WhatsApp Reply
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Settings & Hero */}
        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6 animate-fadeIn">
            <h2 className="font-serif text-2xl font-bold text-[#2C2825]">Site Settings & Hero Configuration</h2>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={settingsForm.company_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">WhatsApp Number (with country code)</label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Showroom Address</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#2C2825]">Hero Section Banner</h3>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={settingsForm.hero_title}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={settingsForm.hero_subtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Hero Background Image</label>
                  <input
                    type="text"
                    value={settingsForm.hero_image}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_image: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                  <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">
                    {uploadingImage ? 'Uploading image…' : 'Choose hero image from phone'}
                    <input type="file" accept="image/*" disabled={uploadingImage} className="hidden" onChange={async (event) => {
                      const file = event.currentTarget.files?.[0];
                      if (file) {
                        const url = await uploadImage(file);
                        if (url) setSettingsForm((previous) => ({ ...previous, hero_image: url }));
                      }
                      event.currentTarget.value = '';
                    }} />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-4 rounded-xl bg-[#2C2825] text-white font-semibold text-sm hover:bg-[#3E3834] transition-colors shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-[#D4AF37]" /> Save Site Settings
              </button>
            </form>
          </div>
        )}

        {/* Product Modal */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-2xl font-bold text-[#2C2825] mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingProduct?.name || ''}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Category *</label>
                    <select
                      name="category"
                      required
                      defaultValue={editingProduct?.category || categories[0]?.name}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Availability *</label>
                    <select
                      name="availability"
                      required
                      defaultValue={editingProduct?.availability || 'In Stock'}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Made to Order">Made to Order</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Price (₦) *</label>
                    <input
                      type="number"
                      name="price"
                      required
                      defaultValue={editingProduct?.price || ''}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Discount Price (₦) Optional</label>
                    <input
                      type="number"
                      name="discount_price"
                      defaultValue={editingProduct?.discount_price || ''}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Product Images *</label>
                  <input
                    type="text"
                    name="images"
                    required
                    defaultValue={editingProduct?.images?.join(', ') || ''}
                    placeholder="Uploaded image URLs appear here"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                  <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">
                    {uploadingImage ? 'Uploading image…' : 'Replace/select image(s) from phone'}
                    <input type="file" accept="image/*" multiple disabled={uploadingImage} className="hidden" onChange={async (event) => {
                      const files = Array.from(event.currentTarget.files || []);
                      const form = event.currentTarget.form;
                      const imagesInput = form?.elements.namedItem('images') as HTMLInputElement | null;
                      const uploadedUrls: string[] = [];
                      for (const file of files) {
                        const url = await uploadImage(file);
                        if (url) uploadedUrls.push(url);
                      }
                      // Selecting new files while editing replaces the previous image list,
                      // rather than silently appending to the old URLs.
                      if (uploadedUrls.length && imagesInput) {
                        imagesInput.value = uploadedUrls.join(', ');
                      }
                      event.currentTarget.value = '';
                    }} />
                  </label>
                  <p className="mt-1 text-xs text-stone-500">Choose one or more images. Maximum 10 MB per image.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Dimensions</label>
                    <input
                      type="text"
                      name="dimensions"
                      defaultValue={editingProduct?.dimensions || ''}
                      placeholder="e.g. W 200cm x D 90cm"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Materials / Finishes</label>
                    <input
                      type="text"
                      name="materials"
                      defaultValue={editingProduct?.materials || ''}
                      placeholder="e.g. Solid Mahogany, Velvet"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Colours / Finishes (comma separated)</label>
                  <input
                    type="text"
                    name="colours"
                    defaultValue={editingProduct?.colours?.join(', ') || ''}
                    placeholder="Emerald Green, Navy Blue, Charcoal"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Description *</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    defaultValue={editingProduct?.description || ''}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#2C2825] text-white text-xs font-semibold hover:bg-[#3E3834] shadow"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Category Modal */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-2xl font-bold text-[#2C2825] mb-6">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingCategory?.name || ''}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Category Image *</label>
                  <input
                    type="text"
                    name="image"
                    required
                    defaultValue={editingCategory?.image || ''}
                    placeholder="Uploaded image URL appears here"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                  <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">
                    {uploadingImage ? 'Uploading image…' : 'Choose image from phone'}
                    <input type="file" accept="image/*" disabled={uploadingImage} className="hidden" onChange={async (event) => {
                      const file = event.currentTarget.files?.[0];
                      const form = event.currentTarget.form;
                      if (file && form) {
                        const url = await uploadImage(file);
                        const imageInput = form.elements.namedItem('image') as HTMLInputElement | null;
                        if (url && imageInput) imageInput.value = url;
                      }
                      event.currentTarget.value = '';
                    }} />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">Description *</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    defaultValue={editingCategory?.description || ''}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#2C2825] text-white text-xs font-semibold hover:bg-[#3E3834] shadow"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

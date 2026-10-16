import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ShieldCheck, PhoneCall, UserCheck } from 'lucide-react';
import { SiteSettings, CartItem } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  settings: SiteSettings;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  cart,
  setIsCartOpen,
  settings,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'collections', label: 'Collections' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Utility Announcement Bar */}
      <div className="bg-[#2C2825] text-[#FBF9F5] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" /> Premium Handcrafted Quality
            </span>
            <span className="hidden md:inline text-stone-400">|</span>
            <span className="hidden md:inline text-stone-300">Nationwide Delivery Across Nigeria</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" /> {settings.phone}
            </a>
            <span className="text-stone-400">|</span>
            <button 
              onClick={() => setCurrentTab('admin')} 
              className={`flex items-center gap-1 hover:text-[#D4AF37] transition-colors ${currentTab === 'admin' ? 'text-[#D4AF37] font-semibold' : ''}`}
            >
              <UserCheck className="w-3.5 h-3.5" /> Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <button 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.company_name + ' logo'} className="w-11 h-11 object-contain rounded-full" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#2C2825] text-[#D4AF37] flex items-center justify-center font-serif text-xl font-bold tracking-wider shadow-md group-hover:bg-[#3E3834] transition-colors">
                BF
              </div>
            )}
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2C2825] group-hover:text-[#8C6D24] transition-colors block">
                {settings.company_name}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold block -mt-1">
                Luxury Furniture
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`text-sm font-medium tracking-wide transition-colors py-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#D4AF37] hover:after:w-full after:transition-all ${
                  currentTab === link.id
                    ? 'text-[#2C2825] font-semibold after:w-full'
                    : 'text-stone-600 hover:text-[#2C2825]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-full text-stone-700 hover:text-[#2C2825] hover:bg-stone-200/60 transition-colors"
              aria-label="Search products"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-[#2C2825] text-[#FBF9F5] hover:bg-[#3E3834] transition-colors shadow-sm flex items-center justify-center"
              aria-label="Shopping Cart"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-200/60 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FBF9F5] border-b border-stone-200 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  currentTab === link.id
                    ? 'bg-[#2C2825] text-[#FBF9F5]'
                    : 'text-stone-700 hover:bg-stone-200/50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  setCurrentTab('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-200/50 flex items-center gap-2"
              >
                <UserCheck className="w-5 h-5 text-[#D4AF37]" /> Admin Dashboard
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

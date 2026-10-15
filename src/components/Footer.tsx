import React from 'react';
import { SiteSettings } from '../types';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, ShieldCheck } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, setCurrentTab }) => {
  return (
    <footer className="bg-[#1A1715] text-[#FBF9F5] pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-stone-800">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-stone-950 flex items-center justify-center font-serif text-lg font-bold">
                BF
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                {settings.company_name}
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Exquisite handcrafted and modern furniture designed to transform your living and workspace into sanctuaries of elegance.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href={settings.social_links.instagram || '#'} className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-stone-950 transition-colors flex items-center justify-center text-white">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={settings.social_links.facebook || '#'} className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-stone-950 transition-colors flex items-center justify-center text-white">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={settings.social_links.twitter || '#'} className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-stone-950 transition-colors flex items-center justify-center text-white">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-white">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button onClick={() => setCurrentTab('home')} className="hover:text-[#D4AF37] transition-colors">Home</button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('shop')} className="hover:text-[#D4AF37] transition-colors">Shop Catalog</button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('collections')} className="hover:text-[#D4AF37] transition-colors">Curated Collections</button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-[#D4AF37] transition-colors">About Our Craftsmanship</button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('contact')} className="hover:text-[#D4AF37] transition-colors">Contact Showroom</button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-white">Furniture Categories</h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>Sofas & Couches</li>
              <li>Beds & Bedroom Furniture</li>
              <li>Dining Tables & Chairs</li>
              <li>Wardrobes & Storage</li>
              <li>TV Stands & Cabinets</li>
              <li>Office Furniture</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-white">Showroom Contact</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-[#D4AF37] transition-colors">{settings.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-[#D4AF37] transition-colors">{settings.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>&copy; {new Date().getFullYear()} {settings.company_name}. All rights reserved. Crafted for luxury living.</p>
          <div className="flex items-center gap-2 text-stone-400">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Secure Checkout & Verified Enquiries</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

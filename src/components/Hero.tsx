import React from 'react';
import { ArrowRight, Sparkles, Shield, Truck, Award } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings;
  onShopClick: () => void;
  onCollectionsClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onShopClick, onCollectionsClick }) => {
  return (
    <div className="relative bg-[#1A1715] text-[#FBF9F5] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.hero_image}
          alt="Luxury Furniture Showcase"
          className="w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1715] via-[#1A1715]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" /> {settings.company_name} Excellence
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            {settings.hero_title}
          </h1>

          <p className="text-stone-300 text-lg sm:text-xl font-light leading-relaxed">
            {settings.hero_subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              onClick={onShopClick}
              className="px-8 py-4 rounded-full bg-[#D4AF37] text-stone-950 font-semibold hover:bg-[#E5C158] transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 group"
            >
              Shop Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onCollectionsClick}
              className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md text-[#FBF9F5] font-semibold border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center"
            >
              Explore Rooms
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Footer */}
      <div className="relative z-10 bg-black/40 backdrop-blur-md border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-stone-300 text-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Uncompromising Quality</h4>
                <p className="text-stone-400 text-xs">Seasoned timber & fine upholstery fabrics</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Bespoke Customization</h4>
                <p className="text-stone-400 text-xs">Built precisely to your room dimensions</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Nationwide White-Glove</h4>
                <p className="text-stone-400 text-xs">Professional delivery & expert assembly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

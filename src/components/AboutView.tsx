import React from 'react';
import { SiteSettings } from '../types';
import { ShieldCheck, Award, HeartHandshake, Hammer, Sparkles } from 'lucide-react';

interface AboutViewProps {
  settings: SiteSettings;
}

export const AboutView: React.FC<AboutViewProps> = ({ settings }) => {
  return (
    <div className="bg-[#FBF9F5] py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Top Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#B38F2D] font-bold">
              Our Heritage & Philosophy
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2825] leading-tight">
              Crafting Timeless Masterpieces For Generations
            </h1>
            <p className="text-stone-600 leading-relaxed text-base">
              {settings.about_text}
            </p>
            <p className="text-stone-600 leading-relaxed text-base">
              At {settings.company_name}, we believe that furniture is more than utility—it is an expression of character, comfort, and enduring elegance. From selecting seasoned mahogany and teak to precision joinery and plush velvet upholstery, our master artisans pour passion into every detail.
            </p>
          </div>

          <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80"
              alt="Furniture Craftsmanship"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
              <Hammer className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2C2825]">Master Joinery</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Traditional mortise and tenon joints combined with modern structural engineering to guarantee lifetime sturdiness.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2C2825]">Exquisite Materials</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Only sustainably harvested seasoned hardwoods, Italian leather, and stain-resistant velvet make it into our workshops.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2C2825]">Client Satisfaction</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              From initial consultation and custom sizing to white-glove delivery, your complete satisfaction is our highest priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

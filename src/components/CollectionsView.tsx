import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CollectionsViewProps {
  onExploreCategory: (categoryName: string) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({ onExploreCategory }) => {
  const collections = [
    {
      title: 'The Royal Living Room Suite',
      subtitle: 'Elegance & Comfort Combined',
      description: 'Immerse your guests in peerless luxury with our matched velvet sectionals, marble-top coffee tables, and ambient media consoles.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      category: 'Sofas & Couches'
    },
    {
      title: 'Master Bedroom Sanctuary',
      subtitle: 'Rest in Uncompromised Splendor',
      description: 'Handcrafted king-sized upholstered beds, matching bedside cabinets, and floor-to-ceiling fitted wardrobes designed for tranquility.',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
      category: 'Beds & Bedroom'
    },
    {
      title: 'Executive Boardroom & Office',
      subtitle: 'Command Your Workspace',
      description: 'Solid mahogany and walnut executive desks paired with ergonomic Italian leather seating built for high-performance leaders.',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
      category: 'Office Furniture'
    },
    {
      title: 'Grand Dining Banquets',
      subtitle: 'Unforgettable Family Gatherings',
      description: 'Extensible solid wood dining suites polished to a mirror finish, accompanied by supportive, beautifully stitched dining chairs.',
      image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=85',
      category: 'Dining Tables & Chairs'
    }
  ];

  return (
    <div className="bg-[#FBF9F5] py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs uppercase tracking-widest text-[#B38F2D] font-bold">
            Signature Inspirations
          </span>
          <h1 className="font-serif text-4xl font-bold text-[#2C2825]">
            Curated Room Collections
          </h1>
          <p className="text-stone-600 text-sm">
            Explore meticulously coordinated room sets designed by our interior stylists to harmonize effortlessly in your home.
          </p>
        </div>

        <div className="space-y-16">
          {collections.map((col, index) => (
            <div
              key={col.title}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="w-full lg:w-1/2 relative h-[380px] sm:h-[450px] rounded-3xl overflow-hidden shadow-xl group">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              <div className="w-full lg:w-1/2 space-y-6">
                <span className="text-xs uppercase tracking-widest text-[#B38F2D] font-bold block">
                  {col.subtitle}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2825]">
                  {col.title}
                </h2>
                <p className="text-stone-600 leading-relaxed text-base">
                  {col.description}
                </p>
                <button
                  onClick={() => onExploreCategory(col.category)}
                  className="px-8 py-4 rounded-full bg-[#2C2825] text-white font-semibold hover:bg-[#3E3834] transition-all flex items-center gap-2 shadow-md group"
                >
                  Shop This Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

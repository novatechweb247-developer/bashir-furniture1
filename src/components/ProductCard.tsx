import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, MessageCircle, Eye, CheckCircle2, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  whatsappNumber: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  whatsappNumber
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatNaira = (amount: number) => {
    return '₦' + amount.toLocaleString();
  };

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanNumber = whatsappNumber.replace(/[^0-9+]/g, '');
    const message = encodeURIComponent(
      `Hello Bashir Furniture, I am interested in ordering or making enquiries about "${product.name}" priced at ${formatNaira(product.discount_price || product.price)}. Please share availability and delivery details.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-stone-100">
        <img
          src={product.images[currentImageIndex] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="px-2.5 py-1 rounded-full bg-[#2C2825]/90 backdrop-blur-sm text-white text-[11px] font-medium tracking-wide">
            {product.category}
          </span>
          {product.availability === 'In Stock' ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-semibold">
              <CheckCircle2 className="w-3 h-3" /> In Stock
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-600/90 text-white text-[10px] font-semibold">
              <Clock className="w-3 h-3" /> Made to Order
            </span>
          )}
        </div>

        {product.discount_price && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
            SALE
          </div>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity px-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="w-full py-2.5 px-4 bg-white/90 backdrop-blur-md text-[#2C2825] font-semibold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 hover:bg-white transition-colors"
          >
            <Eye className="w-4 h-4 text-[#D4AF37]" /> Quick View & Options
          </button>
        </div>

        {/* Image Dots Indicator */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1 z-10">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImageIndex === idx ? 'bg-[#D4AF37] w-4' : 'bg-white/70'
                }`}
                aria-label={`Show image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#2C2825] group-hover:text-[#8C6D24] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-stone-500 text-xs mt-1.5 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
          <div>
            {product.discount_price ? (
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg text-[#2C2825]">
                  {formatNaira(product.discount_price)}
                </span>
                <span className="text-xs text-stone-400 line-through">
                  {formatNaira(product.price)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-lg text-[#2C2825]">
                {formatNaira(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleWhatsAppEnquiry}
              className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
              title="Enquire on WhatsApp"
              aria-label="Enquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="p-2.5 rounded-xl bg-[#2C2825] text-white hover:bg-[#3E3834] transition-colors shadow-sm"
              title="Add to Cart"
              aria-label="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

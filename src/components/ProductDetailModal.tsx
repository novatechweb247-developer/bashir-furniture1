import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, MessageCircle, CheckCircle2, ShieldCheck, Truck, Ruler, Palette, Layers } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedColor?: string) => void;
  whatsappNumber: string;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  whatsappNumber,
  allProducts,
  onSelectProduct
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colours?.[0] || '');

  const formatNaira = (amount: number) => {
    return '₦' + amount.toLocaleString();
  };

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleWhatsAppOrder = () => {
    const cleanNumber = whatsappNumber.replace(/[^0-9+]/g, '');
    const colorStr = selectedColor ? ` | Color: ${selectedColor}` : '';
    const message = encodeURIComponent(
      `Hello Bashir Furniture, I would like to order "${product.name}"${colorStr} (Qty: ${quantity}) at ${formatNaira((product.discount_price || product.price) * quantity)}. Please guide me on delivery.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-10 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.discount_price && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    SPECIAL OFFER
                  </span>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImage === idx ? 'border-[#D4AF37] scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs uppercase tracking-widest text-[#B38F2D] font-bold">
                    {product.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {product.availability}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2825] mt-2">
                  {product.name}
                </h1>

                <div className="mt-4 flex items-baseline gap-3">
                  {product.discount_price ? (
                    <>
                      <span className="text-2xl sm:text-3xl font-bold text-[#2C2825]">
                        {formatNaira(product.discount_price)}
                      </span>
                      <span className="text-sm text-stone-400 line-through">
                        {formatNaira(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-[#2C2825]">
                      {formatNaira(product.price)}
                    </span>
                  )}
                </div>

                <p className="text-stone-600 text-sm mt-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Specifications */}
                <div className="mt-6 space-y-3 pt-6 border-t border-stone-200">
                  {product.dimensions && (
                    <div className="flex items-center gap-3 text-sm text-stone-700">
                      <Ruler className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-medium">Dimensions:</span> {product.dimensions}
                    </div>
                  )}
                  {product.materials && (
                    <div className="flex items-center gap-3 text-sm text-stone-700">
                      <Layers className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-medium">Materials:</span> {product.materials}
                    </div>
                  )}

                  {product.colours && product.colours.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-3 text-sm text-stone-700">
                        <Palette className="w-4 h-4 text-[#D4AF37]" />
                        <span className="font-medium">Select Finish / Colour:</span>
                        <span className="text-[#8C6D24] font-semibold">{selectedColor}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.colours.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              selectedColor === color
                                ? 'bg-[#2C2825] text-white border-[#2C2825]'
                                : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4 pt-6 border-t border-stone-200">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-stone-700">Quantity:</span>
                  <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-stone-600 hover:bg-stone-200 transition-colors font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-stone-800 font-semibold text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 text-stone-600 hover:bg-stone-200 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      onAddToCart(product, quantity, selectedColor);
                      onClose();
                    }}
                    className="py-3.5 px-6 rounded-xl bg-[#2C2825] text-white font-semibold hover:bg-[#3E3834] transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="py-3.5 px-6 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" /> Order via WhatsApp
                  </button>
                </div>

                <div className="flex items-center justify-around pt-2 text-xs text-stone-500">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Quality Guaranteed</span>
                  <span className="flex items-center gap-1"><Truck className="w-4 h-4 text-[#D4AF37]" /> Safe Nationwide Transit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-stone-200">
              <h3 className="font-serif text-2xl font-bold text-[#2C2825] mb-6">
                You May Also Like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct(rel)}
                    className="group bg-stone-50 rounded-2xl p-4 border border-stone-200 hover:shadow-lg transition-all cursor-pointer flex gap-4 items-center"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#2C2825] group-hover:text-[#8C6D24] line-clamp-1">
                        {rel.name}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1">{rel.category}</p>
                      <p className="text-sm font-bold text-[#2C2825] mt-1">
                        {formatNaira(rel.discount_price || rel.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

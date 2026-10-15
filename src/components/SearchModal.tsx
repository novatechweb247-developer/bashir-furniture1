import React, { useState } from 'react';
import { Product } from '../types';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateShopWithQuery: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onNavigateShopWithQuery
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim() ? products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5) : [];

  const formatNaira = (amount: number) => {
    return '₦' + amount.toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#D4AF37]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sofas, beds, mahogany dining tables..."
            className="w-full text-lg focus:outline-none text-[#2C2825]"
          />
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {query.trim() && (
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto bg-stone-50/50">
            {results.length === 0 ? (
              <div className="text-center py-10 text-stone-500 text-sm">
                No furniture items found matching "{query}"
              </div>
            ) : (
              <>
                <div className="text-xs uppercase tracking-wider text-stone-500 font-bold px-3 py-1">
                  Matching Products
                </div>
                {results.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-stone-100 transition-colors cursor-pointer border border-stone-200/60"
                  >
                    <div className="flex items-center gap-3">
                      <img src={prod.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#2C2825]">{prod.name}</h4>
                        <span className="text-xs text-stone-500">{prod.category}</span>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-[#2C2825]">
                      {formatNaira(prod.discount_price || prod.price)}
                    </span>
                  </div>
                ))}

                <button
                  onClick={() => {
                    onNavigateShopWithQuery(query);
                    onClose();
                  }}
                  className="w-full py-3 mt-2 rounded-xl bg-[#2C2825] text-white text-xs font-semibold hover:bg-[#3E3834] transition-colors flex items-center justify-center gap-2"
                >
                  View All Results in Shop <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

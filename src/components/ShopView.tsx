import React, { useState, useMemo } from 'react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';

interface ShopViewProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  whatsappNumber: string;
  initialCategory?: string;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  categories,
  onAddToCart,
  onViewDetails,
  whatsappNumber,
  initialCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();

      const price = p.discount_price || p.price;
      const matchesPrice = price <= maxPrice;

      const matchesAvailability =
        availabilityFilter === 'All' || p.availability === availabilityFilter;

      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
      if (sortBy === 'price-asc') {
        return (a.discount_price || a.price) - (b.discount_price || b.price);
      }
      if (sortBy === 'price-desc') {
        return (b.discount_price || b.price) - (a.discount_price || a.price);
      }
      return 0;
    });
  }, [products, searchQuery, selectedCategory, maxPrice, availabilityFilter, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(2000000);
    setAvailabilityFilter('All');
    setSortBy('newest');
  };

  return (
    <div className="bg-[#FBF9F5] py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#B38F2D] font-bold">
            Exquisite Catalog
          </span>
          <h1 className="font-serif text-4xl font-bold text-[#2C2825]">
            Handcrafted Furniture Collection
          </h1>
          <p className="text-stone-600 text-sm">
            Browse our full range of luxury sofas, bedroom suites, dining tables, and executive desks.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm mb-10 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sofas, beds, tables..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              <button
                onClick={resetFilters}
                className="p-3 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors"
                title="Reset Filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === 'All'
                  ? 'bg-[#2C2825] text-white shadow'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-[#2C2825] text-white shadow'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Advanced Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-600 mb-2">
                <span>Max Price: ₦{maxPrice.toLocaleString()}</span>
                <span>₦2,000,000+</span>
              </div>
              <input
                type="range"
                min="100000"
                max="2000000"
                step="50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Availability:</span>
              <div className="flex gap-2">
                {['All', 'In Stock', 'Made to Order'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setAvailabilityFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      availabilityFilter === status
                        ? 'bg-[#D4AF37] text-stone-950 border-[#D4AF37]'
                        : 'bg-stone-50 text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 space-y-4">
            <SlidersHorizontal className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-[#2C2825]">No Furniture Found</h3>
            <p className="text-stone-500 text-sm max-w-md mx-auto">
              We couldn't find any items matching your filter criteria. Try adjusting your search keywords or price range.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-[#2C2825] text-white rounded-xl text-xs font-semibold shadow hover:bg-[#3E3834] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

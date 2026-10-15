import React, { useState } from 'react';
import { CartItem, SiteSettings } from '../types';
import { X, Trash2, ShoppingBag, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (productId: string, delta: number, color?: string) => void;
  removeItem: (productId: string, color?: string) => void;
  clearCart: () => void;
  settings: SiteSettings;
  onSubmitEnquiry: (orderData: { customerName: string; phone: string; address: string; notes: string }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeItem,
  clearCart,
  settings,
  onSubmitEnquiry
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const formatNaira = (amount: number) => {
    return '₦' + amount.toLocaleString();
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.discount_price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const handleProceedToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) {
      alert('Please fill in your Name, Phone Number, and Delivery Address.');
      return;
    }

    setSubmitting(true);
    onSubmitEnquiry({ customerName, phone, address, notes });

    // Build WhatsApp order summary
    const cleanNumber = settings.whatsapp.replace(/[^0-9+]/g, '');
    let summary = `*NEW ORDER / ENQUIRY - BASHIR FURNITURE*\n\n`;
    summary += `*Customer Name:* ${customerName}\n`;
    summary += `*Phone:* ${phone}\n`;
    summary += `*Delivery Address:* ${address}\n`;
    if (notes) summary += `*Notes:* ${notes}\n\n`;
    summary += `*Items Ordered:*\n`;

    cart.forEach((item, idx) => {
      const p = item.product;
      const price = p.discount_price || p.price;
      const colorTxt = item.selectedColor ? ` (Color: ${item.selectedColor})` : '';
      summary += `${idx + 1}. ${p.name}${colorTxt} x ${item.quantity} = ${formatNaira(price * item.quantity)}\n`;
    });

    summary += `\n*Total Amount:* ${formatNaira(subtotal)}`;

    const encoded = encodeURIComponent(summary);
    
    setTimeout(() => {
      setSubmitting(false);
      setCheckoutStep('success');
      window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
      clearCart();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBF9F5] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-[#2C2825] text-[#D4AF37]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#2C2825]">Your Cart</h2>
                <p className="text-xs text-stone-500">{cart.reduce((s, i) => s + i.quantity, 0)} items selected</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {checkoutStep === 'success' ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#2C2825]">Enquiry Sent Successfully!</h3>
                <p className="text-stone-600 text-sm max-w-xs mx-auto">
                  Your order summary has been transmitted to WhatsApp and recorded in our customer database. Our sales team will contact you shortly.
                </p>
                <button
                  onClick={() => {
                    setCheckoutStep('cart');
                    onClose();
                  }}
                  className="mt-6 px-6 py-3 bg-[#2C2825] text-white rounded-xl font-semibold text-sm shadow-md hover:bg-[#3E3834] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2C2825]">Your Cart is Empty</h3>
                <p className="text-stone-500 text-sm max-w-xs mx-auto">
                  Explore our exquisite collection of furniture and add your favorite pieces to begin your order.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#2C2825] text-white rounded-xl font-semibold text-sm shadow-md hover:bg-[#3E3834] transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : checkoutStep === 'cart' ? (
              <>
                <div className="space-y-4">
                  {cart.map((item, idx) => {
                    const price = item.product.discount_price || item.product.price;
                    return (
                      <div
                        key={`${item.product.id}-${item.selectedColor || idx}`}
                        className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex gap-4 items-center"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif font-bold text-sm text-[#2C2825] truncate">
                            {item.product.name}
                          </h4>
                          {item.selectedColor && (
                            <span className="text-xs text-[#8C6D24] block mt-0.5">
                              Finish: {item.selectedColor}
                            </span>
                          )}
                          <p className="text-sm font-bold text-[#2C2825] mt-1">
                            {formatNaira(price)}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                              <button
                                onClick={() => updateQuantity(item.product.id, -1, item.selectedColor)}
                                className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 font-bold text-xs"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-xs font-semibold text-stone-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, 1, item.selectedColor)}
                                className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 font-bold text-xs"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.product.id, item.selectedColor)}
                              className="text-red-500 hover:text-red-700 p-1.5 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <form id="checkout-form" onSubmit={handleProceedToWhatsApp} className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#2C2825]">Delivery & Contact Details</h3>
                  
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Chief Adeleke Johnson"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +234 803 000 0000"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                      Delivery Address (City / State) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Plot 5, Banana Island, Ikoyi, Lagos"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                      Special Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Preferred delivery by weekend"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="text-xs text-[#8C6D24] font-semibold hover:underline"
                >
                  &larr; Back to Cart items
                </button>
              </form>
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && checkoutStep !== 'success' && (
            <div className="p-6 bg-white border-t border-stone-200 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-bold text-xl text-[#2C2825]">{formatNaira(subtotal)}</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Delivery fees & assembly calculated upon confirmation. Secure checkout via WhatsApp.
              </p>

              {checkoutStep === 'cart' ? (
                <button
                  onClick={() => setCheckoutStep('details')}
                  className="w-full py-4 rounded-xl bg-[#2C2825] text-white font-semibold hover:bg-[#3E3834] transition-colors flex items-center justify-center gap-2 shadow-lg text-sm"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg text-sm disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4" /> Submit Order via WhatsApp
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

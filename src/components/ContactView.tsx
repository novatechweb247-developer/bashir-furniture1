import React, { useState } from 'react';
import { SiteSettings, Enquiry } from '../types';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { getLocalEnquiries, saveLocalEnquiries, supabase, isSupabaseConfigured } from '../lib/supabase';

interface ContactViewProps {
  settings: SiteSettings;
}

export const ContactView: React.FC<ContactViewProps> = ({ settings }) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newEnquiry: Enquiry = {
      id: 'enq-' + Date.now(),
      customer_name: customerName,
      phone,
      email,
      message,
      status: 'New',
      created_at: new Date().toISOString()
    };

    try {
      if (isSupabaseConfigured) {
        await supabase.from('enquiries').insert([newEnquiry]);
      }
      const existing = getLocalEnquiries();
      saveLocalEnquiries([newEnquiry, ...existing]);

      setSubmitted(true);
      setCustomerName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error(err);
      alert('Error submitting enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9+]/g, '');

  return (
    <div className="bg-[#FBF9F5] py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#B38F2D] font-bold">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl font-bold text-[#2C2825]">
            Contact {settings.company_name}
          </h1>
          <p className="text-stone-600 text-sm">
            Have questions about custom dimensions, wood finishes, or nationwide delivery? Reach out to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Cards */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#2C2825]">Showroom Address</h3>
                <p className="text-stone-600 text-sm mt-1">{settings.address}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37]">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#2C2825]">Phone Number</h3>
                <a href={`tel:${settings.phone}`} className="text-stone-600 text-sm mt-1 hover:text-[#D4AF37] block">
                  {settings.phone}
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37]">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#2C2825]">WhatsApp Chat</h3>
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 text-sm font-semibold mt-1 hover:underline block"
                >
                  Chat with us instantly &rarr;
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37]">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#2C2825]">Email Address</h3>
                <a href={`mailto:${settings.email}`} className="text-stone-600 text-sm mt-1 hover:text-[#D4AF37] block">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#2C2825]">Message Received!</h3>
                <p className="text-stone-600 text-sm max-w-sm mx-auto">
                  Thank you for reaching out. An expert furniture consultant from {settings.company_name} will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-3 bg-[#2C2825] text-white rounded-xl text-xs font-semibold shadow hover:bg-[#3E3834] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="font-serif text-2xl font-bold text-[#2C2825]">Send Us An Enquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Mrs. Amina Bello"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +234 803 111 2222"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. amina@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                    Your Message / Custom Furniture Specifications *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe the furniture piece, dimensions, or questions you have..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#2C2825] text-white font-semibold hover:bg-[#3E3834] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[#D4AF37]" /> {loading ? 'Submitting...' : 'Send Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

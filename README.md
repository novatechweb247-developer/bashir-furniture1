# Bashir Furniture — Premium Website & E-Commerce Platform

Welcome to **Bashir Furniture**, a high-end, production-ready furniture store web application built with React, TypeScript, Vite, Tailwind CSS, Lucide icons, and Supabase.

---

## Features

1. **Elegant Customer-Facing Storefront**:
   - Warm ivory and dark charcoal luxury styling with Google Playfair Display & Plus Jakarta Sans typography.
   - Sticky navigation header with top utility announcement bar and mobile menu drawer.
   - Dynamic Hero Section with editable banner background and supporting copy.
   - Featured Categories & Curated Room Collections (Living Room, Bedroom, Dining, Office).
   - Rich Product Cards with image switcher, discount badges, "In Stock" / "Made to Order" statuses, and Nigerian Naira (`₦`) pricing.
   - Comprehensive Product Detail Modal with image gallery thumbnails, dimensions, materials, and color finish selectors.

2. **Advanced Search & Filtering**:
   - Instant search modal across product names, categories, and descriptions.
   - Filtering by category pills, price range slider, and availability status.
   - Sorting by newest arrivals and price (low-high, high-low).

3. **Functional Shopping Cart & WhatsApp Order Checkout**:
   - Slide-over cart drawer with quantity increment/decrement, item removal, and subtotal calculation in Naira.
   - Persistent cart between page visits via localStorage.
   - Direct order checkout transmitting formatted order summaries to WhatsApp with customer details.

4. **Secure Admin Dashboard (`/admin`)**:
   - Secure login via Supabase Auth or standalone demo credentials (`admin@bashirfurniture.com` / `admin123`).
   - Catalogue overview statistics (Total Products, Categories, Enquiries).
   - Products Management: Add, edit, delete products with multiple image URLs and specifications.
   - Categories Management: Add, edit, delete furniture categories.
   - Customer Enquiries: Review customer messages and update status (`New`, `Contacted`, `Completed`), with instant WhatsApp reply buttons.
   - Site Settings & Hero Manager: Edit company name, phone, WhatsApp number, email, address, and hero banner content.

---

## Supabase Database & Storage Setup

1. **Supabase Project Reference**: `efdtxbbhggdcohigelmw`
2. **Database Schema**:
   Run the SQL migration script located in `/src/docs/supabase_setup.sql` in your Supabase SQL Editor to provision tables (`products`, `categories`, `site_settings`, `enquiries`) with Row Level Security (RLS) policies.
3. **Environment Variables**:
   Configure your `.env` or deployment environment variables:
   ```env
   VITE_SUPABASE_URL="https://efdtxbbhggdcohigelmw.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_ANON_KEY"
   ```

---

## Local Development & Build

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

# ASTU EATS - Crowdsourced Food Delivery System

![Status](https://img.shields.io/badge/Status-Active_Development-orange)
![Platform](https://img.shields.io/badge/Platform-Telegram_Mini_App%20%7C%20Web-2CA5E0)
![License](https://img.shields.io/badge/License-MIT-green)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20TypeScript%20%7C%20Zustand%20%7C%20Tailwind-blue)

**A modern, multi-role food delivery platform** built specifically for university communities in Ethiopia, starting with **ASTU (Adama Science and Technology University)**.

---

## 🎯 Project Vision

ASTU EATS solves real pain points faced by university students and campus communities:

- **Fragmented ordering** via phone calls and social media
- **No centralized discovery** of restaurants and menus
- **Inefficient delivery coordination**
- **Limited digital payment options**

The platform connects **Customers**, **Vendors**, and **Delivery Partners** in one seamless ecosystem with a beautiful Telegram Mini-App experience.

---

## ✨ Key Features

### 🛒 Customer Experience (Telegram Mini-App)

- Smart dashboard with ongoing offers and personalized recommendations
- Advanced search with price & location filters
- Rich restaurant and food discovery
- Persistent cart with real-time pricing
- Multiple payment options (Telebirr, CBE Birr, Awash Birr, Telegram Stars, Cash)
- Live order tracking with visual timeline
- Multi-role support (Customer can also act as Delivery Partner)

### 🏪 Vendor Experience

- Complete menu management (CRUD)
- Real-time order processing
- Business analytics and earnings dashboard
- Document verification & approval system

### 🚚 Delivery courier Experience

- Browse available orders with smart filtering
- One-tap order acceptance
- Live GPS tracking & ETA updates
- Real-time earnings and performance metrics

### 👑 Admin Portal (Web)

- Full user, restaurant, and order management
- Analytics dashboard
- Verification workflows
- Dispute resolution system

---

## 🛠️ Technology Stack

**Frontend (Telegram Mini-App)**

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (State Management)
- React Hook Form + Zod
- Lucide React (Icons)

**Backend**

- Node.js + Express.js
- PostgreSQL + Prisma ORM
- Socket.io (Real-time)
- JWT Authentication

**Admin Portal**

- Next.js 14 (App Router)

---

## 📁 Project Structure

```bash
backend/
admin-protal/
telegram-mini-app/
├── src/
│   ├── features/
│   │   ├── auth/           # Authentication flow
│   │   ├── customer/       # Customer-specific pages & components
│   │   ├── vendor/         # Vendor dashboard
│   │   └── delivery/       # Delivery partner dashboard
│   ├── store/              # Zustand stores (auth, cart, order, etc.)
│   ├── components/         # Reusable UI components
│   ├── routes/             # Route configuration + ProtectedRoute
│   ├── types/              # Global TypeScript definitions
│   └── lib/                # Utilities and formatters
├── public/
└── vite.config.ts

# Clone repository
git clone https://github.com/Mulusewu/astu-crowdsourced-food-delivery.git
cd astu-eats

# Install dependencies
cd telegram-mini-app
pnpm install

# Backend setup
cd ../backend
pnpm install
cp .env.example .env
pnpm prisma migrate dev
pnpm dev
```

# ASTU Eats - Frontend Architecture & Project Context

This document serves as the "Master Prompt" and architectural overview of the ASTU Eats Telegram Mini-App frontend. It summarizes the core patterns, state management architecture, data flows, and routing paradigms currently in place.

---

## 1. System Overview

The application is a **React-based Telegram Mini-App** designed for three distinct user roles (Customers, Vendors, and Deliverers). 

* **Tech Stack**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui.
* **Routing**: `react-router-dom` using extensive role-based route guards.
* **State Management**: `zustand` (with middleware like `persist`).
* **Data Source**: Currently runs on a local JSON mock database (`src/data/database.json`) structured to exactly mirror the production PostgreSQL backend managed by Prisma.

---

## 2. Data Structure & Backend Alignment

The frontend architecture meticulously mirrors the Prisma backend schema to minimize friction during the transition from local mock data to real API integration.

### The Mock Database (`database.json`)
The `database.json` serves as the local "backend". It includes tables like:
* `users`
* `customerProfiles`, `delivererProfiles`, `vendorProfiles`
* `restaurants`, `categories`, `menuItems`
* `orders`, `orderItems`, `orderStatusHistories`
* `payments`, `ratings`, `notifications`

### TypeScript Typings (`src/types/`)
* **`prisma.ts`**: Contains the exact TypeScript interfaces matching the Prisma schema (e.g., `PrismaUser`, `Order`, `MenuItem`, `Restaurant`).
* **`user.types.ts`**: Contains the unified `User` type utilized by legacy UI components. Recent updates have been migrating this to `AuthUser` in the stores to better align with `PrismaUser`.

*Crucial Concept*: When testing locally, Zustand stores import the `db` from `src/data/index.ts` (which reads `database.json`) and simulate network latency before populating the frontend state.

---

## 3. State Management (Zustand)

The app avoids a monolithic store. Instead, state is divided into heavily focused slices located in `src/store/`:

### Core Stores
* **`authStore.ts`**: Manages the current authenticated user (`AuthUser`), their roles, JWT token, and the `activeMode` (Customer, Vendor, or Delivery). It contains logic to transform raw Prisma data into the shape expected by the UI.
* **`uiStore.ts`**: Global UI state for things like toasts, modals, bottom sheets, and loading indicators.

### Feature Stores
* **`customer/customerStore.ts`**: Manages customer-specific data like saved addresses, preferred payment methods, favorite restaurants, and recent searches.
* **`cart/cartStore.ts`**: Handles the customer's shopping cart, modifiers, and total calculations.
* **`vendor/vendorStore.ts`**: Manages a restaurant owner's dashboard, menu items, and incoming orders.
* **`activeDeliveriesStore.ts` & `deliveryDashboardStore.ts`**: Handles state for delivery personnel, including tracking active runs, calculating earnings, and accepting new broadcasts.

---

## 4. Routing Architecture (`src/routes/`)

The routing layer is heavily structured and role-based.

* **`routePaths.ts`**: The single source of truth for all URLs. It exports a massive `ROUTES` constant object divided into `AUTH`, `CUSTOMER`, `VENDOR`, `DELIVERY`, and `SHARED`.
* **`AppRoutes.tsx`**: The main router. It utilizes a `Suspense` boundary and groups routes logically.
* **Route Groups (`routeGroups/`)**: Arrays of route definitions separated by domain (`authRoutes.ts`, `customerRoutes.ts`, etc.) to keep `AppRoutes.tsx` clean.
* **`ProtectedRoute.tsx`**: A wrapper component that checks the `useAuthStore().activeRole`. If a Customer tries to access a Delivery route, they are automatically redirected. *(Note: This was temporarily bypassed for UI testing during early development).*

---

## 5. UI Layouts & Navigation

Layouts wrap the distinct dashboard experiences.

* **Layout Wrappers (`src/features/layouts/`)**:
  * `CustomerLayout.tsx`: Wraps customer views.
  * `VendorLayout.tsx`: Wraps restaurant management views.
  * `DeliveryLayout.tsx`: Wraps delivery personnel views.
* **Navigation**:
  * The app utilizes native-feeling Bottom Navigations (`CustomerBottomNav`, `DeliveryBottomNav`) designed specifically for mobile/Telegram Mini-App constraints.
  * Components reside in their respective feature folders (e.g., `src/features/customer/components/CustomerBottomNav/`).
* **Design System**: Built on top of Tailwind CSS and `shadcn/ui` (accessible in `src/components/ui/`), featuring highly reusable components like `Button`, `Card`, `Modal`, `Dialog`, etc. Theme configuration is handled by `ThemeToggle` and `themeStore.ts`.

---

## 6. How to Build Features in this Architecture

If you need to add a new feature (e.g., "Dispute Management"), the standard workflow is:

1. **Define the Types**: Ensure the models exist in `src/types/prisma.ts` based on the backend schema.
2. **Update the Mock DB**: Add mock records to `src/data/database.json`.
3. **Create a Zustand Store**: Create `src/store/disputeStore.ts` to manage fetching and updating disputes.
4. **Define Routes**: Add the path to `ROUTES` in `routePaths.ts`, then add the component to the relevant route group (e.g., `adminRoutes.tsx`).
5. **Build Components**: Create the UI inside `src/features/disputes/components/` and the page inside `src/features/disputes/pages/`. Use existing `shadcn/ui` components for styling consistency.

---
*Generated based on codebase analysis.*

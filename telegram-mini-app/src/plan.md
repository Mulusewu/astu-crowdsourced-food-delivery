# Telegram Mini App Prisma Alignment Plan

## Goal
Migrate the UI and Zustand layer to match `prisma.schema` and the new Prisma-compatible `src/data/database.json` exactly, without changing folder structure or frontend architecture, while keeping design consistency and navigation stability.

## Non-Negotiable Rules For Implementation
- Change foundational dependencies first, then dependents (types -> data access/adapters -> stores -> pages/components -> routes/nav wiring).
- Keep all work inside existing module boundaries and folder structure.
- Prefer incremental, testable commits per phase and sub-phase.
- Preserve visual style by reusing existing sibling components/colors/layout patterns.
- Avoid big-bang refactors; use compatibility adapters during transition.
- Every route/page touched must be verified for render, navigation, and data load behavior.

## Current Reality (From Exploration)
- `database.json` is now flat and Prisma-shaped (`users[]`, `orders[]`, `menuItems[]`, `customerProfiles[]`, etc.).
- Many stores still expect old nested shape (`db.users.customers`, `db.orders.available`, `db.menu[restaurantId]`, `db.deliveryDashboard`).
- Role values mismatch between frontend and schema (`customer/vendor/delivery` vs `CUSTOMER/VENDOR_STAFF/DELIVERER/ADMIN`).
- `ProtectedRoute` is commented out; access is enforced only at layout level.
- Route map is broad, but vendor area is mostly stubbed/commented and partially wired.
- Several pages depend on legacy store fields (`cafeName`, `orderNumber`, `image`, etc.) that no longer exist in schema-level entities.

---

## Execution Strategy (Dependency-First)

## Phase 0 - Foundation and Safety Rails (Must complete before feature phases)
### 0.1 Create canonical Prisma-aligned frontend types
- Add/update central types under existing `src/types` to represent:
  - Enums: `UserRole`, `ActiveMode`, `OrderStatus`, `PaymentStatus`, etc. (schema exact casing).
  - Entities: `User`, `CustomerProfile`, `DelivererProfile`, `VendorProfile`, `Restaurant`, `Category`, `MenuItem`, `Order`, `OrderItem`, `Payment`, `Rating`, `Notification`, `LedgerEntry`, `Dispute`, `DispatchLog`, `AnomalyFlag`, `SystemConfig`, `VerificationToken`, `RefreshToken`, `UserAuditLog`, `PayoutLog`.
- Introduce view models separately for UI where needed (for cards/lists/details), not mixed into entity types.

### 0.2 Build a data access + relation resolver layer (single source of truth)
- creating necessary zustand store , 
- Add derived selectors for old UI needs:
  - Available deliveries = orders in dispatchable statuses.
  - Active deliveries = orders assigned to current deliverer with in-progress statuses.
  - Customer order history = delivered/completed/cancelled for current customer.
- Keep this layer pure and deterministic (no component-side relation joins).

### 0.3 Compatibility mapping layer for gradual migration
- Add mapper functions that transform schema entities to current page view contracts (temporary).
- Use mapper layer to avoid breaking all pages at once while stores/pages are being updated.
- Mark every mapper with TODO for final cleanup after all pages consume canonical view models.

### 0.4 Role/identity normalization contract
- Normalize auth role handling:
  - Schema role (`USER.role`) and active mode (`activeMode`) -> frontend route role.
  - Map `DELIVERER -> delivery`, `VENDOR_STAFF -> vendor`, `CUSTOMER -> customer`.
- Add explicit helper functions for this conversion and use everywhere auth/router depends on role.

### 0.5 Baseline quality gate
- Build/type-check baseline before phase work.
- Snapshot current route coverage and top navigation paths for customer/delivery/vendor.

Acceptance criteria:
- No direct legacy reads from `db.users.customers`, `db.orders.available`, `db.menu[restaurantId]` remain in foundational modules.
- All store/page data dependencies can be fulfilled from resolver layer.

---

## Phase 1 - Delivery Side (Pages + Stores + Navigation + Production Readiness)
### 1.1 Delivery domain store refactor
- Refactor `deliveryDashboardStore`, `activeDeliveriesStore`, `orders/orderStore` delivery-facing actions to consume resolver layer.
- Replace legacy status literals with schema order statuses and add UI status mapping utility.
- Ensure delivery dashboard cards derive from real schema entities:
  - Online/offline from `delivererProfiles.isOnline` and `isAvailable`.
  - Earnings from `ledgerEntries`/`payments` (or mocked derived totals from schema fields).
  - Active tasks from `orders` + `dispatchLogs`.

### 1.2 Delivery page-by-page data alignment
- Validate and update each page under `features/delivery/pages`:
  - `DeliveryDashboard`, `AvailableDeliveriesPage`, `AvailableDeliveryDetailsPage`
  - `ActiveDeliveriesPage`, `ActiveDeliveryDetailsPage`, `ActiveDeliveryTrackPage`
  - `StatusPage`, `AvailabilityPage`, `OfflinePage`, `UpdateLocationPage`
  - `EarningsPage`, `history`, `ProfilePage`, `ReportIssuePage`, `paymentMethod`, `addPayment`
- For each page:
  - Verify it renders with schema-backed data.
  - Verify loading/empty/error states.
  - Verify route params and detail fetches.
  - Verify action transitions only allow valid status changes.

### 1.3 Delivery route and navigation integrity
- Re-check `deliveryRoutes`, route params, and all links from dashboard cards/buttons.
- Fix any stale path mismatch (`deliveryId` vs `orderId` confusion).
- Verify deep links for details and tracking pages.

### 1.4 Delivery production hardening
- Add guards for missing relation data (order without deliverer, null pickup coords, etc.).
- Add fallback display for nullable schema fields.

Acceptance criteria:
- Delivery pages no longer depend on legacy mock shape.
- All delivery routes are reachable and render.
- Status/action flow reflects schema state model.

---

## Phase 2 - Customer Side (Pages + Stores + Navigation + Robust UX)
### 2.1 Customer store refactor
- Refactor `customer/customerStore`, `cart/cartStore`, `food/foodStore`, `restaurantStore`, `orders/customerOrderStore`.
- Replace assumptions:
  - Restaurants from `restaurants[]`.
  - Menu from `menuItems[]` + `categories[]` relations.
  - Favorites/bookmarks from `customerProfiles.bookmarkRestaurants/bookmarkMeals`.
  - Orders from `orders[]` filtered by `customerId`.

### 2.2 Customer order/cart/payment alignment
- Ensure checkout/order pages use schema financial fields:
  - `foodPrice`, `deliveryFee`, `serviceFee`, `transactionFee`, `tip`, `totalAmount`.
- Align payment display with `payments[]` and `paymentStatus`.

### 2.3 Customer page and route wiring verification
- Validate all pages in `features/customer/pages` and links from dashboard cards:
  - Dashboard -> restaurant/details/food/cart/orders/profile/favorites/addresses/payment pages.
- Fix any route path typo/inconsistency (for example missing leading slash cases).

### 2.4 Customer UX resilience
- Robust empty states (no favorites, no active order, no addresses, no menu for restaurant).
- Safe handling of nullable values and deleted relation targets.

Acceptance criteria:
- Customer browsing/cart/checkout/orders/profile flows are schema-backed and stable.
- All dashboard and card navigation targets resolve correctly.

---

## Phase 3 - Vendor Side (Minimum Viable Robust Vendor Flow)
### 3.1 Vendor auth/profile relation normalization
- Use `vendorProfiles` + related `restaurant` as source for vendor identity context.

### 3.2 Vendor store/page alignment
- Upgrade vendor pages currently wired (`VendorDashboard`, plus any active vendor pages) to schema-backed data.
- Establish menu/order summary widgets from `menuItems`, `categories`, `orders`, `ratings`.

### 3.3 Vendor route hygiene
- Clean and verify active vendor routes in `vendorRoutes`.
- For commented/unimplemented routes:
  - Keep as-is but ensure no nav points to dead paths.
  - Add TODO markers in code for deferred routes.

Acceptance criteria:
- Vendor dashboard and available vendor pages use schema-aligned data without runtime shape hacks.

---

## Phase 4 - Authentication and Multi-Role Flow
### 4.1 Auth store migration to schema users
- Refactor `authStore` to authenticate against `users[]` shape.
- Remove legacy dependency on `db.users.customers/vendors/delivery`.
- Align user fields to schema (`fullName`, `phoneNumber`, verification flags, role enums).

### 4.2 Multi-role and mode handling
- Introduce deterministic mapping from schema role/active mode to frontend active role and route root.
- Verify role switcher behavior and allowed roles logic.
- Ensure profile data source differs correctly by role profile table.

### 4.3 Route protection and layout gates
- Restore/implement robust role-based protection (either revive `ProtectedRoute` or equivalent centralized guard).
- Validate layout routing:
  - `CustomerLayout`, `DeliveryLayout`, `VendorLayout` route users correctly.
  - Unauthorized role cannot render wrong zone page.

Acceptance criteria:
- Sign-in/sign-up/reset/otp/profile entry flow works with schema-shaped user data.
- Multi-role behavior is deterministic and protected routes are enforced.

---

## Phase 5 - Cross-Cutting Robustness, Navigation Graph, and Regression
### 5.1 Navigation graph audit
- Validate every card/button CTA from dashboards to details pages for customer and delivery.
- Verify reverse navigation (back to list/dashboard) and refresh-safe deep links.

### 5.2 Import/route/dependency audit
- Remove stale imports and duplicate store variants that are no longer used.
- Ensure no circular store imports introduced by resolver layer.

### 5.3 Rendering safety checklist
- For each touched page:
  - Renders in loading/empty/error/success states.
  - Handles undefined relation targets gracefully.
  - No direct raw JSON assumptions in component.

### 5.4 TypeScript + lint + build gates
- Full TS check on all touched modules.
- Fix lint issues introduced by migration.
- Ensure production build succeeds.

Acceptance criteria:
- No runtime crashes from shape mismatch.
- End-to-end role journeys are navigable and stable.

---

## Implementation Order (Detailed, Efficient, Context-Preserving)
1. `src/types` canonical schema types/enums.
2. `src/data` resolver/selectors and compatibility mappers.
3. `src/store/auth/authStore` role normalization contract.
4. Delivery stores -> delivery pages -> delivery routes/nav fix.
5. Customer stores -> customer pages -> customer routes/nav fix.
6. Vendor stores/pages/routes for active surface.
7. Shared/profile/auth pages and route protection finalization.
8. Cleanup pass (remove legacy shape access), then lint/build regression.

Why this order:
- Maximizes reuse and minimizes rework.
- Preserves context by locking shared contracts before page-level edits.
- Prevents broad breakage from early page rewrites without data contract stability.

---

## Test Matrix Per Phase
- Route test: every route in phase opens and renders expected page.
- Data shape test: no `undefined` from ID relation joins on mock dataset.
- Action test: key user actions mutate store/state as expected.
- Role test: wrong role redirected; correct role authorized.
- Visual consistency check: reused sibling styles/components, no random colors.

---

## Risk Register and Mitigations
- Risk: Hidden dependencies on legacy store fields.
  - Mitigation: temporary compatibility mappers + grep audit before cleanup.
- Risk: Status enum mismatch causing broken chips/buttons.
  - Mitigation: central status mapping utility and exhaustive switch checks.
- Risk: Route param mismatch (`orderId`/`deliveryId`) breaks detail pages.
  - Mitigation: route contract map and one-by-one page verification.
- Risk: Role string mismatch causes wrong redirects.
  - Mitigation: single role normalization function used by auth/layout/router.
- Risk: Vendor module partially implemented.
  - Mitigation: keep unimplemented routes isolated, remove dead nav entries.

---

## Definition Of Done
- All active customer, delivery, vendor, and auth flows use Prisma-compatible `database.json` shape.
- Zustand stores and TypeScript types align with schema contracts.
- Routes, layouts, and navigation are verified and protected.
- UI remains consistent with existing design system and sibling patterns.
- Build passes with no schema-shape runtime assumptions left in active code paths.


Added centralized flat-JSON resolver layer:

src/data/resolvers.ts
Includes dependency-first data access helpers like:
getUserById
getCustomerProfileByUserId
getDelivererProfileByUserId
getVendorProfileByUserId
getRestaurantById
getCategoriesByRestaurantId
getMenuItemsByRestaurantId
getOrdersByCustomer
getOrdersByDeliverer
getOrderItemsByOrderId
getPaymentByOrderId
getAvailableDeliveryOrders
getActiveDeliveryOrders
Exposed the resolver layer from the existing data entrypoint:

Updated src/data/index.ts with export * from "./resolvers";


# Book Worm – Angular 20 bookstore frontend

Responsive dark-theme bookstore UI recreated from the supplied reference screenshots
(catalog/landing, product details, cart + checkout, payment, order confirmation).

## Run

```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build -> dist/book-worm
```

## Structure

```
src/app
├── core/                    # app-wide, UI-agnostic code
│   ├── data/                # mock catalogue, author bios, filter options
│   ├── guards/              # checkout / confirmation route guards
│   ├── models/              # Book, Order, Address, ...
│   └── services/            # Book, Cart, Wishlist, Order, Toast (signal based, localStorage persisted)
├── shared/components/       # reusable standalone components
│   ├── navbar, footer, icon, toast, breadcrumb
│   ├── book-card, book-cover (generated SVG covers), genre-links
│   └── search-bar, filter-select, quantity-stepper, star-rating
└── features/                # lazy-loaded route pages
    ├── catalog              # /                  (sidebar, search, filters, sections)
    ├── product-details      # /book/:id          (details, writer, reviews, related)
    ├── checkout             # /cart              (cart, quantity, address form, coupon, totals)
    ├── payment              # /payment           (card / UPI / wallet, guarded)
    ├── order-confirmation   # /order-confirmation (guarded)
    ├── orders | wishlist | writers | not-found
```

## Notes

- No backend: `BookService` serves mock data; swap its methods for `HttpClient` calls later.
- Book covers are generated SVG (`book-cover`), so no image assets are needed.
- Cart, wishlist and orders persist in `localStorage`. The cart is seeded with the two books from the reference design.
- Demo coupons: `BOOKWORM100` (₹100 off), `WELCOME50` (₹50 off).
- Breakpoints: ≥1200 desktop, 900–1199 small desktop/tablet landscape, 768–899 tablet, <768 mobile
  (category sidebar becomes a horizontal chip bar, nav collapses into a hamburger menu).

# Vogue Tawala Sky — demo-ready three-page storefront

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000, then /shop and /experience.

## Editing products
- `lib/soft-drinks.ts` — each Soft Drinks price/name/size/photo.
- `lib/catalog.ts` — menu categories (RTDs & Cocktails removed).
- `lib/rum-showcase.ts`, `lib/new-collection-photos.ts`, `lib/additional-photos.ts` — product names and image paths.
- Demo category prices and overrides: `app/shop/page.tsx` (`demoPricesByCategory`, `demoOverrides`).
- Product image files: `public/products/`.
- Shop hero photograph: `public/vts-hero.jpg`.

## Demo boundaries
Demo prices and stock are intentionally fictional. The basket works locally but checkout, payment and Glovo delivery are inactive. An 18+ clickthrough is not a verified ID check. Production launch requires verified licensing, operating hours, adult delivery acceptance, real inventory, a tested backend, payment callback verification, and approved delivery credentials.

Store location shown: Utawala, opposite Ballmaina Shell when approaching from Ruai (user-provided). No unverified coordinates are used.

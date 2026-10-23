# Kenya Liquor Store — Day 1 starter

A responsive Next.js storefront with 12 Kenya-relevant product categories, age-entry confirmation, live product search/filtering, local-storage basket, and Supabase-backed admin inventory management.

## Run locally

1. Install Node.js 20+.
2. In this folder run `npm install` then `npm run dev`.
3. Visit http://localhost:3000; admin at http://localhost:3000/admin.
4. Rename the demo brand `THE BOTTLE ROOM` to the real shop name in `app/page.tsx` and `app/layout.tsx`.

## Turn on real inventory

1. Create a Supabase project.
2. Run `supabase/schema.sql` in SQL editor **once**.
3. Create `.env.local` using `.env.example` and the project's URL and **anon/publishable** key. NEVER put service-role keys in public variables.
4. In Supabase Authentication > Users, create the parent's admin user and copy its UUID.
5. Run `insert into public.admin_users(user_id) values ('UUID');` in SQL editor.
6. Restart `npm run dev`, open `/admin`, sign in and add real inventory, photos, sizes and Kenyan shilling prices.

## What actually works now
- Responsive home and catalog; category navigation; search; available-stock check; basket with quantity controls; session age entry gate.
- Real Supabase tables and restrictive row-level policies; authenticated/allowlisted admin can add/edit/delete products.
- `/api/health` reports enabled/disabled capabilities.

## Not yet live (intentionally)
- Ordering/checkout, order data persistence, M-Pesa settlement/callback validation and Glovo dispatch. The checkout button is disabled, not a fake payment flow.
- Adult identity checks at sale and delivery, operator licence validation, permitted trading hours, delivery zones and restrictions. These must be implemented and validated before accepting real alcohol orders.
- Full security hardening, rate limits, audit log, refund/return policies, privacy terms and production deployment.

## Suggested build phases
Day 1: Edit branding, connect Supabase, add product data.
Day 2: Server-validated checkout, address collection, verified-eligibility workflow, payment integration sandbox, admin order management.
Day 3: Delivery zones and approved dispatch workflow; test thoroughly; deploy to Vercel after compliance and live-provider checks.

## Glovo
Do not assume account approval or access to their delivery APIs. Implement dispatch only after Glovo confirms support and supplies credentials; until then use an operator-controlled manual delivery process that observes alcohol licensing restrictions.

## Important
The category examples do not represent the store's actual stock. No product prices are fabricated. This repository is an MVP starter, **not a production-ready alcohol retailer**.

## Uploaded Rum Gallery (Day 1 update)
The homepage now displays a 10-product rum gallery using the provided product photos, even without Supabase credentials. The gallery is **not purchasable** until prices, sizes, stock and applicable eligibility checks are confirmed. Edit `rum-inventory-to-complete.csv`, then add verified products via the admin portal (use the same `image_url` paths). Do not treat uploads as proof of inventory or brand authorization.

## Photo inventory refresh
Added 35 images across Whisky, Tequila and Cognac in the display-only preview gallery. Complete inventory-review.csv before adding any of these as purchasable Supabase products. Newer Gin, Liqueur, Spirits, Brandy, Vodka, Mixers and Beers chat uploads were not accessible as files at build time and are not embedded.

## VTS storefront revision (23 Oct 2026)
- `app/page.tsx` now merges Supabase published products with product-photo previews into the same searchable, category-filtered shelf. Preview-only products cannot be added to cart.
- `lib/additional-photos.ts` and `public/products/` contain 35 additional images supplied for Gin, Vodka, Brandy, Liqueurs, Local Spirits, Ready-to-Drink, Beers & Ciders and Mixers. Existing rum/whisky/tequila/cognac image catalogs are preserved.
- The storefront validates stored cart entries, retains cart state after hydration, clamps item quantities to current inventory, uses currency-safe display conversion, and reports inventory-loading failures without hiding photo previews.
- New `spirits` category was added to `lib/catalog.ts` and the fresh-install SQL schema. **Existing Supabase databases must update the old category CHECK constraint** before admins add `spirits` products. For existing databases, find the constraint name first and re-create it with the expanded category list. Do NOT re-run the entire schema unreviewed on an existing database.
- Checkouts are still intentionally disabled. The 18+ confirmation is not sufficient for lawful sale or delivery without identity/age validation and applicable licensing controls.
- Prices and quantities remain unverified for image-only previews; only genuinely published Supabase inventory is offered for cart actions.

Run `npm install`, then `npm run dev`, and open `http://localhost:3000`. Run `npx tsc --noEmit` in an environment with dependencies installed before production deployment.


## Responsive support
The VTS storefront adapts to narrow smartphones (including 320px screens), tablets, laptops and desktops. The primary navigation becomes a mobile menu below 800px; category and product grids automatically change columns by viewport; search and basket controls are touch friendly. Use browser DevTools responsive mode at widths 320, 375, 430, 768, 1024 and 1440px. Real-device testing is still recommended.

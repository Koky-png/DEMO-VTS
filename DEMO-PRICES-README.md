# VTS sample pricing build

This version adds automatically calculated demonstration prices and demonstration stock quantities to the existing uploaded photo catalog. All values are entirely fictional, not market rates or confirmed store prices.

The Shop categories, search and local shopping basket can now be exercised using the demo values. Checkout remains **disabled**. Nothing in this version creates paid orders or triggers a delivery.

To run: `npm install`, then `npm run dev`. Visit `/shop`.

For production, replace the demoItems block and demo source in `app/shop/page.tsx` with authenticated Supabase inventory data, and ensure only server-validated prices are trusted during checkout.

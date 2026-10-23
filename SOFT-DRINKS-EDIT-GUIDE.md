# Editing the VTS Soft Drinks section

1. Open `lib/soft-drinks.ts` in VS Code. Each entry has `name`, `image`, `priceKes`, `size`, and `demoStock`.
2. Change `priceKes` to update the fictional demo price shown in the Shop and its basket. Replace it with an approved real retail price only after verification.
3. For a new image, copy a product image to `public/products/soft-drinks/` and add an object to the array with a matching path.
4. The category slug is `soft-drinks`; the Shop filter and Home category link already recognize it.
5. `Mixers` remains a different category for syrups and cocktail ingredients. Ciders and premixed alcoholic cocktails are separate categories.
6. Run `npm install` once and `npm run dev` to see changes.

**IMPORTANT**: All values are DEMO ONLY; no checkout, payments, or delivery are enabled. These example prices are not a claim about Kenyan market pricing or actual VTS inventory. Actual licensed store details and age/ID checks must be verified prior to accepting orders.

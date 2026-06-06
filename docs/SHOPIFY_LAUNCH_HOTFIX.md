# AVA Shopify launch hotfix — shop.alphavisualartists.com

**Theme on store:** Horizon — AVA Refresh Draft (live assets under `/cdn/shop/t/1/`).  
**Patched source in repo:** `shopify-theme-ava/` (Horizon + AVA fixes).

## Root causes (verified)

| Bug | Cause | Fix owner |
|-----|--------|-----------|
| PDP “gold/colored” 2×2 blocks | `media_presentation: grid` + variants missing `featured_media` in Admin; gallery shows swatch/color slots when section re-renders | Theme patch + Admin variant images |
| Creative collection “3 items” | Nav links include **pre-applied filters** (`/collections/alpha-creative-collection/T-shirts` → only T-shirts) | Navigation URLs + optional theme URL sanitizer |
| Crew collection filters on load | Same: menu URLs like `/collections/alpha-crew-collection/Hoodies+T-shirts+Long-sleeve-t-shirts` | Navigation URLs + theme patch |

**Counts (curl, Jun 4 2026):**

- `alpha-creative-collection` unfiltered: **12** products  
- `alpha-creative-collection/T-shirts`: **3** products (matches screenshot)  
- `alpha-crew-collection` unfiltered: **14** products  
- `alpha-crew-collection` with compound filter: **7** products  

## Deploy theme patches (Joshua — ~10 min)

1. Authenticate Shopify CLI (one-time):
   ```bash
   shopify auth login --store alphavisualartists.myshopify.com
   ```
2. Pull the draft theme (match “Horizon — AVA Refresh Draft” ID from Admin → Themes):
   ```bash
   cd /Users/alphavisualartists/Vertikal-App/shopify-theme-ava
   shopify theme pull --theme <DRAFT_THEME_ID>
   ```
3. Re-apply or merge AVA patches if pull overwrote files:
   - `snippets/product-media-gallery-content.liquid` — variant `featured_media` fallback via `image.variant_ids`
   - `snippets/ava-collection-url.liquid` — strips filter path segments from collection menu links
   - Header snippets updated to use `{% render 'ava-collection-url', url: link.url %}`
4. Push to draft, preview, then publish:
   ```bash
   shopify theme push --theme <DRAFT_THEME_ID>
   shopify theme publish --theme <DRAFT_THEME_ID>
   ```

## Shopify Admin (required even after theme push)

### 1. Navigation — remove baked-in filters (fixes bugs 2 & 3)

**Online Store → Navigation → Main menu**

| Menu item | Change URL from (example) | To |
|-----------|---------------------------|-----|
| ALPHA CREW Collection | `/collections/alpha-crew-collection/Hoodies+T-shirts+Long-sleeve-t-shirts` | `/collections/alpha-crew-collection` |
| ALPHA CREATIVE Collection | `/collections/alpha-creative-collection/Hoodies+...` or `.../T-shirts` | `/collections/alpha-creative-collection` |

Save. Hard-refresh the storefront.

### 2. Product media — variant images (fixes PDP)

For each apparel PDP with color variants:

**Products → [product] → Media**

1. Upload front/back (and lifestyle) **per color**.
2. For each **color** variant (e.g. Black / S), open variant → set **featured image** to that color’s photo (not a flat swatch PNG).
3. Under each image, assign **variant** checkboxes so `image.variant_ids` matches the color.

Bulk check: `curl -sL "https://shop.alphavisualartists.com/products/<handle>.json" | jq '.product.variants[] | {title, featured_image: .featured_image != null}'`

### 3. Theme editor — product page gallery (recommended)

**Customize → Product page → Product media block**

- **Type:** Carousel (not Grid) for single-focus PDP  
- **Columns (grid):** If keeping grid, use **one column** or enable **Hide unselected variant media** only after variant images are assigned  
- **Hide unselected variant media:** ON once variant images are correct  

### 4. Collections — product membership

**Products → Collections**

- **ALPHA CREATIVE COLLECTION** — ensure all creative SKUs are added (API shows 8–12; storefront should match full line once filters are cleared).  
- **ALPHA CREW COLLECTION** — verify all crew SKUs included.

### 5. Search & Discovery (optional)

**Settings → Search & Discovery → Filters**

- Confirm filters are intentional; they are correct for sidebar use but must **not** be embedded in menu URLs.

## Verification checklist

| URL | Expected |
|-----|----------|
| https://shop.alphavisualartists.com/collections/alpha-crew-collection | Full crew line (~10–14 items), no active type filters in title |
| https://shop.alphavisualartists.com/collections/alpha-creative-collection | Full creative line (8–12 items), not “tagged t-shirts” only |
| https://shop.alphavisualartists.com/products/heavyweight-sunfade-oversized-hoodie | Carousel or correct color images when switching Black / Pink / Gray Blue |
| Nav: ALPHA CREW / ALPHA CREATIVE | Lands on unfiltered collection URLs |

**Device check:** Joshua confirms on phone after publish.

⚠️ PENDING DEVICE VERIFICATION — not done until JR confirms on device.

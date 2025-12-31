# Create OG Preview Image (1200x630px)

## Option 1: Online Converter (Easiest)

1. Open `public/assets/og-preview.svg` in a browser
2. Use online SVG to PNG converter:
   - https://cloudconvert.com/svg-to-png
   - https://convertio.co/svg-png/
   - Upload `og-preview.svg`
   - Set dimensions: **1200x630**
   - Download as `og-preview.png`
   - Save to `public/assets/og-preview.png`

## Option 2: Browser Screenshot

1. Open `public/assets/og-preview.svg` in Chrome/Firefox
2. Right-click → Inspect Element
3. Select `<svg>` element
4. Set viewport to 1200x630 in DevTools
5. Use browser screenshot tool or extension
6. Save as `public/assets/og-preview.png`

## Option 3: Node.js Script (if sharp is installed)

```bash
npm install sharp --save-dev
node scripts/convert-og-image.js
```

## Option 4: ImageMagick (if installed)

```bash
convert -background none -resize 1200x630 public/assets/og-preview.svg public/assets/og-preview.png
```

## Verification

After creating `og-preview.png`:
- File size should be <500KB
- Dimensions: 1200x630px
- Format: PNG
- Test with: https://developers.facebook.com/tools/debug/


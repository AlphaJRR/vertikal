# Cloudflare Stream Iframe Standard

## Standard Format

All Cloudflare Stream iframes MUST use this exact format:

```html
<iframe
  src="https://customer-XXXX.cloudflarestream.com/UID/iframe"
  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
  allowfullscreen
></iframe>
```

## Implementation Details

### Required Attributes

1. **`src`**: Cloudflare Stream iframe URL
   - Format: `https://customer-{CUSTOMER_ID}.cloudflarestream.com/{VIDEO_UID}/iframe`
   - Example: `https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/iframe`

2. **`allow`**: Permissions string (REQUIRED)
   - Must include: `accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;`
   - This enables autoplay and fullscreen functionality

3. **`allowfullscreen`**: Boolean attribute (REQUIRED)
   - Enables fullscreen video playback

### Optional Styling

For 9:16 vertical video format:

```html
style="border:0;width:100%;aspect-ratio:9/16;border-radius:18px;overflow:hidden;"
```

## Current Implementations

### 1. Web App - VideoHero Component
**File**: `src/components/features/VideoHero.tsx`
- ✅ Uses standard format
- ✅ Includes all required attributes
- ✅ Styled for 9:16 aspect ratio

### 2. Website - Homepage
**File**: `public/index.html`
- ✅ Uses standard format
- ✅ Includes all required attributes
- ✅ Styled for 9:16 aspect ratio

### 3. React Native App - CloudflareIframeCard
**File**: `components/video/CloudflareIframeCard.tsx`
- ✅ Uses WebView component
- ✅ Passes iframe URL to WebView
- ✅ Configures WebView props for autoplay

## Verification Checklist

When adding a new Cloudflare iframe, verify:

- [ ] `src` attribute uses correct customer ID and video UID
- [ ] `allow` attribute includes all required permissions
- [ ] `allowfullscreen` attribute is present
- [ ] Styling matches intended aspect ratio (9:16 for vertical)
- [ ] Border radius applied if needed (18px standard)

## Template

See `public/cloudflare-iframe-template.html` for a ready-to-use template.


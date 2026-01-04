# Cloudflare Video Upload & Integration Guide

## STEP 1: Upload Video to Cloudflare Stream

### Option A: Using Cloudflare Dashboard (Easiest)

1. **Sign in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Navigate to **Stream** in the sidebar

2. **Upload Video**
   - Click **"Upload a video"** button
   - Select your video file (MP4, MOV, etc.)
   - Wait for upload and processing to complete

3. **Get Video URL**
   - Once processed, click on your video
   - Copy the **"Stream URL"** or **"HLS URL"**
   - Format will be: `https://customer-{id}.cloudflarestream.com/{video-id}/manifest/video.m3u8`
   - Or direct MP4: `https://customer-{id}.cloudflarestream.com/{video-id}/mp4`

### Option B: Using Cloudflare API

```bash
# Install curl or use Postman

curl -X POST \
  https://api.cloudflare.com/client/v4/accounts/{account-id}/stream \
  -H "Authorization: Bearer {api-token}" \
  -F "file=@/path/to/your/video.mp4"

# Response will include video ID and URLs
```

### Option C: Using Cloudflare R2 (Alternative)

1. **Create R2 Bucket**
   - Go to **R2** in Cloudflare Dashboard
   - Create new bucket (e.g., `vertikal-videos`)
   - Upload video file

2. **Get Public URL**
   - Enable public access
   - Copy public URL: `https://{bucket}.r2.cloudflarestorage.com/{filename}.mp4`

---

## STEP 2: Update Code with Video URL

### Update Constants File

Edit `src/utils/constants.ts`:

```typescript
// Replace VIDEO_TRAILER with your Cloudflare URL
export const VIDEO_TRAILER = "https://customer-{your-id}.cloudflarestream.com/{video-id}/manifest/video.m3u8";
// OR for direct MP4:
// export const VIDEO_TRAILER = "https://customer-{your-id}.cloudflarestream.com/{video-id}/mp4";
```

### For HLS (Recommended - Better Quality)

If using HLS manifest (.m3u8), you may need to use a video player that supports HLS:
- Use `hls.js` library for web
- Or use Cloudflare's embed player

### For Direct MP4 (Simpler)

Direct MP4 URLs work with standard HTML5 `<video>` tag (current implementation).

---

## STEP 3: Enable VIBE Effects

The video will automatically have:
- ✅ VIBE comments (DanmakuOverlay) - enabled by default on VideoHero
- ✅ VIBE™ LIVE overlay badge
- ✅ VIBE toggle button (top-right)

---

## STEP 4: Make it Featured Video

The VideoHero component is already configured to:
- Show on HomePage (first thing users see)
- Auto-play with VIBE comments enabled
- Display "FEATURED PREMIERE" badge

---

## STEP 5: Add to Feed (Optional)

To also show in the vertical feed:

1. Add to `src/data/demoSeed.ts`:
```typescript
export const DEMO_FEED: Show[] = [
  {
    id: 'featured-video',
    title: 'Your Video Title',
    series: 'Featured',
    creator_id: 'joeguidry',
    thumbnail: '/assets/covers/your-thumbnail.png',
    video_url: 'YOUR_CLOUDFLARE_URL_HERE',
    tags: ['featured', 'premiere'],
    // ... other fields
  },
  DEMO_SHOW_BEST_BURGERS,
  DEMO_SHOW_DARK_ROOM,
  DEMO_SHOW_ORIGINS,
];
```

---

## Quick Reference

### Cloudflare Stream URLs Format:
- **HLS (Recommended)**: `https://customer-{id}.cloudflarestream.com/{video-id}/manifest/video.m3u8`
- **MP4 Direct**: `https://customer-{id}.cloudflarestream.com/{video-id}/mp4`
- **Thumbnail**: `https://customer-{id}.cloudflarestream.com/{video-id}/thumbnails/thumbnail.jpg`

### Files to Update:
1. `src/utils/constants.ts` - Update `VIDEO_TRAILER`
2. `src/data/demoSeed.ts` - Add to feed (optional)

### VIBE Effects:
- Already enabled by default on VideoHero
- Comments auto-scroll across screen
- Toggle button in top-right corner

---

## Troubleshooting

**Video not playing?**
- Check CORS settings in Cloudflare
- Ensure video format is supported (MP4, HLS)
- Check browser console for errors

**VIBE comments not showing?**
- VIBE is ON by default (`danmakuOn={true}`)
- Check z-index conflicts
- Verify DanmakuOverlay component is rendering

**Video quality issues?**
- Use HLS manifest for adaptive streaming
- Cloudflare auto-generates multiple quality versions


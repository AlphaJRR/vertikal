# Video Integration Steps - Cloudflare to VERTIKAL App

## 🎬 STEP-BY-STEP GUIDE

### STEP 1: Upload Video to Cloudflare Stream

#### Method 1: Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Sign in to your account

2. **Navigate to Stream**
   - Click **"Stream"** in the left sidebar
   - If you don't see it, enable it in your account settings

3. **Upload Your Video**
   - Click **"Upload a video"** button
   - Select your video file (MP4, MOV, etc.)
   - Wait for upload and processing (may take a few minutes)

4. **Get Your Video URL**
   - Once processed, click on your video
   - You'll see multiple URL options:
     - **MP4 Direct**: `https://customer-{id}.cloudflarestream.com/{video-id}/mp4`
     - **HLS Manifest**: `https://customer-{id}.cloudflarestream.com/{video-id}/manifest/video.m3u8`
     - **Thumbnail**: `https://customer-{id}.cloudflarestream.com/{video-id}/thumbnails/thumbnail.jpg`
   - **Copy the MP4 URL** (easiest for now)

---

### STEP 2: Update Code with Your Video URL

1. **Open the constants file**
   ```bash
   src/utils/constants.ts
   ```

2. **Replace the VIDEO_TRAILER URL**
   ```typescript
   export const VIDEO_TRAILER = "YOUR_CLOUDFLARE_MP4_URL_HERE";
   ```

   Example:
   ```typescript
   export const VIDEO_TRAILER = "https://customer-abc123.cloudflarestream.com/xyz789/mp4";
   ```

3. **Save the file**

---

### STEP 3: Verify VIBE Effects Are Enabled

The code is already configured to:
- ✅ Show VIBE comments by default (`danmakuOn={true}`)
- ✅ Display VIBE™ LIVE badge
- ✅ Enable VIBE toggle button

**No additional changes needed!**

---

### STEP 4: Test the Integration

1. **Start your dev server**
   ```bash
   npm run dev
   ```

2. **Check Home Page**
   - Navigate to Home tab
   - Your video should be playing automatically
   - VIBE comments should be scrolling across
   - VIBE™ LIVE badge visible in top-left

3. **Test VIBE Toggle**
   - Click VIBE button (top-right) to toggle comments on/off
   - Comments should appear/disappear

---

### STEP 5: (Optional) Add to Feed

To also show in the vertical feed as the first video:

1. **Open** `src/data/demoSeed.ts`

2. **Add your video to DEMO_FEED**:
   ```typescript
   export const DEMO_FEED: Show[] = [
     {
       id: 'featured-hero-video',
       title: 'Your Video Title',
       series: 'Featured',
       creator_id: 'joeguidry', // or your creator ID
       thumbnail: 'YOUR_THUMBNAIL_URL', // Use Cloudflare thumbnail URL
       video_url: 'YOUR_CLOUDFLARE_MP4_URL',
       tags: ['featured', 'premiere'],
       duration: 180, // in seconds
       views: 0,
       likes: 0,
       published_at: new Date().toISOString(),
       episode: 1,
       season: 1,
     },
     DEMO_SHOW_BEST_BURGERS,
     DEMO_SHOW_DARK_ROOM,
     DEMO_SHOW_ORIGINS,
   ];
   ```

---

## 🎯 QUICK REFERENCE

### Cloudflare Stream URL Formats:

**MP4 Direct (Easiest - Use This):**
```
https://customer-{account-id}.cloudflarestream.com/{video-id}/mp4
```

**HLS Manifest (Better Quality - Advanced):**
```
https://customer-{account-id}.cloudflarestream.com/{video-id}/manifest/video.m3u8
```

**Thumbnail:**
```
https://customer-{account-id}.cloudflarestream.com/{video-id}/thumbnails/thumbnail.jpg
```

### Files to Update:

1. ✅ `src/utils/constants.ts` - Update `VIDEO_TRAILER`
2. ✅ `src/data/demoSeed.ts` - Add to feed (optional)

### VIBE Effects Status:

- ✅ **VIBE Comments**: Enabled by default
- ✅ **VIBE™ LIVE Badge**: Visible on featured video
- ✅ **VIBE Toggle**: Working in top-right corner
- ✅ **Auto-scroll Comments**: 6 comments scrolling across screen

---

## 🔧 TROUBLESHOOTING

### Video Not Playing?

1. **Check CORS Settings**
   - In Cloudflare Stream, ensure CORS is enabled
   - Or use Cloudflare's public URLs (they handle CORS)

2. **Check Video Format**
   - Supported: MP4, MOV, WebM
   - Codec: H.264 recommended

3. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors in Console tab

### VIBE Comments Not Showing?

1. **Verify Default State**
   - Check `HomePage.tsx` - `danmakuOn` should be `true`
   - Check `VideoHero.tsx` - `DanmakuOverlay` should render when `active={danmakuOn}`

2. **Check Z-Index**
   - DanmakuOverlay uses `z-40`
   - VideoHero uses `z-30`
   - Should be visible

3. **Check CSS Animation**
   - Verify `animate-danmaku` class exists in `globals.css`
   - Animation should scroll from right to left

### Video Quality Issues?

1. **Use HLS Instead of MP4**
   - HLS provides adaptive streaming
   - Better quality on different connections
   - Requires `hls.js` library (can add if needed)

2. **Check Cloudflare Processing**
   - Wait for full processing to complete
   - Multiple quality versions are auto-generated

---

## ✅ VERIFICATION CHECKLIST

After integration, verify:

- [ ] Video plays automatically on Home page
- [ ] VIBE comments scroll across screen
- [ ] VIBE™ LIVE badge visible (top-left)
- [ ] VIBE toggle button works (top-right)
- [ ] Video loops continuously
- [ ] Video is muted (for autoplay)
- [ ] Video shows on web version
- [ ] Video shows in app (if applicable)

---

## 📝 NOTES

- **Autoplay**: Video is set to autoplay with `muted` attribute (required for browser autoplay policies)
- **Loop**: Video loops continuously for hero section
- **VIBE Default**: VIBE comments are ON by default for featured video
- **Performance**: Cloudflare Stream provides CDN delivery for fast loading worldwide

---

**Need Help?** Check Cloudflare Stream docs: https://developers.cloudflare.com/stream/


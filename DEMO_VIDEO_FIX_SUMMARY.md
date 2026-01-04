# Demo Video Thumbnail Fix - Complete

## Problem
Demo grid was showing placeholder tiles (generic Vertikal icon) instead of real Cloudflare Stream thumbnails.

## Root Cause
1. Videos were missing `streamUid` and `readyToStream: true` flags
2. Thumbnails weren't using Cloudflare Stream URLs
3. Filter logic was excluding Cloudflare-ready videos

## Solution Implemented

### 1. Updated All 3 Demo Videos (`src/data/demoSeed.ts`)
- ✅ `DEMO_SHOW_DARK_ROOM`: Added `streamUid`, `readyToStream: true`, Cloudflare thumbnail URL
- ✅ `DEMO_SHOW_BEST_BURGERS`: Added `streamUid`, `readyToStream: true`, Cloudflare thumbnail URL
- ✅ `DEMO_SHOW_ORIGINS`: Added `streamUid`, `readyToStream: true`, Cloudflare thumbnail URL

**Cloudflare Thumbnail Pattern:**
```
https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/{uid}/thumbnails/thumbnail.jpg?time=2s
```

### 2. Updated HomePage Filter (`src/pages/HomePage.tsx`)
- ✅ Now includes videos with `cloudflare.readyToStream === true` OR `readyToStream === true`
- ✅ Added debug logging to see which videos are being rendered
- ✅ Prioritizes Cloudflare thumbnails: `show.cloudflare?.thumbnail || show.thumbnail`

### 3. Updated ShowPlayer (`src/components/show/ShowPlayer.tsx`)
- ✅ Uses Cloudflare iframe when `cloudflare.readyToStream === true`
- ✅ Iframe URL: `https://customer-{ID}.cloudflarestream.com/{uid}/iframe`
- ✅ Hides video controls when using iframe (Cloudflare handles its own)

### 4. Added Debug Logging
- ✅ `ProjectCard`: Logs when Cloudflare thumbnails are used/loaded
- ✅ `ContinueWatchingCard`: Logs when Cloudflare thumbnails are used/loaded
- ✅ `HomePage`: Logs available videos with their Cloudflare status

## Testing Instructions

1. **Deploy the changes**
2. **Hard refresh browser** (Cmd+Shift+R / Ctrl+Shift+R)
3. **Open DevTools Console** and check for:
   - `[HomePage] Available videos:` - Should show 3 videos with `hasCloudflare: true`
   - `[ProjectCard] Using Cloudflare thumbnail:` - Should appear when thumbnails load
   - `[ContinueWatchingCard] Cloudflare thumbnail loaded:` - Should appear when thumbnails load
4. **Check Network tab** for requests to:
   - `cloudflarestream.com/.../thumbnails/thumbnail.jpg?time=2s`
5. **Click a video card** - Should open ShowDetailPage with Cloudflare iframe player

## Expected Results

✅ Video cards show real Cloudflare Stream thumbnails (not placeholder icons)
✅ All 3 demo videos are visible in "Continue Watching" and "Director Originals"
✅ Clicking a card opens a Cloudflare iframe player
✅ Console shows debug logs confirming Cloudflare URLs are being used

## Files Modified

1. `src/data/demoSeed.ts` - Added Cloudflare data to all 3 demo videos
2. `src/pages/HomePage.tsx` - Updated filter and thumbnail selection
3. `src/components/show/ShowPlayer.tsx` - Added Cloudflare iframe support
4. `src/components/cards/ProjectCard.tsx` - Added debug logging
5. `src/components/cards/ContinueWatchingCard.tsx` - Added debug logging
6. `src/pages/ShowDetailPage.tsx` - Passes Cloudflare data to ShowPlayer

## Next Steps

If thumbnails still don't load:
1. Check console for error messages
2. Verify Cloudflare video UIDs are correct
3. Check Network tab for 403/404 errors on thumbnail requests
4. Verify customer ID is correct: `fyh68ijrcuys7ag8`


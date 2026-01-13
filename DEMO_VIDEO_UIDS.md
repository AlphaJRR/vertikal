# Demo Video UIDs - REQUIRED

## Current Status: ❌ ALL VIDEOS USE SAME UID (WRONG!)

**Problem:** All 3 demo videos are using the same Cloudflare Stream UID:
- `9d3d0efed36b71e5f75c7b5e218809d7` (Joshua Argue's "Best Burgers" video)

This means:
- All cards show the same thumbnail
- All cards play the same video
- The demo looks broken/misleading

## Required Fix

Each demo video MUST have its own unique Cloudflare Stream UID:

1. **ARGUEably the Best Burgers** (Joshua Argue)
   - UID: `9d3d0efed36b71e5f75c7b5e218809d7` ✅ (keep this one)
   - Status: Ready

2. **Dark Room - Episode 1** (Joe Guidry)
   - UID: `[REQUIRED - GET FROM CLOUDFLARE]`
   - Status: ⚠️ NEEDS REAL UID

3. **Origins - Episode 1** (Cloaq Studios)
   - UID: `[REQUIRED - GET FROM CLOUDFLARE]`
   - Status: ⚠️ NEEDS REAL UID

## Action Required

1. Upload "Dark Room - Episode 1" to Cloudflare Stream → Get UID
2. Upload "Origins - Episode 1" to Cloudflare Stream → Get UID
3. Update `src/data/demoSeed.ts` with the real UIDs
4. Run verification: `verifyDemoVideos()` will now FAIL if duplicates exist

## Build-Time Check

The verification script now:
- ✅ Checks for duplicate UIDs
- ✅ Fails if any video is missing streamUid
- ✅ Logs unique UID count vs total videos

**Until each video has a unique UID, the demo is broken.**



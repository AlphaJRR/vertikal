# 🔧 FIX APPLY BUTTONS - Link All CTAs to Forms

## Current Status

**Forms Available:**
- ✅ `/apply/` - Creator application form
- ✅ `/beta/` - Beta waitlist (has form)
- ⚠️ Need to check all apply buttons link correctly

## Buttons to Fix

### 1. Homepage (`/index.html`)
- "Join The Movement" → Should link to `/apply/`
- "Apply Now" → Should link to `/apply/`

### 2. Creators Page (`/creators/index.html`)
- "Apply for Badge" → Should link to `/apply/`
- "Join Founding 50" → Should link to `/apply/`

### 3. Networks Page (`/networks/index.html`)
- "SUBMIT APPLICATION" → Should link to `/apply/` (with role=network)

### 4. Investors Page (`/investors/index.html`)
- "Apply to Invest" → Should link to `/apply/` (with role=investor)

### 5. Beta Page (`/beta/index.html`)
- "Join Beta" → Should link to `/beta/` (waitlist form)

## Implementation

All apply buttons should:
1. Link to `/apply/` for creator/network applications
2. Link to `/beta/` for beta waitlist
3. Pass `role` parameter via URL or form data attribute

## Mobile App

Mobile app should:
1. Use same Zapier webhook
2. Submit same payload format
3. Show form in WebView or native form component


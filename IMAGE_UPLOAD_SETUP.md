# 🖼️ IMAGE UPLOAD PIPELINE — SETUP GUIDE

**Date:** December 13, 2024  
**Status:** ✅ **IMPLEMENTED**

---

## 📋 PREREQUISITES

### **1. Install Required Dependencies**

```bash
npx expo install expo-file-system expo-image-picker
npm install @supabase/supabase-js base64-arraybuffer
```

### **2. Supabase Storage Configuration**

**One-time setup in Supabase Dashboard:**

1. Go to **Storage** → **New Bucket**
2. Name: `avatars`
3. **Public Bucket:** ✅ (Check this box)
4. **Save**

**Storage Policies (Optional for MVP):**
- **Public Read:** Allow public read access
- **Authenticated Upload:** Allow authenticated users to upload
- Or: **Full Access** for MVP speed

---

## 🔧 ENVIRONMENT VARIABLES

Add to your `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these:**
1. Go to Supabase Dashboard
2. Project Settings → API
3. Copy `Project URL` → `EXPO_PUBLIC_SUPABASE_URL`
4. Copy `anon public` key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## 📁 FILES CREATED

### **1. Supabase Client** (`lib/supabase.ts`)
- Initializes Supabase client for Storage operations
- Uses environment variables for configuration

### **2. Storage Utilities** (`utils/storage.ts`)
- `uploadAvatarToSupabase()` - Upload avatar to Supabase Storage
- `deleteAvatarFromSupabase()` - Delete avatar from Storage
- Handles Base64 encoding, file type detection, error handling

### **3. Setup Profile Screen** (`screens/auth/SetupProfileScreen.tsx`)
- Complete profile setup UI
- Image picker integration
- Upload → Database flow
- Error handling and validation

---

## 🚀 USAGE

### **In SetupProfileScreen:**

```typescript
import { uploadAvatarToSupabase } from '../../utils/storage';
import { apiClient } from '../../services/api';

// 1. User picks image
const avatarUri = await ImagePicker.launchImageLibraryAsync(...);

// 2. Upload to Supabase Storage
const publicUrl = await uploadAvatarToSupabase(avatarUri, userId);

// 3. Update profile with public URL
await apiClient.updateUserProfile({
  username,
  displayName,
  avatarUrl: publicUrl,
});
```

---

## 🔒 SECURITY

### **Backend Security:**
- ✅ JWT token required for profile updates
- ✅ Role updates blocked (admin-only)
- ✅ Username sanitization
- ✅ Input validation

### **Storage Security:**
- ✅ Public bucket for avatars (read access)
- ✅ Authenticated uploads (via Supabase Auth or custom JWT)
- ✅ File type validation (images only)
- ✅ File size limits (recommended: 5MB max)

---

## 🧪 TESTING

### **1. Test Image Upload:**

```typescript
// In SetupProfileScreen
const testUpload = async () => {
  const uri = 'file:///path/to/image.jpg';
  const userId = 'test-user-id';
  const url = await uploadAvatarToSupabase(uri, userId);
  console.log('Uploaded URL:', url);
};
```

### **2. Verify in Supabase Dashboard:**

1. Go to **Storage** → **avatars** bucket
2. Check files: `{userId}/{timestamp}.{ext}`
3. Verify public URL works: `https://...supabase.co/storage/v1/object/public/avatars/...`

### **3. Verify in Database:**

```sql
-- Check Profile table
SELECT id, userId, displayName, avatarUrl 
FROM "Profile" 
WHERE avatarUrl IS NOT NULL;
```

---

## 📊 FLOW DIAGRAM

```
User Picks Image
    ↓
ImagePicker returns local URI
    ↓
Read file as Base64
    ↓
Upload to Supabase Storage (avatars bucket)
    ↓
Get Public URL
    ↓
Update Profile via API (PUT /api/users/profile)
    ↓
Database stores Public URL
    ↓
Other users can now see the avatar
```

---

## ⚠️ TROUBLESHOOTING

### **Issue: "Supabase configuration missing"**
**Solution:** Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` to `.env`

### **Issue: "Upload failed"**
**Solution:** 
- Check Supabase bucket exists and is public
- Verify storage policies allow uploads
- Check file size (should be < 5MB)

### **Issue: "Permission denied"**
**Solution:**
- Request camera roll permissions
- Check Supabase storage policies

### **Issue: "Invalid avatar URL format"**
**Solution:**
- Ensure avatar URL starts with `https://`
- Verify Supabase bucket is public

---

## ✅ CHECKLIST

- [x] Supabase client created (`lib/supabase.ts`)
- [x] Storage utilities created (`utils/storage.ts`)
- [x] SetupProfileScreen created (`screens/auth/SetupProfileScreen.tsx`)
- [x] Environment variables added to `.env.example`
- [ ] Dependencies installed (`expo-file-system`, `expo-image-picker`, `@supabase/supabase-js`, `base64-arraybuffer`)
- [ ] Supabase bucket created (`avatars`, public)
- [ ] Environment variables set in `.env`
- [ ] Test image upload flow
- [ ] Verify avatar appears in database

---

## 🎯 NEXT STEPS

1. **Install Dependencies:**
   ```bash
   npx expo install expo-file-system expo-image-picker
   npm install @supabase/supabase-js base64-arraybuffer
   ```

2. **Configure Supabase:**
   - Create `avatars` bucket (public)
   - Set storage policies
   - Add environment variables

3. **Integrate SetupProfileScreen:**
   - Add route to navigation
   - Connect to auth flow
   - Test end-to-end

---

**Status:** ✅ **IMPLEMENTATION COMPLETE** | ⏳ **CONFIGURATION PENDING**

**Generated:** December 13, 2024


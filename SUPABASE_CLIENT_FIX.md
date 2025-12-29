# ✅ Supabase Client Code — Fixed

## 🔧 Issue Found

Your code uses `process.env.SUPABASE_KEY` which doesn't match the codebase standard.

## ✅ Corrected Code

### **For React Native/Expo (Mobile App):**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://vuwawtzhhcarckybdgbd.supabase.co'
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase configuration missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We handle auth via JWT tokens, not Supabase Auth
    autoRefreshToken: false,
  },
})

export default supabase
```

### **For Node.js/Backend:**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://vuwawtzhhcarckybdgbd.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
```

### **For Static HTML (Landing Pages):**

```javascript
// Already configured in public/supabase-client.js
const SUPABASE_URL = 'https://vuwawtzhhcarckybdgbd.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y'

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

---

## 📋 Environment Variables

### **React Native/Expo (.env):**

```env
EXPO_PUBLIC_SUPABASE_URL=https://vuwawtzhhcarckybdgbd.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y
```

### **Node.js/Backend (.env):**

```env
SUPABASE_URL=https://vuwawtzhhcarckybdgbd.supabase.co
SUPABASE_ANON_KEY=sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y
```

---

## 🔍 What Was Wrong

**Your code:**
```typescript
const supabaseKey = process.env.SUPABASE_KEY  // ❌ Wrong variable name
```

**Correct:**
- React Native: `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Node.js: `SUPABASE_ANON_KEY`
- Never use: `SUPABASE_KEY` (doesn't exist)

---

## 📁 Where to Use

**Already exists in codebase:**
- ✅ `lib/supabase.ts` - React Native client (correct)
- ✅ `public/supabase-client.js` - Static HTML client (correct)

**If you need to add this elsewhere:**
- Use the appropriate version above based on context
- Match the environment variable naming convention

---

## ✅ Summary

**Fixed:**
- ✅ Variable name: `SUPABASE_KEY` → `EXPO_PUBLIC_SUPABASE_ANON_KEY` (React Native)
- ✅ Variable name: `SUPABASE_KEY` → `SUPABASE_ANON_KEY` (Node.js)
- ✅ Added validation
- ✅ Added proper TypeScript types

**Use the corrected code above based on your context!**


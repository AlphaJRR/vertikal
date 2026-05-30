# 🚀 Quick Code Review Reference

## 📋 All AVA Media Code Files

### **Core Files (Must Review)**
```
index.html                    # HTML entry with safe area insets
vite.config.ts                # Vite build config
src/main.tsx                  # React entry point
src/App.tsx                   # Main app with routing
src/index.css                 # Global styles
```

### **Data Files**
```
src/data/podcastData.ts       # Podcast & video data
src/data/merchData.ts         # Merch items data
```

### **State Management**
```
src/context/FavoritesContext.tsx  # Favorites with localStorage
```

### **Layout**
```
src/components/layout/TabBar.tsx  # Bottom tab navigation
src/components/layout/TabBar.css
```

### **Merch Components**
```
src/components/merch/MerchCard.tsx
src/components/merch/MerchCard.css
src/components/merch/EmailSignupModal.tsx
src/components/merch/EmailSignupModal.css
```

### **Content Components**
```
src/components/podcast/PodcastCard.tsx
src/components/podcast/PodcastCard.css
src/components/video/VideoCard.tsx
src/components/video/VideoCard.css
```

### **Pages (7 Total)**
```
src/pages/HomePage.tsx
src/pages/PodcastsPage.tsx
src/pages/AlphaVaultPage.tsx
src/pages/ShopPage.tsx
src/pages/ServicesPage.tsx
src/pages/BookingPage.tsx
src/pages/FavoritesPage.tsx
src/pages/AboutLegalPage.tsx
```

### **Configuration**
```
capacitor.config.ts           # Capacitor settings
package.json                  # Dependencies
ios/App/App/Info.plist        # iOS permissions
```

---

## 🔍 Quick Review Commands

```bash
# List all source files
find src -type f | sort

# Check TypeScript
npx tsc --noEmit

# Build and verify
npm run build:web

# Export for review
./EXPORT_CODE_FOR_REVIEW.sh
```

---

## ✅ Critical Review Points

1. **Shop Page** - Verify Coming Soon overlay, no purchase flow
2. **Favorites** - Check localStorage persistence
3. **Offline Vault** - Verify download/share functionality
4. **Booking** - Check payment disclaimer
5. **About/Legal** - Verify Privacy/Terms links
6. **Data Files** - Check all data is complete
7. **Routes** - Verify all pages are accessible
8. **Tab Bar** - Check Shop tab is included

---

**Total Files:** ~35 source files + config files

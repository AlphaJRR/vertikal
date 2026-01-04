# VERTIKAL App Migration Plan

## Overview
Convert the prototype HTML (`Folder_App v.29/index.html`) into a production-grade React + Tailwind application.

---

## 1. Component Mapping

### Core Layout Components
- **`Header`** → `src/components/layout/Header.tsx`
  - Logo, balance display, inbox button
  - Sticky positioning with backdrop blur

- **`BottomNav`** → `src/components/layout/BottomNav.tsx`
  - 5 tabs: Home, Series, Shorts, Trailers, Profile
  - Active state management
  - Avatar for profile tab

- **`App`** → `src/App.tsx`
  - Main router/state manager
  - Tab navigation logic
  - Modal overlays (inbox, chat, subscription)

### Page/View Components
- **`HomeTab`** → `src/pages/HomePage.tsx`
  - Hero video with danmaku overlay
  - Filter tabs (For You, Networks, Drama, Docu)
  - Continue Watching section
  - Director Originals grid
  - Creator avatars carousel

- **`ProfileTab`** → `src/pages/ProfilePage.tsx`
  - Creator/Network profile header
  - Stats display
  - Tabbed content: Projects, Shop, Crew/Roster, BTS
  - Subscribe/Follow buttons
  - Founding 50 badge

- **`SeriesTab`** → `src/pages/SeriesPage.tsx` (placeholder → implement later)
- **`ShortsTab`** → `src/pages/ShortsPage.tsx` (placeholder → implement later)
- **`TrailersTab`** → `src/pages/TrailersPage.tsx` (placeholder → implement later)

- **`StudioTab`** → `src/pages/StudioPage.tsx`
  - AI tools: Reshaper, Viral Engine, Series Bible, Pitch Deck, Dialogue Fix, Scene Gen, Launch Plan
  - Text input with Gemini API integration
  - Result display

### Modal Components
- **`SubscriptionModal`** → `src/components/modals/SubscriptionModal.tsx`
  - Network Pass subscription UI
  - Payment button

- **`InboxView`** → `src/components/modals/InboxView.tsx`
  - Direct messages list
  - Unread indicators

- **`ChatView`** → `src/components/modals/ChatView.tsx`
  - Individual chat interface
  - Message bubbles
  - Input field

### Feature Components
- **`DanmakuOverlay`** → `src/components/features/DanmakuOverlay.tsx`
  - Animated comment overlay for videos
  - Configurable comments array

- **`FoundingBadge`** → `src/components/features/FoundingBadge.tsx`
  - "FOUNDING 50" badge with shine animation
  - Used on creator avatars

- **`VideoHero`** → `src/components/features/VideoHero.tsx`
  - Hero video player
  - Overlay gradients
  - Play button
  - Featured premiere badge

- **`ProjectCard`** → `src/components/cards/ProjectCard.tsx`
  - Show/project thumbnail
  - Type badge (SERIES, DOCU, ORIGINAL)
  - Creator name

- **`CreatorAvatar`** → `src/components/cards/CreatorAvatar.tsx`
  - Circular avatar with border
  - Network (gold) vs Creator (purple) styling
  - Click handler

- **`ContinueWatchingCard`** → `src/components/cards/ContinueWatchingCard.tsx`
  - Progress bar
  - Episode info
  - Thumbnail

---

## 2. Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── BottomNav.tsx
│   ├── cards/
│   │   ├── ProjectCard.tsx
│   │   ├── CreatorAvatar.tsx
│   │   └── ContinueWatchingCard.tsx
│   ├── features/
│   │   ├── DanmakuOverlay.tsx
│   │   ├── FoundingBadge.tsx
│   │   └── VideoHero.tsx
│   └── modals/
│       ├── SubscriptionModal.tsx
│       ├── InboxView.tsx
│       └── ChatView.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── ProfilePage.tsx
│   ├── SeriesPage.tsx
│   ├── ShortsPage.tsx
│   ├── TrailersPage.tsx
│   └── StudioPage.tsx
├── hooks/
│   ├── useHaptic.ts
│   └── useTabNavigation.ts
├── utils/
│   ├── constants.ts
│   ├── types.ts
│   └── helpers.ts
├── data/
│   ├── creators.json (move from nested path)
│   ├── shows.json
│   └── profile_pictures.json (move from nested path)
├── styles/
│   ├── globals.css
│   └── animations.css
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

## 3. Global Styles & Utilities

### Tailwind Configuration (`tailwind.config.js`)
- Custom colors:
  - Brand gradient: `#3B82F6` → `#9333EA`
  - Gold gradient: `#FFD700` → `#FDB931`
  - App gradient: `#000000` → `#0f172a`
- Custom animations:
  - `slideUpSpring` (cubic-bezier spring)
  - `scaleInSpring` (pop animation)
  - `danmaku` (horizontal scroll)
  - `pulse-purple` (hype button)
  - `shine` (text shimmer)

### Global CSS (`src/styles/globals.css`)
- iOS reset styles
- Scrollbar hiding utilities
- GPU acceleration classes
- Glass panel effect
- Font family: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`

### Utility Functions (`src/utils/`)
- `triggerHaptic(type)` - Haptic feedback bridge
- `getAllProjects()` - Aggregate projects from creators
- Type definitions for Creator, Project, Show, etc.

---

## 4. Assets to Extract

### Images (currently using Unsplash/Dropbox URLs)
- **Hero images**: Store in `public/images/hero/`
- **Network logos**: 
  - Alpha Visual Artists
  - CLOAQ Studios
  - Black Awesomeness (BAF)
- **Creator avatars**: Store in `public/images/avatars/`
- **Project thumbnails**: Store in `public/images/projects/`
- **BTS photos**: Store in `public/images/bts/`

### Videos
- **Trailer video**: Store in `public/videos/` or use CDN
- Consider video optimization (WebM, MP4 fallback)

### Icons
- **Lucide Icons**: Install via npm (`lucide-react`)
- No custom SVG extraction needed

---

## 5. Data Structure

### TypeScript Types (`src/utils/types.ts`)
```typescript
interface Creator {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio: string;
  stats: {
    fans: string;
    series: string;
    views?: string;
  };
  type: 'creator' | 'network';
  subPrice?: string;
  isFounding50: boolean;
  projects?: Project[];
  products?: Product[];
  bts?: string[];
  jobs?: Job[];
  roster?: string[];
}

interface Project {
  title: string;
  type: 'SERIES' | 'DOCU' | 'ORIGINAL';
  img: string;
  creatorName?: string;
  creatorAvatar?: string;
}

interface Show {
  id: string;
  title: string;
  // ... from shows.json
}
```

### Data Loading
- Import JSON files directly or use fetch
- Create data hooks: `useCreators()`, `useShows()`

---

## 6. Technology Stack

### Core
- **React 18** (with TypeScript)
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **React Router** (navigation - if needed for deep linking)

### Dependencies
- `lucide-react` (icons)
- `react` & `react-dom`
- `tailwindcss`
- `autoprefixer`
- `postcss`

### Development
- TypeScript
- ESLint
- Prettier (optional)

---

## 7. Implementation Phases

### Phase 1: Project Setup ✅
- Initialize Vite + React + TypeScript
- Configure Tailwind
- Set up folder structure
- Move/consolidate JSON data files

### Phase 2: Core Components
- Layout components (Header, BottomNav)
- Basic routing/state management
- Global styles

### Phase 3: Home Page
- VideoHero component
- DanmakuOverlay
- Project cards
- Creator avatars
- Continue Watching section

### Phase 4: Profile Page
- Profile header with stats
- Tabbed content (Projects, Shop, Crew, BTS)
- FoundingBadge
- Subscribe/Follow buttons

### Phase 5: Modals & Features
- SubscriptionModal
- InboxView
- ChatView
- Haptic feedback hook

### Phase 6: Studio Page
- AI tools interface
- Gemini API integration (with env var for key)
- Result rendering

### Phase 7: Polish
- Animations
- Responsive design
- Performance optimization
- Error handling

---

## 8. Key Features to Preserve

1. **iOS-like feel**: Spring animations, haptic feedback simulation
2. **120Hz optimization**: GPU acceleration classes
3. **Danmaku comments**: Animated overlay on videos
4. **Founding 50 program**: Badge system
5. **Network vs Creator**: Different styling (gold vs purple)
6. **Vertical-first design**: Mobile-optimized layout
7. **Glass morphism**: Backdrop blur effects
8. **Brand gradients**: Blue-purple and gold gradients

---

## 9. Environment Variables

Create `.env` file:
```
VITE_GEMINI_API_KEY=your_key_here
```

---

## 10. Next Steps After Migration

1. Connect to real backend API
2. Implement authentication
3. Add video player (Video.js or custom)
4. Payment integration (Stripe)
5. Real-time chat (WebSocket/Firebase)
6. Analytics
7. PWA capabilities
8. App store deployment prep


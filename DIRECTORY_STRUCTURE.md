# VERTIKAL Directory Structure

## 📁 Project Structure

```
vertikal/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page (/)
│   │   ├── home/              # Home route
│   │   │   └── page.tsx
│   │   ├── series/            # Series route (/series)
│   │   │   └── page.tsx
│   │   ├── shorts/            # Shorts route (/shorts)
│   │   │   └── page.tsx
│   │   ├── cinema/            # Cinema route (/cinema)
│   │   │   └── page.tsx
│   │   ├── profile/           # Profile route (/profile)
│   │   │   └── page.tsx
│   │   └── studio/            # Studio route (/studio)
│   │       └── page.tsx
│   ├── components/            # React Components
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── BottomNav.tsx
│   │   ├── feed/             # Feed components
│   │   │   ├── ActionBar.tsx
│   │   │   ├── ShowMetaOverlay.tsx
│   │   │   ├── VerticalFrame.tsx
│   │   │   └── VerticalVideoPlayer.tsx
│   │   ├── profile/          # Profile components
│   │   │   └── (add profile components here)
│   │   └── ui/               # Reusable UI components
│   │       └── (add UI components here)
│   ├── lib/                  # Library/Utility functions
│   │   ├── mockUpload.ts
│   │   ├── mockVerification.ts
│   │   ├── playerUtils.ts
│   │   └── sendFounding50Email.ts
│   ├── hooks/                # Custom React Hooks
│   │   └── useHaptic.ts
│   ├── types/                # TypeScript type definitions
│   │   └── (add type definitions here)
│   ├── data/                 # Mock data files
│   │   ├── comments.json
│   │   ├── creators.json
│   │   ├── founding50.json
│   │   ├── more_shows.json
│   │   └── verification_codes.json
│   └── styles/               # Global styles
│       └── globals.css
├── server/                   # Backend API
│   ├── src/
│   ├── prisma/
│   └── package.json
├── package.json             # Next.js dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind CSS config
├── next.config.js           # Next.js config
└── postcss.config.js        # PostCSS config
```

## 🎯 Route Structure

- `/` - Home page
- `/home` - Home feed
- `/series` - Series content
- `/shorts` - Shorts content
- `/cinema` - Cinema content
- `/profile` - User profile
- `/studio` - Creator studio

## 📦 Component Organization

### `components/layout/`
Layout-level components (Header, Navigation, etc.)

### `components/feed/`
Feed-related components (Video players, action bars, etc.)

### `components/profile/`
Profile-specific components

### `components/ui/`
Reusable UI primitives (buttons, inputs, cards, etc.)

## 🔧 Configuration Files

- `package.json` - Next.js project dependencies
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `next.config.js` - Next.js configuration
- `postcss.config.js` - PostCSS configuration

## 🚀 Next Steps

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Begin migrating existing components to new structure
4. Implement pages in `src/app/` routes



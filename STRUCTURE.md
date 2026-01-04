# VERTIKAL Project Structure

## 📁 Directory Structure

```
vertikal/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (/)
│   ├── globals.css        # Global styles
│   ├── home/              # Home route
│   ├── series/            # Series route
│   ├── shorts/            # Shorts route
│   ├── cinema/            # Cinema route
│   ├── profile/           # Profile route
│   └── studio/            # Studio route
├── components/            # React Components
│   ├── layout/           # Layout components
│   ├── feed/             # Feed components
│   ├── profile/          # Profile components
│   └── ui/               # UI components
├── hooks/                # Custom React Hooks
├── lib/                  # Library/Utility functions
├── public/               # Static assets
├── types/                # TypeScript type definitions
├── tsconfig.json         # TypeScript configuration
└── tailwind.config.ts    # Tailwind CSS configuration
```

## 🎯 Routes

- `/` → `app/page.tsx`
- `/home` → `app/home/page.tsx`
- `/series` → `app/series/page.tsx`
- `/shorts` → `app/shorts/page.tsx`
- `/cinema` → `app/cinema/page.tsx`
- `/profile` → `app/profile/page.tsx`
- `/studio` → `app/studio/page.tsx`

## 📦 Component Organization

- `components/layout/` - Layout components (Header, BottomNav)
- `components/feed/` - Feed-related components
- `components/profile/` - Profile components
- `components/ui/` - Reusable UI primitives

## 🔧 Configuration

- `tsconfig.json` - TypeScript config with `@/*` path alias
- `tailwind.config.ts` - Tailwind CSS with brand colors
- `next.config.js` - Next.js configuration



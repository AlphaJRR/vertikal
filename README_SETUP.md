# VERTIKAL App - Setup Instructions

## Project Overview

This is a production-grade React + TypeScript + Tailwind CSS application converted from the prototype HTML. The app provides a vertical video streaming platform for creators and networks.

## Tech Stack

- **React 18** with TypeScript
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Lucide React** (icons)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (optional, for Gemini API):
```
VITE_GEMINI_API_KEY=your_api_key_here
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, BottomNav
│   ├── cards/          # ProjectCard, CreatorAvatar, etc.
│   ├── features/       # DanmakuOverlay, FoundingBadge, VideoHero
│   └── modals/         # SubscriptionModal, InboxView, ChatView
├── pages/              # HomePage, ProfilePage, StudioPage, etc.
├── hooks/              # Custom React hooks
├── utils/              # Types, constants, helpers
├── data/               # JSON data files
└── styles/             # Global CSS
```

## Key Features

- **Home Feed**: Video hero with danmaku comments, project cards, continue watching
- **Creator Profiles**: Full profile pages with projects, shop, crew openings, BTS
- **Network Profiles**: Subscription-based network pages
- **Studio Tools**: AI-powered content creation tools (requires Gemini API key)
- **Messaging**: Direct messages and chat interface
- **Founding 50 Badge**: Special badge for founding creators

## Data Files

The app currently uses mock data in `App.tsx`. To use real data:

1. Populate `src/data/creators.json` with creator data
2. Populate `src/data/shows.json` with show data
3. Update `App.tsx` to load from JSON files instead of `MOCK_CREATORS`

## Customization

### Brand Colors

Edit `tailwind.config.js` to customize:
- Brand gradient (blue-purple)
- Gold gradient (for networks)
- App gradient (background)

### Animations

Custom animations are defined in:
- `tailwind.config.js` (keyframes)
- `src/styles/globals.css` (utility classes)

## Next Steps

1. Connect to backend API
2. Implement authentication
3. Add video player functionality
4. Integrate payment processing (Stripe)
5. Add real-time chat (WebSocket)
6. Deploy to production

## Notes

- The app is optimized for mobile-first vertical video viewing
- GPU acceleration classes are used for smooth 120Hz animations
- Haptic feedback is simulated via `navigator.vibrate` API
- All images are currently using external URLs (replace with local assets)



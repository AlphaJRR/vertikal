# VERTIKAL Mobile App

> A premium social media platform for vertical cinema

[![Expo](https://img.shields.io/badge/Expo-~49.0.15-black.svg?style=flat-square&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.72.6-blue.svg?style=flat-square&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

## 📱 Overview

VERTIKAL is a React Native mobile application built with Expo, featuring a premium design focused on vertical cinema content. The app includes advanced features like Vibe Mode (Danmaku-style comments), video playback, creator networks, and subscription management.

### Visual Identity: "Vertikal Master 12.29"
- **Background**: Pure Black (#000000)
- **Accents**: Premium Gold (#FFD700)
- **Effects**: Glassmorphism throughout
- **Style**: Cinematic, premium, creator-first

## ✨ Features

- 🎬 **5-Tab Navigation**: Home, Series, Shorts, Trailers, Profile
- 🎥 **Video Player**: Full-featured video playback with expo-av
- 💬 **Vibe Mode**: Danmaku-style comment overlay on videos
- 👥 **Creator Networks**: Distinction between Networks (gold) and Creators (blue)
- 💰 **Coin Balance**: Display and management ($150 default)
- 🔔 **Subscription Modal**: Premium subscription interface
- 📊 **Progress Tracking**: Continue Watching with progress bars
- 🎨 **Premium UI**: Glassmorphism effects and smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator
- Expo Go app on your phone (for physical device testing)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd Vertikal-App
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install additional required packages:**
   ```bash
   npm install expo-blur react-native-gesture-handler react-native-reanimated
   npm install react-native-safe-area-context
   ```

4. **Start the development server:**
   ```bash
   npx expo start
   ```

5. **Run on your preferred platform:**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app (physical device)

For detailed setup instructions, see [VERTIKAL_LAUNCH_GUIDE.md](./VERTIKAL_LAUNCH_GUIDE.md).

## 📁 Project Structure

```
Vertikal-App/
├── App.tsx                 # Main app entry point
├── app.json                # Expo configuration
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── babel.config.js         # Babel config (with NativeWind)
├── tailwind.config.js      # Tailwind/NativeWind config
├── assets/                 # App icons, splash screens
├── components/             # Reusable components
│   ├── video/             # Video player components
│   ├── modals/            # Modal components
│   └── layout/            # Layout components
├── constants/              # App constants (colors, etc.)
└── hooks/                  # Custom React hooks
```

## 🛠️ Tech Stack

- **Framework**: React Native 0.72.6
- **Build Tool**: Expo SDK ~49.0.15
- **Language**: TypeScript 5.1.3
- **Navigation**: React Navigation (@react-navigation/native)
- **Video**: expo-av
- **Styling**: StyleSheet (NativeWind configured)
- **Icons**: lucide-react-native
- **Gradients**: expo-linear-gradient

## 🎨 Design System

### Colors

```javascript
{
  black: '#000000',      // Primary background
  gold: '#FFD700',       // Premium accents
  surface: '#121212',    // Surface elements
  primary: '#3B82F6',    // Blue accents (Creators)
  purple: '#9333EA',     // Creator accents
}
```

### Navigation Tabs

1. **HOME** - Featured content, hero video, continue watching
2. **SERIES** - Series catalog (placeholder)
3. **SHORTS** - Short-form content (placeholder)
4. **TRAILERS** - Trailers and previews (placeholder)
5. **PROFILE** - User profile, stats, subscription

## 📦 Key Dependencies

```json
{
  "expo": "~49.0.15",
  "react-native": "0.72.6",
  "expo-av": "~13.4.1",
  "expo-linear-gradient": "~12.3.0",
  "lucide-react-native": "^0.2.0",
  "@react-navigation/native": "^6.0.0",
  "@react-navigation/bottom-tabs": "^6.0.0",
  "nativewind": "^2.0.11",
  "react-native-safe-area-context": "4.6.3"
}
```

## 🔧 Available Scripts

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS Simulator
npm run android    # Run on Android Emulator
npm run web        # Run in web browser
```

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler errors:**
   ```bash
   npx expo start -c  # Clear cache
   ```

2. **Module not found:**
   ```bash
   rm -rf node_modules && npm install
   ```

3. **Native module issues:**
   ```bash
   npx expo prebuild --clean
   ```

For more detailed troubleshooting, see [VERTIKAL_LAUNCH_GUIDE.md](./VERTIKAL_LAUNCH_GUIDE.md#step-7-handle-potential-issues).

## 📱 Building for Production

### Using EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 🧪 Testing Checklist

- [ ] App launches without errors
- [ ] All 5 tabs navigate correctly
- [ ] Video player loads and plays
- [ ] Vibe Mode toggle works
- [ ] Subscription modal displays correctly
- [ ] Profile screen renders properly
- [ ] Coin balance displays ($150)
- [ ] Creator circles show with correct borders
- [ ] Continue Watching cards display
- [ ] Progress bars show correctly
- [ ] All buttons are interactive
- [ ] Safe area respects device notches/home indicators

## 📝 Development Notes

- **Entry Point**: `App.tsx` (React Navigation, not Expo Router)
- **Styling**: Currently using StyleSheet (NativeWind configured for future use)
- **Video**: Uses expo-av for video playback
- **Navigation**: Bottom tab navigator with 5 screens

## 🤝 Contributing

1. Follow the "12.29" design spec
2. Maintain black/gold color scheme
3. Preserve 5-tab navigation structure
4. Test on both iOS and Android

## 📄 License

Private - All Rights Reserved

## 📞 Support

For setup issues, refer to [VERTIKAL_LAUNCH_GUIDE.md](./VERTIKAL_LAUNCH_GUIDE.md).

---

**Built with ❤️ for vertical cinema creators**


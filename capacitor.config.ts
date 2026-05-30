import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Alpha Visual Artists (AVA Media) - iOS WebView app
 * Loads the live website at alphavisualartists.com.
 * External links (Calendly, Shopify, Stripe) should open in Safari via @capacitor/browser on the website.
 */
const config: CapacitorConfig = {
  appId: 'com.alphavisualartists.app',
  appName: 'Alpha Visual Artists',
  webDir: 'dist',
  server: {
    url: 'https://alphavisualartists.com',
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'alphavisualartists.com',
    allowNavigation: [
      'https://alphavisualartists.com',
      'https://*.alphavisualartists.com',
      'https://www.alphavisualartists.com',
    ],
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#000000',
    allowsLinkPreview: false,
    limitsNavigationsToAppBoundDomains: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#FFD700'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000'
    },
    Camera: {
      permissions: {
        camera: 'This app needs access to your camera to take photos and videos for your portfolio.',
        photos: 'This app needs access to your photo library to select images for your portfolio.'
      }
    }
  }
};

export default config;

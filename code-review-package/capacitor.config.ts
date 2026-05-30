import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alphavisualartists.avamedia',
  appName: 'AVA Media',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'alphavisualartists.com',
    allowNavigation: [
      'https://alphavisualartists.com',
      'https://*.alphavisualartists.com',
      'https://vertikalapp.com',
      'https://*.vertikalapp.com'
    ]
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
        camera: 'This app needs access to your camera to take photos and videos.',
        photos: 'This app needs access to your photo library to select images.'
      }
    }
  }
};

export default config;

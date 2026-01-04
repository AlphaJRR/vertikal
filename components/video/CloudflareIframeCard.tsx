/**
 * Cloudflare Iframe Card Component
 * Renders Cloudflare Stream iframe in a 9:16 aspect ratio card
 * App-only feature for specific profile previews
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

interface CloudflareIframeCardProps {
  iframeUrl: string;
  title?: string;
  thumbnail?: string;
}

export const CloudflareIframeCard: React.FC<CloudflareIframeCardProps> = ({
  iframeUrl,
  title,
  thumbnail,
}) => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: iframeUrl }}
        style={styles.webview}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
      {title && (
        <View style={styles.titleOverlay}>
          {/* Title can be added here if needed */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginBottom: 16,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
  },
});


/**
 * Offline Banner Component
 * Displays when device is offline
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';

export const OfflineBanner: React.FC = React.memo(() => {
  return (
    <View style={styles.container}>
      <WifiOff color="#FFD700" size={16} />
      <Text style={styles.text}>No Connection</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  text: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});


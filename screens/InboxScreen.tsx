/**
 * Inbox Screen Component
 * VERTIKAL Brand Identity - Direct messages placeholder
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const InboxScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Ionicons name="chatbubble-ellipses-outline" size={64} color="#666666" />
        <Text style={styles.title}>INBOX</Text>
        <Text style={styles.subtitle}>Direct messages coming soon.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default InboxScreen;


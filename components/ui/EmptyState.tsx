/**
 * Empty State Component
 * Displays when no data is available
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RefreshCw } from 'lucide-react-native';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(({
  title = 'No Content Available',
  message = 'There\'s nothing here yet. Check back soon.',
  onRetry,
  retryLabel = 'RETRY',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <RefreshCw color="#000000" size={16} />
          <Text style={styles.retryText}>{retryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#000000',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    color: '#888888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  retryText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 14,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});


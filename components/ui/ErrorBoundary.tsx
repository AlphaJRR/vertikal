// components/ui/ErrorBoundary.tsx - With Sentry
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Sentry from '@sentry/react-native';
import { errorTelemetry } from '../../services/errorTelemetry';
import { errorRecovery } from '../../utils/errorRecovery';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console
    console.error('🔥 VERTIKAL ERROR CAUGHT:', error, errorInfo);
    
    // Store error info in state
    this.setState({ errorInfo });
    
    // Haptic feedback (error notification)
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    ).catch(() => {
      // Ignore haptic errors
    });
    
    // Send to Sentry with full context
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        error_boundary: 'root',
        component_stack_length: String(errorInfo.componentStack?.length || 0), // Convert to string for Sentry tags
      },
      level: 'fatal',
    });
  }

  resetError = () => {
    // Clear error state
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null,
    });
    
    // Haptic feedback (success)
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Medium
    ).catch(() => {
      // Ignore haptic errors
    });
    
    // Log recovery to Sentry
    Sentry.addBreadcrumb({
      category: 'error_boundary',
      message: 'User recovered from error',
      level: 'info',
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <AlertTriangle 
            color="#FFD700" 
            size={64} 
            style={{ marginBottom: 20 }} 
          />
          
          <Text style={styles.title}>Signal Lost</Text>
          
          <Text style={styles.message}>
            Something went wrong with the broadcast.
            {__DEV__ === true && this.state.error !== null && (
              <>
                {'\n\n'}
                <Text style={styles.errorDetail}>
                  DEV MODE:{'\n'}
                  {this.state.error.message}
                </Text>
              </>
            )}
          </Text>
          
          {/* Dev-only: Component stack */}
          {__DEV__ === true && this.state.errorInfo !== null && (
            <View style={styles.stackContainer}>
              <Text style={styles.stackTitle}>Component Stack:</Text>
              <Text style={styles.stackText}>
                {this.state.errorInfo.componentStack
                  ?.split('\n')
                  .slice(0, 5) // First 5 lines
                  .join('\n')}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={this.resetError}
            activeOpacity={0.8}
          >
            <RefreshCw 
              color="black" 
              size={20} 
              style={{ marginRight: 8 }} 
            />
            <Text style={styles.buttonText}>RECONNECT</Text>
          </TouchableOpacity>
          
          {/* Dev-only: Link to Sentry */}
          {__DEV__ === true && (
            <Text style={styles.sentryNote}>
              Error logged to Sentry (dev mode disabled)
            </Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: 1,
  },
  message: {
    color: '#999999',
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
    lineHeight: 20,
  },
  errorDetail: {
    color: '#FF4444',
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 10,
  },
  stackContainer: {
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    maxWidth: '90%',
  },
  stackTitle: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 6,
  },
  stackText: {
    color: '#999999',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  sentryNote: {
    color: '#666666',
    fontSize: 10,
    marginTop: 20,
    fontStyle: 'italic',
  },
});

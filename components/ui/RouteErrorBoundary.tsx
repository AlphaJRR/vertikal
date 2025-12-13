/**
 * Route Error Boundary Component
 * Granular error boundary for route-level error handling
 * Provides graceful failure and recovery for specific routes
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { errorTelemetry } from '../../services/errorTelemetry';

interface RouteErrorBoundaryProps {
  children: ReactNode;
  routeName: string;
  onRetry?: () => void;
  onBack?: () => void;
  fallback?: ReactNode;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<RouteErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Store error info
    this.setState({ errorInfo });

    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});

    // Log to telemetry
    errorTelemetry.captureError(error, {
      screen: this.props.routeName,
      action: 'route_error_boundary',
      metadata: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Log to console in dev
    if (__DEV__ === true) {
      console.error(`[RouteErrorBoundary] Error in route: ${this.props.routeName}`, error, errorInfo);
    }
  }

  handleRetry = () => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    // Log recovery
    errorTelemetry.logAction('route_error_recovery', {
      route: this.props.routeName,
    });

    // Call custom retry handler if provided
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleBack = () => {
    if (this.props.onBack) {
      this.props.onBack();
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <View style={styles.container}>
          <AlertTriangle color="#FFD700" size={64} style={{ marginBottom: 20 }} />
          <Text style={styles.title}>Route Error</Text>
          <Text style={styles.message}>
            Something went wrong on {this.props.routeName}.
          </Text>

          {__DEV__ === true && this.state.error && (
            <>
              <Text style={styles.errorDetail}>
                {this.state.error.message}
              </Text>
            </>
          )}

          <View style={styles.buttonRow}>
            {this.props.onBack && (
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={this.handleBack}
                activeOpacity={0.8}
              >
                <ArrowLeft color="#FFFFFF" size={20} style={{ marginRight: 8 }} />
                <Text style={styles.backButtonText}>BACK</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.retryButton]}
              onPress={this.handleRetry}
              activeOpacity={0.8}
            >
              <RefreshCw color="#000000" size={20} style={{ marginRight: 8 }} />
              <Text style={styles.retryButtonText}>RETRY</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  backButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  retryButton: {
    backgroundColor: '#FFD700',
  },
  retryButtonText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});


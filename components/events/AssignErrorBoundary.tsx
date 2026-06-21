import React, { Component, type PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { brandColors, brandFonts } from '@/constants/theme';

type State = { error: Error | null };

class AssignErrorBoundaryInner extends Component<
  PropsWithChildren<{ onBack: () => void; paddingTop: number }>,
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }): void {
    console.error('[AssignScreen] render crash:', error.message, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={[styles.root, { paddingTop: this.props.paddingTop }]}>
          <Text style={styles.title}>Assign photos unavailable</Text>
          <Text style={styles.message}>
            This screen hit an error. Go back, upload photos if needed, then try again.
          </Text>
          {__DEV__ ? (
            <Text style={styles.devError} selectable>
              {this.state.error.message}
            </Text>
          ) : null}
          <Pressable style={styles.btn} onPress={this.props.onBack}>
            <Text style={styles.btnText}>Go back</Text>
          </Pressable>
          <Pressable
            style={styles.linkBtn}
            onPress={() => this.setState({ error: null })}
          >
            <Text style={styles.linkText}>Try again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

export function AssignErrorBoundary({ children }: PropsWithChildren) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <AssignErrorBoundaryInner onBack={() => router.back()} paddingTop={insets.top}>
      {children}
    </AssignErrorBoundaryInner>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 24,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontFamily: brandFonts.display,
    fontSize: 26,
    color: '#fff',
    textTransform: 'uppercase',
  },
  message: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: brandColors.subtleText,
  },
  devError: {
    fontFamily: brandFonts.mono,
    fontSize: 11,
    color: brandColors.mutedText,
  },
  btn: {
    backgroundColor: '#00BFFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  linkBtn: { alignItems: 'center', paddingVertical: 8 },
  linkText: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: '#00BFFF',
  },
});

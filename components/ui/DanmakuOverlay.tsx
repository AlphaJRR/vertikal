/**
 * Danmaku Overlay Component - "The Daunt Effect"
 * Live scrolling comments floating over video
 * Right-to-left animation with proper positioning
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

export interface DanmakuComment {
  id: string;
  text: string;
  delay?: number;
  topPosition?: string;
  color?: string;
}

interface FlyingCommentProps {
  text: string;
  delay: number;
  topPosition: string;
  color?: string;
}

// Single Flying Comment Component
const FlyingComment: React.FC<FlyingCommentProps> = ({ text, delay, topPosition, color = '#FFFFFF' }) => {
  const position = useRef(new Animated.Value(width)).current; // Start off-screen right

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(position, {
        toValue: -width * 2, // Fly off-screen left
        duration: 8000 + Math.random() * 4000, // Random speed (8s-12s)
        useNativeDriver: true,
        delay: delay,
      })
    );
    
    animation.start();
    
    return () => {
      animation.stop();
    };
  }, [position, delay]);

  // Convert percentage string to number for Animated.View
  const topValue = typeof topPosition === 'string' && topPosition.endsWith('%')
    ? parseFloat(topPosition) / 100 * height
    : typeof topPosition === 'number' 
      ? topPosition 
      : 0;

  return (
    <Animated.View 
      style={[
        styles.flyer, 
        { 
          transform: [{ translateX: position }], 
          top: topValue,
        }
      ]}
    >
      <Text style={[styles.commentText, { color }]}>{text}</Text>
    </Animated.View>
  );
};

interface DanmakuOverlayProps {
  comments: DanmakuComment[];
  enabled?: boolean;
}

// The Overlay Container
export const DanmakuOverlay: React.FC<DanmakuOverlayProps> = ({ 
  comments, 
  enabled = true 
}) => {
  if (!enabled || !comments || comments.length === 0) {
    return null;
  }

  return (
    <View style={styles.overlayContainer} pointerEvents="none">
      {comments.map((comment, index) => (
        <FlyingComment 
          key={comment.id || `comment-${index}`}
          text={comment.text} 
          delay={comment.delay !== undefined ? comment.delay : index * 1500} // Stagger start times
          topPosition={comment.topPosition || `${10 + (index % 5) * 15}%`} // Spread vertically (10%, 25%, etc.)
          color={comment.color}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject, // LOCKS IT OVER THE VIDEO
    zIndex: 10, // Forces it to front
    justifyContent: 'center',
    overflow: 'hidden',
  },
  flyer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black pill
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  commentText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});


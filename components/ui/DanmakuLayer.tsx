/**
 * Danmaku Layer Component
 * UI-only component - displays scrolling text comments over video
 * Data-agnostic: accepts any comment data structure
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { sanitizeComment } from '../../utils/sanitization';

export interface DanmakuComment {
  id: string;
  text: string;
  timestamp?: number; // Video timestamp in seconds
  color?: string;
  position?: 'top' | 'middle' | 'bottom';
}

interface DanmakuLayerProps {
  comments: DanmakuComment[];
  videoDuration?: number;
  currentTime?: number;
  enabled?: boolean;
}

export const DanmakuLayer: React.FC<DanmakuLayerProps> = ({
  comments,
  videoDuration = 0,
  currentTime = 0,
  enabled = true,
}) => {
  const animatedValues = useRef<Map<string, Animated.Value>>(new Map());

  useEffect(() => {
    // Initialize animated values for each comment
    comments.forEach((comment) => {
      if (!animatedValues.current.has(comment.id)) {
        animatedValues.current.set(comment.id, new Animated.Value(0));
      }
    });
  }, [comments]);

  // ✅ SECURITY: Sanitize comments before rendering
  const sanitizedComments = comments.map(sanitizeComment);

  // Filter comments that should be visible at current time
  const visibleComments = sanitizedComments.filter((comment) => {
    if (!comment.timestamp) return true;
    const timeDiff = Math.abs((comment.timestamp || 0) - currentTime);
    return timeDiff < 5; // Show comments within 5 seconds of timestamp
  });

  if (!enabled || visibleComments.length === 0) {
    return null;
  }

  // ✅ PERFORMANCE: Memoize comment rendering
  const renderComment = useCallback((comment: DanmakuComment, index: number) => {
    const position = comment.position || ['top', 'middle', 'bottom'][index % 3];
    const color = comment.color || '#FFFFFF';
    const translateX = animatedValues.current.get(comment.id) || new Animated.Value(0);

    // Get position style
    const positionStyle = 
      position === 'top' ? styles.commentTop :
      position === 'middle' ? styles.commentMiddle :
      styles.commentBottom;

    // Animate comment scrolling (optimized)
    useEffect(() => {
      const animation = Animated.timing(translateX, {
        toValue: -1000,
        duration: 8000,
        useNativeDriver: true,
      });
      
      animation.start();
      
      // Cleanup animation on unmount
      return () => {
        animation.stop();
      };
    }, [translateX]);

    return (
      <Animated.View
        key={comment.id}
        style={[
          styles.commentContainer,
          positionStyle,
          {
            transform: [{ translateX }],
          },
        ]}
        accessibilityLabel={`Comment: ${comment.text}`}
      >
        <Text style={[styles.commentText, { color }]}>{comment.text}</Text>
      </Animated.View>
    );
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {visibleComments.map((comment, index) => renderComment(comment, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 1000,
  },
  commentContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  commentTop: {
    top: '20%',
  },
  commentMiddle: {
    top: '50%',
  },
  commentBottom: {
    top: '80%',
  },
  commentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});


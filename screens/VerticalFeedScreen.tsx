/**
 * Vertical Feed Screen Component
 * VERTIKAL Brand Identity - TikTok-style vertical video feed
 * FIXED: Removed database fetch, hardcoded videos
 */

import React, { useRef, useState, useCallback } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, RefreshControl } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');

// 🔴 YOUR VIDEO CONFIG
// PASTE YOUR SUPABASE URL HERE
const REAL_DOC_URL = 'https://videos.pexels.com/video-files/5439223/5439223-uhd_2732_1440_25fps.mp4'; 
// ^ Currently a Softball Placeholder. REPLACE THIS.

const VIDEOS = [
  { id: '1', url: REAL_DOC_URL, title: 'Beyond the Bases: S1 Finale', creator: 'J.R. Roberts' },
  { id: '2', url: 'https://videos.pexels.com/video-files/2882787/2882787-hd_720_1280_30fps.mp4', title: 'Neon City', creator: 'Visuals' },
];

export const VerticalFeedScreen: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  // Fallback height if hook fails
  const tabHeight = 85; 
  const VIDEO_HEIGHT = WINDOW_HEIGHT - tabHeight;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  // ✅ Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // In production, this would refetch data from API
    // For now, simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={VIDEOS}
        keyExtractor={keyExtractor}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        snapToInterval={VIDEO_HEIGHT}
        decelerationRate="fast"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFD700"
            colors={['#FFD700']}
          />
        }
        renderItem={renderItem}
        // ✅ PERFORMANCE: FlatList optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000' 
  },
  overlay: { 
    position: 'absolute', 
    bottom: 40, 
    left: 15 
  },
  title: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '700', 
    textShadowColor: 'rgba(0,0,0,0.8)', 
    textShadowRadius: 10 
  },
  creator: { 
    color: '#FFD700', 
    fontSize: 14, 
    fontWeight: '700', 
    marginTop: 4 
  }
});

export default VerticalFeedScreen;

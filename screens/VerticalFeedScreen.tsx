/**
 * Vertical Feed Screen Component
 * VERTIKAL Brand Identity - TikTok-style vertical video feed
 * FIXED: Removed database fetch, hardcoded videos
 */

import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet } from 'react-native';
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
  // Fallback height if hook fails
  const tabHeight = 85; 
  const VIDEO_HEIGHT = WINDOW_HEIGHT - tabHeight;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        data={VIDEOS}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        snapToInterval={VIDEO_HEIGHT}
        decelerationRate="fast"
        renderItem={({ item, index }) => (
          <View style={{ height: VIDEO_HEIGHT, width: WINDOW_WIDTH, backgroundColor: '#000000' }}>
            <Video
              source={{ uri: item.url }}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.COVER}
              shouldPlay={index === activeIndex}
              isLooping
            />
            <View style={styles.overlay}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.creator}>{item.creator}</Text>
            </View>
          </View>
        )}
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

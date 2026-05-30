/**
 * Vertical Feed Component
 * VERTIKAL Brand Identity - Snap enforced, mobile-first vertical scrolling
 */

import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { CreatorCard } from './CreatorCard';
import { ShowCard } from './ShowCard';
import { Founding50Rail } from './Founding50Rail';
import { CrewRow } from './CrewRow';
import { CategoryRails, Category } from './CategoryRails';
import { DanmakuLayer, DanmakuComment } from '../ui/DanmakuLayer';
import { DanmakuOverlay } from '../ui/DanmakuOverlay';
import { getFounding50Creators, getShows, Founding50Creator, ShowData } from '../../utils/dataLoader';
import { CloudflareIframeCard } from '../video/CloudflareIframeCard';

// ✅ HARD-LOCKED: Joshua Argue's Best Burgers video for hero autoplay
const JOSHUA_ARGUE_HERO_VIDEO = {
  id: "cf_9d3d0efed36b71e5f75c7b5e218809d7",
  title: "ARGUEably the Best Burgers",
  cloudflare: {
    uid: "9d3d0efed36b71e5f75c7b5e218809d7",
    iframe: "https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/iframe",
    thumbnail: "https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/thumbnails/thumbnail.jpg",
  },
  vibePreset: [
    { t: 2.5, u: "AVA_Member", m: "This intro is CRAZY 🔥" },
    { t: 6.0, u: "Founder50", m: "Vertical cinema is rotating. Not dying." },
    { t: 9.2, u: "BlackAwe", m: "Argue don't miss 🎬" },
    { t: 13.0, u: "KelFan", m: "That pacing is clean 😮‍💨" },
    { t: 18.5, u: "Showrunner", m: "This looks premium." },
    { t: 25.0, u: "Network", m: "We need Episode 1 ASAP." },
    { t: 33.0, u: "Creator", m: "The vibe overlay is the sauce." },
    { t: 45.0, u: "Viewer", m: "Okay… I'm locked in." },
  ],
};

interface VerticalFeedProps {
  onCreatorPress?: (creator: Founding50Creator) => void;
  onShowPress?: (show: ShowData) => void;
  onSeeAllFounding50?: () => void;
  currentUserId?: string;
  vibeModeEnabled?: boolean;
  onCategoryChange?: (categoryId: string) => void;
}

function VerticalFeed({
  onCreatorPress,
  onShowPress,
  onSeeAllFounding50,
  currentUserId,
  vibeModeEnabled = true, // ✅ REQUIREMENT: VIBE effect enabled on every vertical page
  onCategoryChange,
}: VerticalFeedProps) {
  // ✅ PHASE 1: Delay VIBE overlay initialization
  const [vibeReady, setVibeReady] = useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVibeReady(true);
    }, 1000); // 1s delay before enabling VIBE overlays
    return () => clearTimeout(timer);
  }, []);
  const creators = getFounding50Creators();
  const allShows = getShows();
  
  // ✅ HARD-LOCKED: Joshua Argue's Best Burgers video is ALWAYS the hero (UID: 9d3d0efed36b71e5f75c7b5e218809d7)
  // ✅ AUTOPLAY: Use CloudflareIframeCard for autoplay video
  const HERO_VIDEO_UID = "9d3d0efed36b71e5f75c7b5e218809d7";
  const shows = allShows.filter(s => 
    !s.title?.includes('Beyond the Bases') && 
    !s.title?.includes('BTB')
  ); // Remove BTB from hero eligibility
  const heroShow = shows.find(s => 
    s.id?.includes(HERO_VIDEO_UID) || 
    s.videoUrl?.includes(HERO_VIDEO_UID) ||
    (s.title?.includes('ARGUEably') || (s.title?.includes('Best Burgers') && !s.title?.includes('Beyond')))
  ) || shows[0]; // Fallback to first if not found
  const featuredShow = heroShow;
  const useJoshuaArgueHeroVideo = true; // ✅ ALWAYS use Joshua Argue's video for hero autoplay
  const continueWatching = shows.filter(s => s.progress > 0);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('for-you');

  const categories: Category[] = [
    { id: 'for-you', label: 'For You' },
    { id: 'networks', label: 'Networks' },
    { id: 'drama', label: 'Drama' },
    { id: 'docu', label: 'Docu' },
  ];

  // Mock Danmaku comments (in real app, these come from API)
  const danmakuComments: DanmakuComment[] = [
    { id: '1', text: 'is lighting is insane 🔥', timestamp: 5, color: '#FFFFFF', position: 'top' },
    { id: '2', text: 'Chicago represent! 🏙️', timestamp: 10, color: '#FFD700', position: 'middle' },
    { id: '3', text: 'This is fire', timestamp: 15, color: '#3B82F6', position: 'bottom' },
  ];

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionTitleLine} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      </View>
      {children}
    </View>
  );

  // ✅ PERFORMANCE: Memoized render functions with useCallback
  const renderCreatorItem = useCallback(({ item }: { item: Founding50Creator }) => (
    <CreatorCard
      creator={item}
      onPress={() => onCreatorPress?.(item)}
    />
  ), [onCreatorPress]);

  const renderShowItem = useCallback(({ item }: { item: ShowData }) => (
    <ShowCard
      show={item}
      variant="grid"
      onPress={() => onShowPress?.(item)}
    />
  ), [onShowPress]);

  const renderHorizontalShow = useCallback(({ item }: { item: ShowData }) => (
    <ShowCard
      show={item}
      variant="horizontal"
      onPress={() => onShowPress?.(item)}
    />
  ), [onShowPress]);

  // ✅ PERFORMANCE: Memoized key extractors
  const keyExtractor = useCallback((item: ShowData | Founding50Creator) => item.id, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      snapToInterval={1}
      decelerationRate="fast"
    >
      {/* Hero Featured Show - Joshua Argue's Best Burgers (AUTOPLAY) */}
      {useJoshuaArgueHeroVideo && (
        <View style={styles.heroSection}>
          <View style={styles.heroContainer}>
            {/* ✅ AUTOPLAY: Cloudflare iframe with autoplay enabled */}
            <CloudflareIframeCard
              iframeUrl={JOSHUA_ARGUE_HERO_VIDEO.cloudflare.iframe}
              title={JOSHUA_ARGUE_HERO_VIDEO.title}
              thumbnail={JOSHUA_ARGUE_HERO_VIDEO.cloudflare.thumbnail}
            />
            {/* 🔥 DAUNT EFFECT OVERLAY 🔥 */}
            {/* ✅ VIBE comments from Joshua Argue video preset */}
            <DanmakuOverlay
              comments={JOSHUA_ARGUE_HERO_VIDEO.vibePreset.map((preset, index) => ({
                id: `joshua-hero-${index}`,
                text: `${preset.u}: ${preset.m}`,
                delay: preset.t * 1000, // Convert seconds to milliseconds
                topPosition: `${10 + (index % 7) * 12}%`,
                color: '#FFD700',
              }))}
              enabled={vibeModeEnabled && vibeReady}
            />
          </View>
          {/* Category Rails */}
          <CategoryRails
            categories={categories}
            selectedCategoryId={selectedCategory}
            onCategoryPress={(category) => {
              setSelectedCategory(category.id);
              onCategoryChange?.(category.id);
            }}
          />
          {/* Crew Row */}
          <CrewRow
            crew={creators.slice(0, 5)}
            currentUserId={currentUserId}
            onCreatorPress={onCreatorPress}
            onAddPress={() => {
              // TODO: Navigate to add crew screen
              console.log('Add crew pressed');
            }}
          />
        </View>
      )}

      {/* Continue Watching */}
      {continueWatching.length > 0 && renderSection(
        'CONTINUE WATCHING',
        <FlatList
          data={continueWatching}
          renderItem={renderHorizontalShow}
          keyExtractor={keyExtractor}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          nestedScrollEnabled={true}
          snapToInterval={336}
          decelerationRate="fast"
        />
      )}

      {/* Director Originals */}
      {renderSection(
        'DIRECTOR ORIGINALS',
        <FlatList
          data={shows}
          renderItem={renderHorizontalShow}
          keyExtractor={keyExtractor}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          nestedScrollEnabled={true}
          snapToInterval={336}
          decelerationRate="fast"
        />
      )}

      {/* Founding 50 Rail */}
      <Founding50Rail
        creators={creators}
        onCreatorPress={onCreatorPress}
        onSeeAllPress={onSeeAllFounding50 || (() => {
          // TODO: Navigate to full Founding 50 list
          console.log('See All Founding 50 pressed');
        })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  heroSection: {
    marginBottom: 8,
  },
  heroContainer: {
    position: 'relative',
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleLine: {
    width: 4,
    height: 24,
    backgroundColor: '#FFD700',
    marginRight: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  creatorsList: {
    paddingBottom: 8,
  },
  horizontalList: {
    paddingRight: 16,
  },
  showsGrid: {
    paddingBottom: 16,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
});

export { VerticalFeed };
export default VerticalFeed;


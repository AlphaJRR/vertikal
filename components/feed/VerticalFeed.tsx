/**
 * Vertical Feed Component
 * VERTIKAL Brand Identity - Snap enforced, mobile-first vertical scrolling
 */

import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { CreatorCard } from './CreatorCard';
import { ShowCard } from './ShowCard';
import { Founding50Rail } from './Founding50Rail';
import { CrewRow } from './CrewRow';
import { CategoryRails, Category } from './CategoryRails';
import { DanmakuLayer, DanmakuComment } from '../ui/DanmakuLayer';
import { DanmakuOverlay } from '../ui/DanmakuOverlay';
import { getFounding50Creators, getShows, Founding50Creator, ShowData } from '../../utils/dataLoader';

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
  vibeModeEnabled = true,
  onCategoryChange,
}: VerticalFeedProps) {
  const creators = getFounding50Creators();
  const shows = getShows();
  const featuredShow = shows[0];
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

  const renderCreatorItem = ({ item }: { item: Founding50Creator }) => (
    <CreatorCard
      creator={item}
      onPress={() => onCreatorPress?.(item)}
    />
  );

  const renderShowItem = ({ item }: { item: ShowData }) => (
    <ShowCard
      show={item}
      variant="grid"
      onPress={() => onShowPress?.(item)}
    />
  );

  const renderHorizontalShow = ({ item }: { item: ShowData }) => (
    <ShowCard
      show={item}
      variant="horizontal"
      onPress={() => onShowPress?.(item)}
    />
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      snapToInterval={1}
      decelerationRate="fast"
    >
      {/* Hero Featured Show */}
      {featuredShow && (
        <View style={styles.heroSection}>
          <View style={styles.heroContainer}>
            <ShowCard
              show={featuredShow}
              variant="hero"
              onPress={() => onShowPress?.(featuredShow)}
            />
            {/* 🔥 DAUNT EFFECT OVERLAY 🔥 */}
            <DanmakuOverlay
              comments={danmakuComments.map((comment, index) => ({
                id: comment.id,
                text: comment.text,
                delay: index * 1500,
                topPosition: `${10 + (index % 5) * 15}%`,
                color: comment.color,
              }))}
              enabled={vibeModeEnabled}
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
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
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
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
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


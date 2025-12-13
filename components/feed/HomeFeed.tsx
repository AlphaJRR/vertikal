/**
 * Home Feed Component
 * VERTIKAL Brand Identity - Premium vertical cinema feed
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Play, TrendingUp } from 'lucide-react-native';
import { getFounding50Creators, getShows, Founding50Creator, ShowData } from '../../utils/dataLoader';

interface HomeFeedProps {
  onCreatorPress?: (creator: Founding50Creator) => void;
  onShowPress?: (show: ShowData) => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ onCreatorPress, onShowPress }) => {
  const creators = getFounding50Creators();
  const shows = getShows();
  const featuredShow = shows[0]; // First show as featured

  const renderCreatorCard = ({ item }: { item: Founding50Creator }) => {
    const borderColor = item.isFounding50 ? '#FFD700' : item.type === 'network' ? '#FFD700' : '#3B82F6';
    const borderWidth = item.isFounding50 ? 3 : item.type === 'network' ? 2 : 1;

    return (
      <TouchableOpacity
        style={styles.creatorCard}
        onPress={() => onCreatorPress?.(item)}
        activeOpacity={0.8}
      >
        <View style={[styles.avatarContainer, { borderColor, borderWidth }]}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          {item.isFounding50 && (
            <View style={styles.founding50Badge}>
              <Crown size={12} color="#000000" fill="#FFD700" />
            </View>
          )}
        </View>
        <View style={styles.creatorInfo}>
          <Text style={styles.creatorName}>{item.name}</Text>
          <Text style={styles.creatorRole}>{item.role}</Text>
          {item.stats && (
            <View style={styles.statsRow}>
              <Text style={styles.statText}>{item.stats.fans} fans</Text>
              <Text style={styles.statDivider}>•</Text>
              <Text style={styles.statText}>{item.stats.series} series</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderShowCard = ({ item }: { item: ShowData }) => {
    const progressPercent = Math.round(item.progress * 100);

    return (
      <TouchableOpacity
        style={styles.showCard}
        onPress={() => onShowPress?.(item)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.coverImage }} style={styles.showImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.showGradient}
        >
          <View style={styles.showContent}>
            <View style={styles.showHeader}>
              <Text style={styles.showType}>{item.type}</Text>
              {item.progress > 0 && (
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                </View>
              )}
            </View>
            <Text style={styles.showTitle}>{item.title}</Text>
            <Text style={styles.showSubtitle}>{item.subTitle}</Text>
            <View style={styles.showFooter}>
              <Image source={{ uri: item.creatorAvatar }} style={styles.creatorThumbnail} />
              <Text style={styles.showCreator}>{item.creatorName}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      {featuredShow && (
        <View style={styles.heroSection}>
          <TouchableOpacity
            style={styles.heroCard}
            onPress={() => onShowPress?.(featuredShow)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: featuredShow.coverImage }} style={styles.heroImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.95)']}
              style={styles.heroGradient}
            >
              <View style={styles.heroBadge}>
                <TrendingUp size={16} color="#FFD700" />
                <Text style={styles.heroBadgeText}>FEATURED</Text>
              </View>
              <View style={styles.heroContent}>
                <Text style={styles.heroType}>{featuredShow.type}</Text>
                <Text style={styles.heroTitle}>{featuredShow.title}</Text>
                <Text style={styles.heroSubtitle}>{featuredShow.subTitle}</Text>
                <TouchableOpacity style={styles.playButton}>
                  <Play size={20} color="#000000" fill="#000000" />
                  <Text style={styles.playButtonText}>WATCH NOW</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Founding 50 Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Crown size={20} color="#FFD700" fill="#FFD700" />
          <Text style={styles.sectionTitle}>FOUNDING 50</Text>
        </View>
        <FlatList
          data={creators}
          renderItem={renderCreatorCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.creatorsList}
        />
      </View>

      {/* Continue Watching */}
      {shows.filter((s: ShowData) => s.progress > 0).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTINUE WATCHING</Text>
          <FlatList
            data={shows.filter((s: ShowData) => s.progress > 0)}
            renderItem={renderShowCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.showsList}
          />
        </View>
      )}

      {/* All Shows */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ALL SHOWS</Text>
        <FlatList
          data={shows}
          renderItem={renderShowCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.showsGrid}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  heroSection: {
    marginBottom: 24,
  },
  heroCard: {
    width: '100%',
    height: 400,
    borderRadius: 0,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  heroBadgeText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginLeft: 6,
  },
  heroContent: {
    width: '100%',
  },
  heroType: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 16,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    marginLeft: 8,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    marginLeft: 8,
  },
  creatorsList: {
    paddingRight: 16,
  },
  creatorCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 100,
  },
  avatarContainer: {
    position: 'relative',
    borderRadius: 50,
    padding: 2,
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  founding50Badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  creatorInfo: {
    alignItems: 'center',
    width: '100%',
  },
  creatorName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  creatorRole: {
    color: '#999999',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#666666',
    fontSize: 9,
  },
  statDivider: {
    color: '#666666',
    fontSize: 9,
    marginHorizontal: 4,
  },
  showsList: {
    paddingRight: 16,
  },
  showsGrid: {
    paddingBottom: 16,
  },
  showCard: {
    width: 280,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
  },
  showImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  showGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  showContent: {
    width: '100%',
  },
  showHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  showType: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  progressBar: {
    width: 60,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  showTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  showSubtitle: {
    color: '#CCCCCC',
    fontSize: 12,
    marginBottom: 8,
  },
  showFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorThumbnail: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  showCreator: {
    color: '#999999',
    fontSize: 11,
  },
});


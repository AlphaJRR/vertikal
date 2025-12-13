/**
 * Show Card Component
 * VERTIKAL Brand Identity - Cinematic thumbnails, titles, tags
 */

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Clock } from 'lucide-react-native';
import { ShowData } from '../../utils/dataLoader';
import { sanitizeShowData } from '../../utils/sanitization';

interface ShowCardProps {
  show: ShowData;
  onPress?: () => void;
  variant?: 'hero' | 'grid' | 'horizontal';
}

export const ShowCard: React.FC<ShowCardProps> = React.memo(({ show, onPress, variant = 'grid' }) => {
  // ✅ SECURITY: Sanitize data before rendering
  const safeShow = sanitizeShowData(show);
  const progressPercent = Math.round(safeShow.progress * 100);
  const isHero = variant === 'hero';
  const isHorizontal = variant === 'horizontal';

  if (isHero) {
    return (
      <TouchableOpacity
        style={styles.heroContainer}
        onPress={onPress}
        activeOpacity={0.95}
      >
        <Image source={{ uri: show.coverImage }} style={styles.heroImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.95)']}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{safeShow.type}</Text>
            </View>
            <Text style={styles.heroTitle}>{safeShow.title}</Text>
            <Text style={styles.heroSubtitle}>{safeShow.subTitle}</Text>
            {safeShow.description && (
              <Text style={styles.heroDescription} numberOfLines={2}>
                {safeShow.description}
              </Text>
            )}
            <TouchableOpacity style={styles.playButton}>
              <Play size={20} color="#000000" fill="#000000" />
              <Text style={styles.playButtonText}>WATCH NOW</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const cardStyle = isHorizontal ? styles.horizontalCard : styles.gridCard;
  const imageStyle = isHorizontal ? styles.horizontalImage : styles.gridImage;

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`Watch ${safeShow.title}`}
    >
      {safeShow.coverImage && (
        <Image 
          source={{ uri: safeShow.coverImage }} 
          style={imageStyle}
          accessibilityLabel={`${safeShow.title} cover image`}
        />
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.showType}>{safeShow.type}</Text>
            {safeShow.progress > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                </View>
                <Text style={styles.progressText}>{progressPercent}%</Text>
              </View>
            )}
          </View>
          <Text style={styles.showTitle} numberOfLines={2}>{safeShow.title}</Text>
          <Text style={styles.showSubtitle} numberOfLines={1}>{safeShow.subTitle}</Text>
          <View style={styles.showFooter}>
            {safeShow.creatorAvatar && (
              <Image 
                source={{ uri: safeShow.creatorAvatar }} 
                style={styles.creatorThumbnail}
                accessibilityLabel={`${safeShow.creatorName} avatar`}
              />
            )}
            <Text style={styles.showCreator} numberOfLines={1}>{safeShow.creatorName}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // ✅ PERFORMANCE: Custom comparison for React.memo
  return prevProps.show.id === nextProps.show.id &&
         prevProps.show.title === nextProps.show.title &&
         prevProps.show.coverImage === nextProps.show.coverImage &&
         prevProps.variant === nextProps.variant;
});

const styles = StyleSheet.create({
  // Hero Variant
  heroContainer: {
    width: '100%',
    height: 500,
    borderRadius: 0,
    overflow: 'hidden',
    marginBottom: 24,
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
    height: '65%',
    justifyContent: 'flex-end',
    padding: 24,
  },
  heroContent: {
    width: '100%',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  heroBadgeText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#CCCCCC',
    fontSize: 16,
    marginBottom: 12,
  },
  heroDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 28,
    paddingVertical: 14,
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
  // Grid/Horizontal Variants
  gridCard: {
    width: '48%',
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
  },
  horizontalCard: {
    width: 320,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#1A1A1A',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  horizontalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  cardContent: {
    width: '100%',
  },
  cardHeader: {
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    width: 50,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  progressText: {
    color: '#FFD700',
    fontSize: 9,
    fontWeight: '700',
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
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 6,
  },
  showCreator: {
    color: '#999999',
    fontSize: 11,
    flex: 1,
  },
});


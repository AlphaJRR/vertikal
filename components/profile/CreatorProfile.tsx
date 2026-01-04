/**
 * Creator Profile Component
 * VERTIKAL Brand Identity - Premium creator profile display
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Play, Users, Film, Eye, ArrowLeft } from 'lucide-react-native';
import { getCreatorById, getShowsByCreator, Founding50Creator, ShowData } from '../../utils/dataLoader';
import { CloudflareIframeCard } from '../video/CloudflareIframeCard';
import { DanmakuOverlay, DanmakuComment } from '../ui/DanmakuOverlay';
import { getAVAVideoData } from '../../utils/avaVideoSeed';

interface CreatorProfileProps {
  creatorId: string;
  onBack?: () => void;
  onShowPress?: (show: ShowData) => void;
  currentUserId?: string;
}

export const CreatorProfile: React.FC<CreatorProfileProps> = ({
  creatorId,
  onBack,
  onShowPress,
  currentUserId,
}) => {
  const creator = getCreatorById(creatorId);
  const shows = getCreatorById(creatorId) ? getShowsByCreator(creatorId) : [];
  const isCurrentUser = creatorId === currentUserId;
  
  // Check if AVA video should be shown (app-only, profile preview only)
  // Match on: creatorId ('Alpha'), creator name ('Alpha Visuals'), or any handle/username/slug
  const avaVideoData = getAVAVideoData(creatorId, creator?.id, creator?.name, undefined, creator?.name);
  const shouldShowAVAVideo = avaVideoData !== null;
  
  // Convert VIBE preset to DanmakuComment format
  const vibeComments: DanmakuComment[] = avaVideoData?.vibePreset.map((preset, i) => ({
    id: `ava-vibe-${i}`,
    text: `${preset.u}: ${preset.m}`,
    delay: preset.t * 1000, // Convert seconds to milliseconds
    topPosition: `${10 + (i * 12)}%`,
    color: '#FFD700', // Gold color for VIBE comments
  })) || [];

  if (!creator) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Creator not found</Text>
      </View>
    );
  }

  const borderColor = creator.isFounding50 ? '#FFD700' : creator.type === 'network' ? '#FFD700' : '#3B82F6';
  const borderWidth = creator.isFounding50 ? 4 : creator.type === 'network' ? 3 : 2;

  const renderShowCard = (show: ShowData) => {
    const progressPercent = Math.round(show.progress * 100);

    return (
      <TouchableOpacity
        key={show.id}
        style={styles.showCard}
        onPress={() => onShowPress?.(show)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: show.coverImage }} style={styles.showImage} />
        <View style={styles.showOverlay}>
          <View style={styles.showInfo}>
            <Text style={styles.showType}>{show.type}</Text>
            <Text style={styles.showTitle}>{show.title}</Text>
            <Text style={styles.showSubtitle}>{show.subTitle}</Text>
            {show.progress > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                </View>
                <Text style={styles.progressText}>{progressPercent}%</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Header */}
      <View style={[styles.profileHeader, isCurrentUser && styles.profileHeaderCentered]}>
        <View style={[styles.avatarContainer, { borderColor, borderWidth }, isCurrentUser && styles.currentUserAvatarContainer]}>
          <Image source={{ uri: creator.avatar }} style={styles.avatar} />
          {creator.isFounding50 && (
            <View style={styles.founding50Badge}>
              <Crown size={16} color="#000000" fill="#FFD700" />
            </View>
          )}
        </View>
        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.creatorName}>{creator.name}</Text>
            {creator.isFounding50 && (
              <View style={styles.founding50Tag}>
                <Text style={styles.founding50Text}>FOUNDING 50</Text>
              </View>
            )}
          </View>
          <Text style={styles.creatorRole}>{creator.role}</Text>
          {creator.type === 'network' && (
            <View style={styles.networkBadge}>
              <Text style={styles.networkText}>NETWORK</Text>
            </View>
          )}
        </View>
      </View>

      {/* Stats */}
      {creator.stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Users size={20} color="#FFD700" />
            <Text style={styles.statValue}>{creator.stats.fans}</Text>
            <Text style={styles.statLabel}>Fans</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Film size={20} color="#FFD700" />
            <Text style={styles.statValue}>{creator.stats.series}</Text>
            <Text style={styles.statLabel}>Series</Text>
          </View>
          {creator.stats.views && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Eye size={20} color="#FFD700" />
                <Text style={styles.statValue}>{creator.stats.views}</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
            </>
          )}
        </View>
      )}

      {/* Bio */}
      {creator.bio && (
        <View style={styles.bioSection}>
          <Text style={styles.bioText}>{creator.bio}</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        {/* Follow Button (Everyone sees this) */}
        <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.8}>
          <Text style={styles.btnTextPrimary}>Follow</Text>
        </TouchableOpacity>

        {/* 🔥 CONDITIONAL DM BUTTON 🔥 */}
        {/* TODO: Replace with actual auth context check */}
        {(() => {
          // Mock: Check if current user is CREATOR or PRODUCTION
          // In real app: const { user: currentUser } = useAuth();
          // const isPrivileged = currentUser?.role === 'CREATOR' || currentUser?.role === 'PRODUCTION';
          const isPrivileged = false; // TODO: Get from auth context
          
          return isPrivileged ? (
            // If Creator/Production -> Show Message Button
            <TouchableOpacity 
              style={styles.btnSecondary}
              onPress={() => {
                // TODO: Navigate to ChatDetail screen
                console.log('Navigate to DM with:', creator.id);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.btnTextSecondary}>Message</Text>
            </TouchableOpacity>
          ) : (
            // If Viewer -> Show "Public Comment" Button instead
            <TouchableOpacity 
              style={styles.btnSecondary}
              onPress={() => {
                // TODO: Open comment sheet/modal
                console.log('Open public comment sheet');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.btnTextSecondary}>Leave Comment</Text>
            </TouchableOpacity>
          );
        })()}
      </View>

      {/* AVA Video Preview - App-only, Alpha Visual Artists profile only */}
      {shouldShowAVAVideo && avaVideoData && (
        <View style={styles.videoSection}>
          <View style={styles.videoContainer}>
            <CloudflareIframeCard
              iframeUrl={avaVideoData.cloudflare.iframe}
              title={avaVideoData.title}
              thumbnail={avaVideoData.cloudflare.thumbnail}
            />
            {/* VIBE Overlay */}
            <DanmakuOverlay comments={vibeComments} enabled={true} />
          </View>
        </View>
      )}

      {/* Shows Section */}
      <View style={styles.showsSection}>
        <Text style={styles.sectionTitle}>SHOWS</Text>
        {shows.length > 0 ? (
          <View style={styles.showsGrid}>
            {shows.map(renderShowCard)}
          </View>
        ) : (
          <Text style={styles.emptyText}>No shows available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  profileHeaderCentered: {
    // ✅ FIXED: Current user profile gets centered layout override
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  avatarContainer: {
    position: 'relative',
    borderRadius: 60,
    padding: 4,
    marginBottom: 16,
  },
  currentUserAvatarContainer: {
    // ✅ FIXED: Current user avatar gets special styling
    borderWidth: 4,
    borderColor: '#FFD700',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  founding50Badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFD700',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  creatorName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
    marginRight: 8,
  },
  founding50Tag: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  founding50Text: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  creatorRole: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  networkBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  networkText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1A1A1A',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 8,
  },
  statLabel: {
    color: '#999999',
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#1A1A1A',
    marginHorizontal: 16,
  },
  bioSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  bioText: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  showsSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
  },
  showsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  showCard: {
    width: '48%',
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
  },
  showImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  showOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 12,
  },
  showInfo: {
    width: '100%',
  },
  showType: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  showTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },
  showSubtitle: {
    color: '#CCCCCC',
    fontSize: 11,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  progressText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '700',
  },
  emptyText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    padding: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextPrimary: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextSecondary: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  videoSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
  },
});


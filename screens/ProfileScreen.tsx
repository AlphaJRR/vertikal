/**
 * Profile Screen Component
 * VERTIKAL Brand Identity - User Profile with Backend Integration
 * FIXED: Connected to backend API, Founding 50 badge visibility
 */

import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCurrentUser } from '../hooks/useAuth';

const { width } = Dimensions.get('window');

// Fallback avatar if none provided
const DEFAULT_AVATAR = 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { data: currentUser, isLoading, error } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'SHOWS' | 'CREW'>('SHOWS');
  
  // Determine role from backend data
  const userRole = currentUser?.profile?.type || 'VIEWER';
  const isCreator = userRole === 'CREATOR';
  const isFounding50 = currentUser?.profile?.isFounding50 || false;
  
  // Profile data from backend or fallbacks
  const displayName = currentUser?.profile?.displayName || currentUser?.username || 'Guest';
  const avatarUrl = currentUser?.profile?.avatarUrl || DEFAULT_AVATAR;
  const bio = currentUser?.profile?.bio || '';
  const followerCount = currentUser?.profile?.followerCount || 0;
  const totalViews = currentUser?.profile?.totalViews || 0;
  
  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load profile</Text>
          <Text style={styles.errorSubtext}>Please check your connection</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>@{currentUser?.username || 'guest'}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Inbox' as never)} activeOpacity={0.7}>
          <Ionicons name="mail-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* IDENTITY SECTION */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <Text style={styles.name}>{displayName}</Text>
          <View style={styles.badgeRow}>
            {/* Founding 50 Badge - Only show if user is Founding 50 */}
            {isFounding50 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>FOUNDING 50</Text>
              </View>
            )}
            {/* Verified Badge - Show if verified */}
            {currentUser?.profile?.isVerified && (
              <View style={[styles.badge, styles.verifiedBadge]}>
                <Ionicons name="checkmark-circle" size={12} color="#000" />
                <Text style={styles.badgeText}>VERIFIED</Text>
              </View>
            )}
            {/* Role Text */}
            {bio ? (
              <Text style={styles.roleText}>{bio}</Text>
            ) : (
              <Text style={styles.roleText}>{isCreator ? 'Creator' : 'Viewer'}</Text>
            )}
          </View>
          
          {/* ACTION BUTTONS */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
              <Text style={styles.editBtnText}>{isCreator ? 'Edit Profile' : 'Follow'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
              <Ionicons name="share-social-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* STATS */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{formatNumber(followerCount)}</Text>
              <Text style={styles.statLabel}>Fans</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNum}>0</Text>
              <Text style={styles.statLabel}>Series</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{formatNumber(totalViews)}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
          </View>
        </View>

        {/* TAB SELECTOR */}
        <View style={styles.tabRow}>
          <TouchableOpacity 
            onPress={() => setActiveTab('SHOWS')} 
            style={[styles.tab, activeTab === 'SHOWS' && styles.activeTab]}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'SHOWS' && styles.activeTabText]}>SHOWS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('CREW')} 
            style={[styles.tab, activeTab === 'CREW' && styles.activeTab]}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'CREW' && styles.activeTabText]}>MY CREW</Text>
          </TouchableOpacity>
        </View>

        {/* SHOWS GRID */}
        {activeTab === 'SHOWS' ? (
          <View style={styles.grid}>
            {/* BEYOND THE BASES FEATURE */}
            <TouchableOpacity 
              style={styles.showCardLarge} 
              onPress={() => navigation.navigate('Shorts' as never)}
              activeOpacity={0.8}
            >
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/186641/pexels-photo-186641.jpeg' }} 
                style={styles.showImg} 
              />
              <View style={styles.showOverlay}>
                <Text style={styles.showTitle}>Beyond the Bases: Finale</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ padding: 20 }}>
            <Text style={{ color: '#666666' }}>Crew list loading...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerTitle: { 
    color: '#FFFFFF', 
    fontWeight: '700',
    fontSize: 16,
  },
  profileHeader: { 
    alignItems: 'center', 
    padding: 20 
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderWidth: 3, 
    borderColor: '#FFD700', 
    marginBottom: 15 
  },
  name: { 
    color: '#FFFFFF', 
    fontSize: 22, 
    fontWeight: '900' 
  },
  badgeRow: { 
    flexDirection: 'row', 
    gap: 10, 
    marginTop: 5,
    alignItems: 'center',
  },
  badge: { 
    backgroundColor: '#FFD700', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4 
  },
          badgeText: { 
            fontWeight: '900', 
            fontSize: 10,
            color: '#000000',
          },
          verifiedBadge: {
            backgroundColor: '#00FF94',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          },
          loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          loadingText: {
            color: '#FFFFFF',
            marginTop: 16,
            fontSize: 16,
          },
          errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          },
          errorText: {
            color: '#FF4444',
            fontSize: 18,
            fontWeight: '700',
            marginBottom: 8,
          },
          errorSubtext: {
            color: '#666666',
            fontSize: 14,
          },
  roleText: { 
    color: '#888888', 
    fontSize: 12 
  },
  actionRow: { 
    flexDirection: 'row', 
    gap: 10, 
    marginTop: 20 
  },
  editBtn: { 
    backgroundColor: '#333333', 
    paddingVertical: 10, 
    paddingHorizontal: 30, 
    borderRadius: 8 
  },
  editBtnText: { 
    color: '#FFFFFF', 
    fontWeight: '700' 
  },
  iconBtn: { 
    backgroundColor: '#333333', 
    padding: 10, 
    borderRadius: 8 
  },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%', 
    marginTop: 25, 
    borderTopWidth: 1, 
    borderTopColor: '#222222', 
    paddingTop: 15 
  },
  stat: { 
    alignItems: 'center' 
  },
  statNum: { 
    color: '#FFFFFF', 
    fontWeight: '900', 
    fontSize: 18 
  },
  statLabel: { 
    color: '#666666', 
    fontSize: 12 
  },
  tabRow: { 
    flexDirection: 'row', 
    marginTop: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#222222' 
  },
  tab: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 15 
  },
  activeTab: { 
    borderBottomWidth: 2, 
    borderBottomColor: '#FFD700' 
  },
  tabText: { 
    color: '#666666', 
    fontWeight: '700' 
  },
  activeTabText: { 
    color: '#FFFFFF' 
  },
  grid: { 
    padding: 10 
  },
  showCardLarge: { 
    width: '100%', 
    height: 200, 
    borderRadius: 12, 
    marginBottom: 10, 
    overflow: 'hidden' 
  },
  showImg: { 
    width: '100%', 
    height: '100%' 
  },
  showOverlay: { 
    position: 'absolute', 
    bottom: 10, 
    left: 10, 
    backgroundColor: 'rgba(0,0,0,0.8)', 
    padding: 8, 
    borderRadius: 4 
  },
  showTitle: { 
    color: '#FFFFFF', 
    fontWeight: '700',
    fontSize: 14,
  }
});

export default ProfileScreen;

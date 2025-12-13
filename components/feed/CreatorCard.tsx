/**
 * Creator Card Component
 * VERTIKAL Brand Identity - Real data, real avatars, real bios
 */

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Users, Film } from 'lucide-react-native';
import { Founding50Creator } from '../../utils/dataLoader';
import { sanitizeCreatorData } from '../../utils/sanitization';

interface CreatorCardProps {
  creator: Founding50Creator;
  onPress?: () => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = React.memo(({ creator, onPress }) => {
  // ✅ SECURITY: Sanitize data before rendering
  const safeCreator = sanitizeCreatorData(creator);
  const borderColor = safeCreator.isFounding50 ? '#FFD700' : safeCreator.type === 'network' ? '#FFD700' : '#3B82F6';
  const borderWidth = safeCreator.isFounding50 ? 3 : safeCreator.type === 'network' ? 2 : 1;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`View ${safeCreator.name} profile`}
    >
      <View style={[styles.avatarContainer, { borderColor, borderWidth }]}>
        {safeCreator.avatar && (
          <Image 
            source={{ uri: safeCreator.avatar }} 
            style={styles.avatar}
            accessibilityLabel={`${safeCreator.name} avatar`}
          />
        )}
        {safeCreator.isFounding50 && (
          <View style={styles.founding50Badge}>
            <Crown size={14} color="#000000" fill="#FFD700" />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{safeCreator.name}</Text>
          {safeCreator.type === 'network' && (
            <View style={styles.networkTag}>
              <Text style={styles.networkText}>NETWORK</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.role} numberOfLines={1}>{safeCreator.role}</Text>
        
        {safeCreator.bio && (
          <Text style={styles.bio} numberOfLines={2}>{safeCreator.bio}</Text>
        )}
        
        {safeCreator.stats && (
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Users size={12} color="#FFD700" />
              <Text style={styles.statText}>{safeCreator.stats.fans}</Text>
            </View>
            <View style={styles.statItem}>
              <Film size={12} color="#FFD700" />
              <Text style={styles.statText}>{safeCreator.stats.series}</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // ✅ PERFORMANCE: Custom comparison for React.memo
  return prevProps.creator.id === nextProps.creator.id &&
         prevProps.creator.name === nextProps.creator.name &&
         prevProps.creator.avatar === nextProps.creator.avatar;
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  avatarContainer: {
    position: 'relative',
    borderRadius: 40,
    padding: 2,
    marginRight: 16,
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
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginRight: 8,
    flex: 1,
  },
  networkTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  networkText: {
    color: '#FFD700',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  role: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  bio: {
    color: '#CCCCCC',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
});


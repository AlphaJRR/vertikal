/**
 * Founding 50 Rail Component
 * Horizontal scroll with "See All" CTA
 * UI composition layer - accepts any creator data
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { ChevronRight, Crown } from 'lucide-react-native';
import { Founding50Creator } from '../../utils/dataLoader';

interface Founding50RailProps {
  creators: Founding50Creator[];
  onCreatorPress?: (creator: Founding50Creator) => void;
  onSeeAllPress?: () => void;
}

export const Founding50Rail: React.FC<Founding50RailProps> = ({
  creators,
  onCreatorPress,
  onSeeAllPress,
}) => {
  const renderCreator = ({ item }: { item: Founding50Creator }) => {
    const borderColor = item.isFounding50 ? '#FFD700' : item.type === 'network' ? '#FFD700' : '#3B82F6';
    const borderWidth = item.isFounding50 ? 2 : item.type === 'network' ? 2 : 1;

    return (
      <TouchableOpacity
        style={styles.creatorItem}
        onPress={() => onCreatorPress?.(item)}
        activeOpacity={0.8}
      >
        <View style={[styles.avatarContainer, { borderColor, borderWidth }]}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          {item.isFounding50 && (
            <View style={styles.crownBadge}>
              <Crown size={10} color="#000000" fill="#FFD700" />
            </View>
          )}
        </View>
        <Text style={styles.creatorName} numberOfLines={1}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Crown size={18} color="#FFD700" fill="#FFD700" />
          <Text style={styles.title}>FOUNDING 50</Text>
        </View>
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={onSeeAllPress}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={16} color="#FFD700" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={creators}
        renderItem={renderCreator}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    marginLeft: 8,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
  },
  list: {
    paddingRight: 16,
    paddingLeft: 0,
    gap: 16,
  },
  creatorItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  avatarContainer: {
    position: 'relative',
    borderRadius: 35,
    padding: 2,
    marginBottom: 8,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  crownBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  creatorName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
});


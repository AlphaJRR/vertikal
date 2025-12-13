/**
 * Founding 50 Row Component
 * Horizontal scroll of Founding 50 creators (like avatars at top)
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Crown } from 'lucide-react-native';
import { Founding50Creator } from '../../utils/dataLoader';

interface Founding50RowProps {
  creators: Founding50Creator[];
  onCreatorPress?: (creator: Founding50Creator) => void;
}

export const Founding50Row: React.FC<Founding50RowProps> = ({ creators, onCreatorPress }) => {
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
      <FlatList
        data={creators}
        renderItem={renderCreator}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  list: {
    paddingHorizontal: 16,
    paddingRight: 16,
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


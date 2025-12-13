/**
 * Crew Row Component
 * Displays crew/creator avatars under hero section
 * UI composition layer - accepts any creator data
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Founding50Creator } from '../../utils/dataLoader';

interface CrewRowProps {
  crew: Founding50Creator[];
  currentUserId?: string;
  onCreatorPress?: (creator: Founding50Creator) => void;
  onAddPress?: () => void;
}

export const CrewRow: React.FC<CrewRowProps> = ({
  crew,
  currentUserId,
  onCreatorPress,
  onAddPress,
}) => {
  const renderCreator = ({ item, index }: { item: Founding50Creator; index: number }) => {
    const isCurrentUser = item.id === currentUserId;

    return (
      <TouchableOpacity
        style={[styles.creatorItem, isCurrentUser && styles.currentUserItem]}
        onPress={() => onCreatorPress?.(item)}
        activeOpacity={0.8}
      >
        <View style={[styles.avatarContainer, isCurrentUser && styles.currentUserAvatar]}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        </View>
        <Text style={[styles.creatorName, isCurrentUser && styles.currentUserName]} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={crew}
        renderItem={renderCreator}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddPress}
            activeOpacity={0.8}
          >
            <View style={styles.addButtonInner}>
              <Plus size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 24,
  },
  list: {
    paddingHorizontal: 16,
    paddingRight: 16,
  },
  addButton: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  addButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  creatorItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  currentUserItem: {
    // Current user gets special styling
  },
  avatarContainer: {
    borderRadius: 35,
    padding: 2,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currentUserAvatar: {
    borderColor: '#FFD700',
    borderWidth: 3,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  creatorName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  currentUserName: {
    color: '#FFD700',
    fontWeight: '700',
  },
});


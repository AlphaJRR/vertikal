/**
 * Crew Screen Component
 * VERTIKAL Brand Identity - Network/Crew display
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CREW_MEMBERS = [
  { id: '1', name: 'Joshua Argue', role: 'Director', image: 'https://ui-avatars.com/api/?name=Joshua+Argue&background=0D8ABC&color=fff&size=128' },
  { id: '2', name: 'J.R. Roberts', role: 'Producer', image: 'https://ui-avatars.com/api/?name=JR+Roberts&background=ffd700&color=000&size=128' },
  { id: '3', name: 'Sarah Jenkins', role: 'Editor', image: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=ff00ff&color=fff&size=128' },
  { id: '4', name: 'Marcus Cole', role: 'Sound', image: 'https://ui-avatars.com/api/?name=Marcus+Cole&background=00ff00&color=000&size=128' },
  { id: '5', name: 'Alpha Team', role: 'Camera', image: 'https://ui-avatars.com/api/?name=Alpha+Visuals&background=ff0000&color=fff&size=128' },
  { id: '6', name: 'Vertikal AI', role: 'System', image: 'https://ui-avatars.com/api/?name=Vertikal+AI&background=333&color=fff&size=128' },
];

export const CrewScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>CREW NETWORK</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={CREW_MEMBERS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <Image source={{ uri: item.image }} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PRO</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  title: { 
    color: '#FFD700', 
    fontSize: 24, 
    fontWeight: '900', 
    letterSpacing: 2 
  },
  list: {
    padding: 15,
  },
  row: { 
    justifyContent: 'space-between',
  },
  card: { 
    backgroundColor: '#111111', 
    width: (width / 2) - 25, 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 20, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#222222',
    position: 'relative',
  },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#333333',
  },
  name: { 
    color: '#FFFFFF', 
    fontWeight: '700', 
    fontSize: 14, 
    marginBottom: 4,
    textAlign: 'center',
  },
  role: { 
    color: '#888888', 
    fontSize: 11, 
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badge: { 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    backgroundColor: '#FFD700', 
    paddingHorizontal: 6, 
    paddingVertical: 2,
    borderRadius: 4 
  },
  badgeText: { 
    color: '#000000', 
    fontSize: 8, 
    fontWeight: '900',
    letterSpacing: 0.5,
  }
});

export default CrewScreen;


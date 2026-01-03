/**
 * Jobs Screen Component
 * VERTIKAL Brand Identity - Production Jobs / Gig Economy
 * FIXED: Creator avatars and profile links added
 */

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRequireAuth } from '../hooks/useRequireAuth';

const JOBS = [
  { id: '1', title: 'Music Video Director', location: 'Chicago, IL', rate: '$5,000 / day', type: 'PAID', postedBy: 'Black Awesomeness', avatar: 'https://ui-avatars.com/api/?name=Black+Awesomeness&background=000&color=fff' },
  { id: '2', title: 'Boom Operator Needed', location: 'Atlanta, GA', rate: '$400 / day', type: 'PAID', postedBy: 'Alpha Visuals', avatar: 'https://ui-avatars.com/api/?name=Alpha+Visuals&background=ff00ff&color=fff' },
  { id: '3', title: 'Indie Short Film Collab', location: 'Los Angeles, CA', rate: 'Copy / Credit', type: 'UNPAID', postedBy: 'J.R. Roberts', avatar: 'https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg' },
];

export const JobsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { requireAuth } = useRequireAuth();

  const handlePostJob = () => {
    requireAuth('post a job', () => {
      // TODO: Navigate to post job screen
      console.log('Post job');
    });
  };

  const handleApplyJob = (jobId: string) => {
    requireAuth('apply for this job', () => {
      // TODO: Navigate to apply screen
      console.log('Apply for job:', jobId);
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>PRODUCTION JOBS</Text>
        <TouchableOpacity style={styles.postBtn} activeOpacity={0.8} onPress={handlePostJob}>
          <Ionicons name="add" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={JOBS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => handleApplyJob(item.id)}>
            {/* JOB HEADER */}
            <View style={styles.row}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              {item.type === 'PAID' ? (
                <View style={styles.tagPaid}>
                  <Text style={styles.tagText}>PAID</Text>
                </View>
              ) : (
                <View style={styles.tagCollab}>
                  <Text style={styles.tagText}>COLLAB</Text>
                </View>
              )}
            </View>

            {/* CREATOR LINK */}
            <TouchableOpacity 
              style={styles.creatorRow} 
              onPress={() => navigation.navigate('Profile' as never, { userId: item.id })}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.avatar }} style={styles.tinyAvatar} />
              <Text style={styles.poster}>Posted by {item.postedBy} ›</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <View style={styles.iconRow}>
                <Ionicons name="location-outline" size={14} color="#666666" />
                <Text style={styles.meta}>{item.location}</Text>
              </View>
              <Text style={[styles.rate, item.rate.includes('Credit') && { color: '#FF4444' }]}>
                {item.rate}
              </Text>
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
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  title: { 
    color: '#FFD700', 
    fontSize: 22, 
    fontWeight: '900', 
    letterSpacing: 2 
  },
  postBtn: { 
    backgroundColor: '#FFD700', 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  card: { 
    backgroundColor: '#111111', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#222222' 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start' 
  },
  jobTitle: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '700', 
    flex: 1, 
    marginRight: 10 
  },
  tagPaid: { 
    backgroundColor: '#00FF94', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4 
  },
  tagCollab: { 
    backgroundColor: '#FFD700', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4 
  },
  tagText: { 
    color: '#000000', 
    fontSize: 10, 
    fontWeight: '900' 
  },
  creatorRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 8, 
    marginBottom: 12 
  },
  tinyAvatar: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#333333',
  },
  poster: { 
    color: '#888888', 
    fontSize: 13 
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#222222', 
    paddingTop: 10 
  },
  iconRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4 
  },
  meta: { 
    color: '#666666', 
    fontSize: 12 
  },
  rate: { 
    color: '#00FF94', 
    fontSize: 14, 
    fontWeight: '700' 
  }
});

export default JobsScreen;

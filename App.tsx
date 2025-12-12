import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, 
  Dimensions, StatusBar, Modal, FlatList, Animated 
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Video } from 'expo-av'; 
import { LinearGradient } from 'expo-linear-gradient'; 
import { Home, Tv, Smartphone, Clapperboard, User, MessageSquare, Plus, Play, CheckCircle, Globe, X, Wand2 } from 'lucide-react-native';

// --- ASSETS & CONSTANTS (Master 12.29) ---
const COLORS = {
  black: '#000000',
  gold: '#FFD700', // Vertikal Gold
  surface: '#121212',
  text: '#FFFFFF',
  primary: '#3B82F6', // Blue Accents
  purple: '#9333EA', // Creator Accents
};

const CREATORS = [
  { id: '1', name: 'Black Awesomeness', type: 'network', avatar: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200', role: 'Production Network' },
  { id: '2', name: 'Alpha Visuals', type: 'network', avatar: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=200', role: 'Production Network' },
  { id: '3', name: 'Joshua Argue', type: 'creator', avatar: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200', role: 'Showrunner' },
  { id: '4', name: 'Kel Mitchell', type: 'creator', avatar: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200', role: 'Executive Producer' },
];

const PROJECTS = [
  { id: '1', title: 'The Last Echo', type: 'SERIES', img: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400', progress: 0.7 },
  { id: '2', title: 'Midnight Run', type: 'DOCU', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400', progress: 0.3 },
  { id: '3', title: 'Best Burgers', type: 'DOCU', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', progress: 0 },
];

// --- COMPONENTS ---

const Header = () => (
  <View style={styles.header}>
    <View style={styles.logoRow}>
        <View style={styles.logoIcon}><Text style={styles.logoSymbol}>V</Text></View>
        <Text style={styles.logoText}>VERTIKAL</Text>
    </View>
    <View style={styles.headerIcons}>
        <View style={styles.coinPill}><Text style={styles.coinText}>$ 150</Text></View>
        <TouchableOpacity>
            <MessageSquare color="white" size={24} />
            <View style={styles.redDot} />
        </TouchableOpacity>
    </View>
  </View>
);

const DanmakuOverlay = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <View style={styles.danmakuContainer} pointerEvents="none">
        <Text style={[styles.danmakuText, { top: '15%', left: '100%' }]}>This lighting is insane 🔥</Text>
        <Text style={[styles.danmakuText, { top: '30%', left: '100%' }]}>Wait for the drop... 🎥</Text>
        <Text style={[styles.danmakuText, { top: '45%', left: '100%' }]}>Chicago represent! 🏙️</Text>
    </View>
  );
};

const SubscriptionModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => (
    <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Vertikal Premium</Text>
                    <TouchableOpacity onPress={onClose}><X color="#666" size={24} /></TouchableOpacity>
                </View>
                <LinearGradient colors={['#1e3a8a', '#581c87']} style={styles.subCard}>
                    <View style={styles.subIcon}><Text style={styles.subIconText}>V+</Text></View>
                    <View>
                        <Text style={styles.subCardTitle}>All Access Pass</Text>
                        <Text style={styles.subCardDesc}>Unlock All 12 Founding Networks</Text>
                    </View>
                </LinearGradient>
                <TouchableOpacity style={styles.subButton}>
                    <Text style={styles.subButtonText}>Subscribe $4.99/mo</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

// --- SCREENS ---

const HomeScreen = () => {
  const [vibeOn, setVibeOn] = useState(false);
  const video = useRef<Video>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <View style={styles.heroContainer}>
            <Video
                ref={video}
                style={styles.video}
                source={{ uri: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-working-out-with-heavy-ropes-in-the-gym-43750-large.mp4' }}
                resizeMode="cover"
                isLooping
                shouldPlay
                isMuted
            />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)', 'black']} style={styles.gradient} />
            <DanmakuOverlay active={vibeOn} />
            
            {/* Vibe Toggle */}
            <TouchableOpacity 
                style={[styles.vibeButton, vibeOn && styles.vibeButtonActive]} 
                onPress={() => setVibeOn(!vibeOn)}
            >
                <Text style={styles.vibeText}>{vibeOn ? 'VIBE ON' : 'VIBE OFF'}</Text>
            </TouchableOpacity>

            <View style={styles.heroContent}>
                <Text style={styles.featuredTag}>★ FEATURED PREMIERE</Text>
                <Text style={styles.heroTitle}>BEYOND THE BASES</Text>
                <View style={styles.heroMeta}>
                    <Text style={styles.matchTag}>98% Match</Text>
                    <Text style={styles.genreTag}>Sports Docu</Text>
                </View>
                
                <View style={styles.heroActions}>
                    <TouchableOpacity style={styles.playButton}>
                        <Play fill="black" size={16} color="black"/>
                        <Text style={styles.playText}>PLAY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton}>
                        <Plus size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Creator Circles */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.creatorRow}>
                    <View style={styles.addCreator}>
                        <View style={styles.addCreatorCircle}><Plus size={20} color="#666"/></View>
                        <Text style={styles.creatorName}>Add</Text>
                    </View>
                    {CREATORS.map((c) => (
                        <View key={c.id} style={styles.creatorItem}>
                            <Image source={{ uri: c.avatar }} style={[styles.avatar, c.type === 'network' ? styles.netBorder : styles.creBorder]} />
                            <Text style={styles.creatorName} numberOfLines={1}>{c.name.split(' ')[0]}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>

        {/* CONTINUE WATCHING */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Continue Watching</Text>
                <Text style={styles.seeAll}>See All</Text>
            </View>
            <FlatList 
                horizontal
                showsHorizontalScrollIndicator={false}
                data={PROJECTS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.projectCard}>
                        <Image source={{ uri: item.img }} style={styles.projectImg} />
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${item.progress * 100}%` }]} />
                        </View>
                        <Text style={styles.projectTitle}>{item.title}</Text>
                        <Text style={styles.projectSub}>S1:E3 • 12m left</Text>
                    </View>
                )}
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileScreen = () => {
    const [subVisible, setSubVisible] = useState(false);
    return (
        <SafeAreaView style={styles.container}>
            <SubscriptionModal visible={subVisible} onClose={() => setSubVisible(false)} />
            <ScrollView>
                <View style={styles.profileHeader}>
                    <View style={[styles.largeAvatarContainer, styles.netBorder]}>
                        <Image source={{ uri: CREATORS[0].avatar }} style={styles.largeAvatar} />
                        <View style={styles.foundingBadge}><Text style={styles.badgeText}>FOUNDING 50</Text></View>
                    </View>
                    <Text style={styles.profileName}>Black Awesomeness</Text>
                    <View style={styles.roleRow}><Globe size={12} color="#888"/><Text style={styles.roleText}>Production Network</Text></View>
                    
                    <View style={styles.statsRow}>
                        <View style={styles.stat}><Text style={styles.statNum}>150k</Text><Text style={styles.statLabel}>SUBS</Text></View>
                        <View style={styles.stat}><Text style={styles.statNum}>12</Text><Text style={styles.statLabel}>SERIES</Text></View>
                        <View style={styles.stat}><Text style={[styles.statNum, {color: COLORS.gold}]}>2.5M</Text><Text style={styles.statLabel}>VIEWS</Text></View>
                    </View>

                    <TouchableOpacity style={styles.subButtonProfile} onPress={() => setSubVisible(true)}>
                        <Text style={styles.subButtonTextBlack}>SUBSCRIBE $4.99</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const Placeholder = ({name}: {name:string}) => (
    <View style={styles.center}><Text style={{color:'white'}}>{name} Content</Text></View>
);

// --- NAVIGATION CONFIG ---

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
        <NavigationContainer>
        <Tab.Navigator
            screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: COLORS.text,
            tabBarInactiveTintColor: '#555',
            tabBarShowLabel: true,
            tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold', marginTop: -5 }
            }}
        >
            <Tab.Screen name="HOME" component={HomeScreen} options={{ tabBarIcon: ({color}) => <Home color={color} size={24} /> }} />
            <Tab.Screen name="SERIES" component={() => <Placeholder name="Series"/>} options={{ tabBarIcon: ({color}) => <Tv color={color} size={24} /> }} />
            <Tab.Screen name="SHORTS" component={() => <Placeholder name="Shorts"/>} options={{ tabBarIcon: ({color}) => <Smartphone color={color} size={24} /> }} />
            <Tab.Screen name="TRAILERS" component={() => <Placeholder name="Trailers"/>} options={{ tabBarIcon: ({color}) => <Clapperboard color={color} size={24} /> }} />
            <Tab.Screen name="PROFILE" component={ProfileScreen} options={{ tabBarIcon: ({color}) => <User color={color} size={24} /> }} />
        </Tab.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.black },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, position: 'absolute', top: 40, left: 0, right: 0, zIndex: 50 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 8, backgroundColor: '#333' },
  logoSymbol: { color: 'white', fontWeight: '900' },
  logoText: { color: 'white', fontWeight: '900', fontSize: 18 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  coinPill: { backgroundColor: '#1A1A1A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 12, borderWidth: 1, borderColor: '#333' },
  coinText: { color: COLORS.gold, fontWeight: 'bold', fontSize: 12 },
  redDot: { width: 8, height: 8, backgroundColor: 'red', borderRadius: 4, position: 'absolute', top: -2, right: -2 },

  // Hero
  heroContainer: { height: 600, width: '100%', position: 'relative' },
  video: { width: '100%', height: '100%' },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 300 },
  
  vibeButton: { position: 'absolute', top: 100, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  vibeButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  vibeText: { color: 'white', fontSize: 10, fontWeight: '900' },

  danmakuContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 },
  danmakuText: { color: 'white', fontWeight: 'bold', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', padding: 5, borderRadius: 10 },

  heroContent: { position: 'absolute', bottom: 0, width: '100%', padding: 20, alignItems: 'center' },
  featuredTag: { color: COLORS.primary, fontWeight: '900', fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  heroTitle: { color: 'white', fontSize: 42, fontWeight: '900', fontStyle: 'italic', textAlign: 'center', marginBottom: 8 },
  heroMeta: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  matchTag: { color: '#4ADE80', backgroundColor: 'rgba(74, 222, 128, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontSize: 10, fontWeight: 'bold' },
  genreTag: { color: '#60A5FA', backgroundColor: 'rgba(96, 165, 250, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontSize: 10, fontWeight: 'bold' },

  heroActions: { flexDirection: 'row', gap: 12, width: '100%', marginBottom: 24 },
  playButton: { flex: 1, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 8, gap: 8 },
  playText: { color: 'black', fontWeight: '900' },
  addButton: { width: 50, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },

  creatorRow: { width: '100%', paddingLeft: 10 },
  addCreator: { alignItems: 'center', marginRight: 16, width: 60 },
  addCreatorCircle: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#333', justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed' },
  creatorItem: { alignItems: 'center', marginRight: 16, width: 60 },
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2 },
  netBorder: { borderColor: COLORS.gold },
  creBorder: { borderColor: COLORS.primary },
  creatorName: { color: 'white', fontSize: 10, marginTop: 4 },

  // Sections
  section: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  seeAll: { color: '#666', fontSize: 12 },
  projectCard: { marginRight: 16, width: 140 },
  projectImg: { width: 140, height: 200, borderRadius: 8, backgroundColor: '#333' },
  projectTitle: { color: 'white', fontSize: 12, fontWeight: 'bold', marginTop: 8 },
  projectSub: { color: '#666', fontSize: 10 },
  progressBarBg: { height: 2, backgroundColor: '#333', marginTop: -2, width: '100%' },
  progressBarFill: { height: 2, backgroundColor: 'red' },

  // Profile
  profileHeader: { alignItems: 'center', padding: 20 },
  largeAvatarContainer: { padding: 4, borderRadius: 100, borderWidth: 2, marginBottom: 15, position: 'relative' },
  largeAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#333' },
  foundingBadge: { position: 'absolute', bottom: -10, alignSelf: 'center', backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10, borderWidth: 1, borderColor: '#475569' },
  badgeText: { color: 'white', fontSize: 8, fontWeight: '900' },
  profileName: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  roleRow: { flexDirection: 'row', gap: 4, alignItems: 'center', marginBottom: 20 },
  roleText: { color: '#888', fontSize: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 24, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#222', paddingVertical: 15 },
  stat: { alignItems: 'center' },
  statNum: { color: 'white', fontSize: 20, fontWeight: '900' },
  statLabel: { color: '#666', fontSize: 10, letterSpacing: 1, marginTop: 2 },
  subButtonProfile: { width: '100%', backgroundColor: COLORS.gold, padding: 14, borderRadius: 8, alignItems: 'center' },
  subButtonTextBlack: { color: 'black', fontWeight: '900' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#111', borderRadius: 20, padding: 20, borderTopWidth: 1, borderColor: '#333' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  subCard: { borderRadius: 12, padding: 20, flexDirection: 'row', gap: 15, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(147, 51, 234, 0.5)' },
  subIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  subIconText: { color: 'black', fontWeight: '900' },
  subCardTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  subCardDesc: { color: '#ccc', fontSize: 12 },
  subButton: { width: '100%', backgroundColor: 'white', padding: 15, borderRadius: 10, alignItems: 'center' },
  subButtonText: { color: 'black', fontWeight: '900', fontSize: 16 },

  // Tab Bar
  tabBar: { backgroundColor: COLORS.black, borderTopColor: '#333', height: 90, paddingBottom: 30, paddingTop: 10 },
});


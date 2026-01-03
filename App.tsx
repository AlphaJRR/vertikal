// App.tsx - VERTIKAL Brand Identity UI
import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, ActivityIndicator, StyleSheet, 
  TouchableOpacity, FlatList, Image, ScrollView
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react-native';
import { Home, Tv, Smartphone, User, Briefcase } from 'lucide-react-native';
// Initialize react-native-screens early to prevent type errors
import 'react-native-screens';

// Components
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { RouteErrorBoundary } from './components/ui/RouteErrorBoundary';
import { VerticalFeed } from './components/feed/VerticalFeed';
import { CreatorProfile } from './components/profile/CreatorProfile';
import { NavigationBar } from './components/layout/NavigationBar';
import { DevRoleSwitcher } from './components/DevRoleSwitcher';
import { JobsScreen } from './screens/JobsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { VerticalFeedScreen } from './screens/VerticalFeedScreen';
import { HowYouEarnScreen } from './screens/HowYouEarnScreen';

// Utils
import { initSentry } from './utils/sentry';
import { Founding50Creator, ShowData } from './utils/dataLoader';

// Hooks
import { useCreators, useProjects } from './hooks/useApi';
import { useCurrentUser } from './hooks/useAuth';

// Types - imported from hooks (they transform backend data)
// Note: Creator and Project types are defined in hooks/useCreators.ts and data.ts

// Initialize Sentry
initSentry();

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// ============================================
// LOADING SCREEN COMPONENT
// ============================================
const LoadingScreen: React.FC<{ message?: string }> = ({ message }) => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" color="#FFD700" />
    <Text style={styles.loadingText}>{message || 'Loading VERTIKAL...'}</Text>
  </View>
);

// ============================================
// ERROR SCREEN COMPONENT
// ============================================
const ErrorScreen: React.FC<{ 
  error: Error; 
  retry: () => void;
}> = ({ error, retry }) => (
  <View style={styles.centerContainer}>
    <Text style={styles.errorTitle}>Connection Lost</Text>
    <Text style={styles.errorMessage}>{error.message}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={retry}>
      <Text style={styles.retryText}>RETRY</Text>
    </TouchableOpacity>
  </View>
);

// ============================================
// HOME TAB (VERTIKAL Brand Identity - Vertical Feed)
// ============================================
const HomeTab: React.FC = () => {
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);
  // ✅ PHASE 1: Delay feed initialization
  const [feedReady, setFeedReady] = useState(false);

  // ✅ PHASE 1: Delay feed fetch until after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setFeedReady(true);
    }, 500); // 500ms delay before enabling feed
    return () => clearTimeout(timer);
  }, []);

  // Track screen view in Sentry
  useEffect(() => {
    if (feedReady) {
      Sentry.addBreadcrumb({
        category: 'navigation',
        message: 'Navigated to Home tab',
        level: 'info',
      });
    }
  }, [feedReady]);

  // Show creator profile if selected
  if (selectedCreatorId) {
    return (
      <RouteErrorBoundary
        routeName="CreatorProfile"
        onBack={() => setSelectedCreatorId(null)}
        onRetry={() => {
          // Retry by resetting and refetching
          setSelectedCreatorId(null);
          setTimeout(() => setSelectedCreatorId(selectedCreatorId), 100);
        }}
      >
        <View style={{ flex: 1 }}>
          <CreatorProfile
            creatorId={selectedCreatorId}
            onBack={() => setSelectedCreatorId(null)}
            onShowPress={(show) => {
              setSelectedShowId(show.id);
              Sentry.addBreadcrumb({
                category: 'navigation',
                message: `Viewing show: ${show.title}`,
                level: 'info',
              });
            }}
            currentUserId="joshuaroberts" // TODO: Get from auth context
          />
        </View>
      </RouteErrorBoundary>
    );
  }

  // ✅ PHASE 1: Show loading until feed is ready
  if (!feedReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <LoadingScreen message="Loading feed..." />
      </View>
    );
  }

  // Show vertical feed with VERTIKAL brand styling
  return (
    <RouteErrorBoundary
      routeName="HomeFeed"
      onRetry={() => {
        // Retry by forcing re-render
        window.location?.reload?.();
      }}
    >
      <View style={{ flex: 1 }}>
        <VerticalFeed
          onCreatorPress={(creator) => {
            setSelectedCreatorId(creator.id);
            Sentry.addBreadcrumb({
              category: 'navigation',
              message: `Viewing creator profile: ${creator.name}`,
              level: 'info',
            });
          }}
          onShowPress={(show) => {
            setSelectedShowId(show.id);
            Sentry.addBreadcrumb({
              category: 'navigation',
              message: `Viewing show: ${show.title}`,
              level: 'info',
            });
          }}
          onSeeAllFounding50={() => {
            // TODO: Navigate to full Founding 50 list screen
            console.log('See All Founding 50');
          }}
          currentUserId="joshuaroberts" // TODO: Get from auth context
          vibeModeEnabled={false} // ✅ PHASE 1: Disable VIBE overlays on mount
        />
      </View>
    </RouteErrorBoundary>
  );
};

// ============================================
// OTHER TABS
// ============================================
const SeriesTab: React.FC = () => {
  const { data: projects, isLoading, error, refetch } = useProjects();

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Navigated to Series tab',
      level: 'info',
    });
  }, []);

  if (isLoading) return <LoadingScreen message="Loading series..." />;
  if (error) return <ErrorScreen error={error as Error} retry={refetch} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SERIES</Text>
      {projects && projects.length > 0 ? (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.projectCard}>
              <Image source={{ uri: item.img }} style={styles.projectImage} />
              <Text style={styles.projectTitle}>{item.title}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No series available</Text>
      )}
    </View>
  );
};

const ShortsTab: React.FC = () => {
  const { data: projects, isLoading, error, refetch } = useProjects();

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Navigated to Shorts tab',
      level: 'info',
    });
  }, []);

  if (isLoading) return <LoadingScreen message="Loading shorts..." />;
  if (error) return <ErrorScreen error={error as Error} retry={refetch} />;

  const shorts = projects?.filter(p => p.type === 'SHORT') || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SHORTS</Text>
      {shorts.length > 0 ? (
        <FlatList
          data={shorts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.projectCard}>
              <Image source={{ uri: item.img }} style={styles.projectImage} />
              <Text style={styles.projectTitle}>{item.title}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No shorts available</Text>
      )}
    </View>
  );
};

const ProfileTab: React.FC = () => {
  const { data: currentUser, isLoading, error } = useCurrentUser();
  
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Navigated to Profile tab',
      level: 'info',
    });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.profileContent}>
      <Text style={styles.title}>PROFILE</Text>
      {isLoading ? (
        <LoadingScreen message="Loading profile..." />
      ) : error ? (
        <View style={styles.profileInfo}>
          <Text style={styles.emptyText}>Not logged in</Text>
          <Text style={styles.profileEmail}>Sign in to view your profile</Text>
        </View>
      ) : currentUser ? (
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{currentUser.profile?.displayName || currentUser.username}</Text>
          <Text style={styles.profileEmail}>{currentUser.email}</Text>
          <Text style={styles.profileRole}>Role: {currentUser.profile?.type || 'VIEWER'}</Text>
        </View>
      ) : (
        <View style={styles.profileInfo}>
          <Text style={styles.emptyText}>Not logged in</Text>
          <Text style={styles.profileEmail}>Sign in to view your profile</Text>
        </View>
      )}
      <DevRoleSwitcher />
    </ScrollView>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
const AppNavigator: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const navigationRef = useRef<any>(null);

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    if (navigationRef.current) {
      navigationRef.current.navigate(route.charAt(0).toUpperCase() + route.slice(1));
    }
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        // Initialize Sentry navigation tracking
        Sentry.addBreadcrumb({
          category: 'app',
          message: 'App navigation ready',
          level: 'info',
        });
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: 'none', // Hide default tab bar, using custom NavigationBar
          },
        }}
        screenListeners={{
          state: (e) => {
            // Update current route when navigation changes
            const state = e.data?.state;
            if (state) {
              const routeName = state.routes[state.index]?.name?.toLowerCase() || 'home';
              setCurrentRoute(routeName);
            }
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeTab}
          options={{
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Series"
          component={SeriesTab}
          options={{
            tabBarIcon: ({ color, size }) => <Tv color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Jobs"
          component={JobsScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Shorts"
          component={VerticalFeedScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Smartphone color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
      {/* Custom Navigation Bar */}
      <NavigationBar currentRoute={currentRoute} onNavigate={handleNavigate} />
    </NavigationContainer>
  );
};

// ============================================
// APP CONTENT (Inside QueryClientProvider)
// ============================================
const AppContent: React.FC = () => {
  const { data: currentUser, isLoading: authLoading, error: authError } = useCurrentUser();
  const [appReady, setAppReady] = useState(false);
  const [authTimeout, setAuthTimeout] = useState(false);

  useEffect(() => {
    // Set Sentry user context (example)
    // In real app, this would come from auth state
    if (!__DEV__) {
      Sentry.setUser({ id: 'anonymous' });
    }
  }, []);

  // ✅ PHASE 1: Delay app initialization to prevent crashes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 300); // 300ms delay before rendering main app
    return () => clearTimeout(timer);
  }, []);

  // ✅ FIX: Timeout auth loading after 5 seconds to prevent infinite loading
  useEffect(() => {
    if (authLoading) {
      const timeout = setTimeout(() => {
        console.warn('Auth loading timeout - proceeding without auth');
        setAuthTimeout(true);
      }, 5000); // 5 second timeout
      return () => clearTimeout(timeout);
    }
  }, [authLoading]);

  // ✅ PHASE 1: Hard guard - show loading until app ready OR auth timeout
  if (!appReady || (authLoading && !authTimeout)) {
    return <LoadingScreen message="Loading VERTIKAL, LLC...." />;
  }

  // ✅ MASTER DIRECTIVE: Show onboarding if profile incomplete
  const needsOnboarding = currentUser && (!currentUser.profile?.displayName || !currentUser.profile?.avatarUrl);
  
  if (needsOnboarding) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', padding: 20 }}>
        <ScrollView contentContainerStyle={{ paddingTop: 60 }}>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#FFFFFF', marginBottom: 30, textAlign: 'center' }}>
            WELCOME TO VERTIKAL, LLC.
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFD700', marginBottom: 15 }}>
            Step 1: Create Profile
          </Text>
          <Text style={{ fontSize: 16, color: '#FFFFFF', marginBottom: 30 }}>
            Complete your profile with display name, avatar, and bio to get started.
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFD700', marginBottom: 15 }}>
            Step 2: Import Past Work
          </Text>
          <Text style={{ fontSize: 16, color: '#FFFFFF', marginBottom: 30 }}>
            Upload your portfolio, past projects, or reel to showcase your work.
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFD700', marginBottom: 15 }}>
            Step 3: Launch Project or Apply to Roles
          </Text>
          <Text style={{ fontSize: 16, color: '#FFFFFF', marginBottom: 30 }}>
            Start your first vertical cinema project or browse available cast and crew roles.
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#FFD700', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 }}
            onPress={() => {
              // Navigate to profile setup screen - onboarding will be dismissed by navigating to ProfileScreen
              // The app will proceed normally and user can complete profile there
            }}
          >
            <Text style={{ color: '#000000', fontSize: 16, fontWeight: '900' }}>GET STARTED</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return <AppNavigator />;
};

// ============================================
// ROOT APP (With Providers)
// ============================================
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

// Wrap with Sentry for performance monitoring
export default Sentry.wrap(App);

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    color: '#999999',
    fontSize: 14,
    marginBottom: 20,
  },
  loadingText: {
    color: '#999999',
    marginTop: 16,
    fontSize: 14,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
  },
  errorMessage: {
    color: '#999999',
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  retryText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 14,
  },
  emptyText: {
    color: '#666666',
    fontSize: 16,
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  creatorName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  projectCard: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
  },
  projectImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  projectTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    padding: 12,
  },
  profileContent: {
    padding: 20,
    paddingTop: 60,
  },
  profileInfo: {
    marginTop: 20,
    marginBottom: 20,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  profileEmail: {
    color: '#999999',
    fontSize: 14,
    marginBottom: 4,
  },
  profileRole: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
});


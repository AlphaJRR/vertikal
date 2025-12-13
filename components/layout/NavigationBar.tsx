/**
 * Navigation Bar Component
 * VERTIKAL Brand Identity - Cinematic navigation bar
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, Tv, Smartphone, User } from 'lucide-react-native';

interface NavigationBarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ currentRoute, onNavigate }) => {
  const isActive = (route: string) => currentRoute === route;

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <TouchableOpacity
          style={[styles.tab, isActive('home') && styles.tabActive]}
          onPress={() => onNavigate('home')}
          activeOpacity={0.7}
        >
          <Home size={22} color={isActive('home') ? '#FFD700' : '#666666'} />
          <Text style={[styles.tabLabel, isActive('home') && styles.tabLabelActive]}>
            HOME
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, isActive('series') && styles.tabActive]}
          onPress={() => onNavigate('series')}
          activeOpacity={0.7}
        >
          <Tv size={22} color={isActive('series') ? '#FFD700' : '#666666'} />
          <Text style={[styles.tabLabel, isActive('series') && styles.tabLabelActive]}>
            SERIES
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, isActive('shorts') && styles.tabActive]}
          onPress={() => onNavigate('shorts')}
          activeOpacity={0.7}
        >
          <Smartphone size={22} color={isActive('shorts') ? '#FFD700' : '#666666'} />
          <Text style={[styles.tabLabel, isActive('shorts') && styles.tabLabelActive]}>
            SHORTS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, isActive('profile') && styles.tabActive]}
          onPress={() => onNavigate('profile')}
          activeOpacity={0.7}
        >
          <User size={22} color={isActive('profile') ? '#FFD700' : '#666666'} />
          <Text style={[styles.tabLabel, isActive('profile') && styles.tabLabelActive]}>
            PROFILE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    paddingBottom: 0,
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#000000',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  tabLabel: {
    color: '#666666',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#FFD700',
  },
});


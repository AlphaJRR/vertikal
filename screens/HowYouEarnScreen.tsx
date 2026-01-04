/**
 * How You Earn Screen
 * VERTIKAL, LLC. - Monetization Visibility
 * Explains Day-One monetization, short-term earnings, and long-term ownership
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, DollarSign, TrendingUp, Shield } from 'lucide-react-native';

export const HowYouEarnScreen: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>HOW YOU EARN ON VERTIKAL, LLC.</Text>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Day-One Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <DollarSign size={24} color="#FFD700" />
            <Text style={styles.sectionTitle}>DAY-ONE ACTIONS</Text>
          </View>
          <View style={styles.bulletPoint}>
            <CheckCircle size={20} color="#FFD700" style={styles.bulletIcon} />
            <Text style={styles.bulletText}>Launch a project immediately</Text>
          </View>
          <View style={styles.bulletPoint}>
            <CheckCircle size={20} color="#FFD700" style={styles.bulletIcon} />
            <Text style={styles.bulletText}>Post cast & crew roles</Text>
          </View>
          <View style={styles.bulletPoint}>
            <CheckCircle size={20} color="#FFD700" style={styles.bulletIcon} />
            <Text style={styles.bulletText}>Receive applicants</Text>
          </View>
          <View style={styles.bulletPoint}>
            <CheckCircle size={20} color="#FFD700" style={styles.bulletIcon} />
            <Text style={styles.bulletText}>Earn from early engagement</Text>
          </View>
        </View>

        {/* Short-Term Earnings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={24} color="#00C853" />
            <Text style={styles.sectionTitle}>SHORT-TERM EARNINGS</Text>
          </View>
          <Text style={styles.sectionText}>
            • Sponsorship pools: Advertisers pay premium for verified cultural content
          </Text>
          <Text style={styles.sectionText}>
            • Licensing interest: Networks and platforms license your IP
          </Text>
          <Text style={styles.sectionText}>
            • Job postings: Cast and crew pay application fees
          </Text>
          <Text style={styles.sectionText}>
            • Early engagement: Revenue from watch time and VIBE™ interactions
          </Text>
        </View>

        {/* Long-Term Ownership */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={24} color="#2962FF" />
            <Text style={styles.sectionTitle}>LONG-TERM OWNERSHIP</Text>
          </View>
          <Text style={styles.sectionText}>
            • Retain IP ownership: You own your content, audience, and franchise IP
          </Text>
          <Text style={styles.sectionText}>
            • Revenue flows back: No middlemen, no platform cuts
          </Text>
          <Text style={styles.sectionText}>
            • Build franchises: Long-form series, spin-offs, and licensing deals
          </Text>
          <Text style={styles.sectionText}>
            • Ownership signals: V Badge system creates permanent value
          </Text>
        </View>

        <View style={styles.ctaSection}>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaText}>LAUNCH YOUR PROJECT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#0A0A0A',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginLeft: 10,
    letterSpacing: 1,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulletIcon: {
    marginRight: 12,
  },
  bulletText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  sectionText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    lineHeight: 24,
  },
  ctaSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  ctaText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default HowYouEarnScreen;





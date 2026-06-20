/**
 * Attendee search + assignment component.
 * Displays a search field; renders matching attendees as selectable rows.
 * Used inside the assign.tsx screen.
 */

import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import { attendeeFullName } from '@/types/events';
import type { Attendee } from '@/types/events';

interface AssigneeSearchProps {
  attendees:    Attendee[];
  assigned:     Set<string>;  // attendee IDs already assigned
  onToggle:     (attendee: Attendee) => void;
  disabled?:    boolean;
}

export function AssigneeSearch({ attendees, assigned, onToggle, disabled }: AssigneeSearchProps) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? attendees.filter(a => {
        const full = attendeeFullName(a).toLowerCase();
        return full.includes(query.toLowerCase()) ||
          (a.email ?? '').toLowerCase().includes(query.toLowerCase());
      })
    : attendees;

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={16} color={brandColors.mutedText} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name or email"
          placeholderTextColor={brandColors.mutedText}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          editable={!disabled}
        />
      </View>

      {filtered.length === 0 ? (
        <Text style={styles.empty}>
          {query ? 'No attendees match your search.' : 'No attendees added yet.'}
        </Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={a => a.id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const isAssigned = assigned.has(item.id);
            return (
              <Pressable
                style={[styles.row, isAssigned && styles.rowAssigned]}
                onPress={() => !disabled && onToggle(item)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isAssigned }}
              >
                <View style={[styles.check, isAssigned && styles.checkActive]}>
                  {isAssigned && <Ionicons name="checkmark" size={14} color="#000" />}
                </View>
                <View style={styles.info}>
                  <Text style={styles.name}>{attendeeFullName(item)}</Text>
                  <Text style={styles.email}>{item.email ?? ''}</Text>
                </View>
                {item.user_id ? (
                  <View style={styles.linkedBadge}>
                    <Ionicons name="person-circle-outline" size={14} color="#00d4ff" />
                    <Text style={styles.linkedText}>Linked</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  searchRow: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:              10,
    backgroundColor:  'rgba(255,255,255,0.06)',
    borderWidth:      1,
    borderColor:      'rgba(255,255,255,0.12)',
    borderRadius:     10,
    paddingHorizontal: 14,
    paddingVertical:  12,
  },
  searchInput: {
    flex:        1,
    fontFamily:  brandFonts.body,
    fontSize:    14,
    color:       '#fff',
  },
  empty: {
    fontFamily:  brandFonts.body,
    fontSize:    13,
    color:       brandColors.mutedText,
    textAlign:   'center',
    paddingVertical: 20,
  },
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  rowAssigned: {
    // subtle highlight
  },
  check: {
    width:           22,
    height:          22,
    borderRadius:    6,
    borderWidth:     2,
    borderColor:     'rgba(255,255,255,0.3)',
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  checkActive: {
    backgroundColor: '#00d4ff',
    borderColor:     '#00d4ff',
  },
  info: {
    flex: 1,
    gap:  2,
  },
  name: {
    fontFamily: brandFonts.bodyMedium,
    fontSize:   14,
    color:      '#fff',
  },
  email: {
    fontFamily: brandFonts.body,
    fontSize:   12,
    color:      brandColors.mutedText,
  },
  linkedBadge: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             4,
    backgroundColor: 'rgba(0,212,255,0.1)',
    borderRadius:    6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  linkedText: {
    fontFamily: brandFonts.mono,
    fontSize:   10,
    color:      '#00d4ff',
    letterSpacing: 0.5,
  },
});

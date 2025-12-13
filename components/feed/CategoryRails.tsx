/**
 * Category Rails Component
 * Filter buttons for content categories
 * UI composition layer - accepts any category data
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { validateCategoryId } from '../../utils/validation';

export interface Category {
  id: string;
  label: string;
}

interface CategoryRailsProps {
  categories: Category[];
  selectedCategoryId?: string;
  onCategoryPress?: (category: Category) => void;
}

export const CategoryRails: React.FC<CategoryRailsProps> = ({
  categories,
  selectedCategoryId,
  onCategoryPress,
}) => {
  const handleCategoryPress = (category: Category) => {
    // ✅ SECURITY: Validate category ID before handling
    const validation = validateCategoryId(category.id);
    if (!validation.isValid) {
      console.error('[CategoryRails] Invalid category ID:', validation.error);
      return;
    }
    
    onCategoryPress?.(category);
  };

  return (
    <View style={styles.container} accessibilityRole="tablist">
      {categories.map((category) => {
        const isSelected = category.id === selectedCategoryId;
        return (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryButton, isSelected && styles.categoryButtonSelected]}
            onPress={() => handleCategoryPress(category)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Filter by ${category.label}`}
          >
            <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#FFFFFF',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});


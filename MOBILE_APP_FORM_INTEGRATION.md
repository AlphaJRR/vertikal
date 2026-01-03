# 📱 MOBILE APP FORM INTEGRATION GUIDE

## Overview

The mobile app should submit application forms to the same Zapier webhook as the website. This ensures all applications are collected in one place.

---

## Implementation

### **1. Create Form Component**

**File:** `screens/ApplyScreen.tsx`

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ZAPIER_WEBHOOK_URL = 'YOUR_ZAPIER_WEBHOOK_URL'; // Same as website

export const ApplyScreen = ({ route }) => {
  const { role = 'creator' } = route.params || {};
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState(role);
  const [portfolio, setPortfolio] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        type: 'apply',
        sourcePage: 'mobile-app',
        role: selectedRole,
        name,
        email,
        message,
        portfolio: portfolio || '',
        timestamp: new Date().toISOString(),
        extra: { portfolio }
      };

      const response = await fetch(ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      Alert.alert('Success', 'Your application has been submitted!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ fontSize: 32, fontWeight: '900', color: '#FFF', marginBottom: 10 }}>
          Apply For Badge
        </Text>
        <Text style={{ color: '#888', marginBottom: 30 }}>
          Join the Founding 50 creators building the future of vertical cinema.
        </Text>

        <TextInput
          placeholder="Full Name *"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          style={{
            backgroundColor: '#0a0a0a',
            borderWidth: 1,
            borderColor: '#333',
            borderRadius: 8,
            padding: 16,
            color: '#FFF',
            marginBottom: 16,
          }}
        />

        <TextInput
          placeholder="Email *"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            backgroundColor: '#0a0a0a',
            borderWidth: 1,
            borderColor: '#333',
            borderRadius: 8,
            padding: 16,
            color: '#FFF',
            marginBottom: 16,
          }}
        />

        <TextInput
          placeholder="Portfolio/Reel Link (optional)"
          placeholderTextColor="#666"
          value={portfolio}
          onChangeText={setPortfolio}
          keyboardType="url"
          autoCapitalize="none"
          style={{
            backgroundColor: '#0a0a0a',
            borderWidth: 1,
            borderColor: '#333',
            borderRadius: 8,
            padding: 16,
            color: '#FFF',
            marginBottom: 16,
          }}
        />

        <TextInput
          placeholder="Why VERTIKAL? *"
          placeholderTextColor="#666"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={6}
          style={{
            backgroundColor: '#0a0a0a',
            borderWidth: 1,
            borderColor: '#333',
            borderRadius: 8,
            padding: 16,
            color: '#FFF',
            marginBottom: 16,
            minHeight: 150,
            textAlignVertical: 'top',
          }}
        />

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#666' : '#FFD700',
            padding: 18,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#000', fontWeight: '900', fontSize: 18 }}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
```

---

### **2. Add Navigation Route**

**File:** `App.tsx` or your navigation file

```typescript
import { ApplyScreen } from './screens/ApplyScreen';

// Add to your stack navigator:
<Stack.Screen 
  name="Apply" 
  component={ApplyScreen}
  options={{ title: 'Apply' }}
/>
```

---

### **3. Link Apply Buttons**

**From any screen, navigate to Apply:**

```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Creator application
<TouchableOpacity onPress={() => navigation.navigate('Apply', { role: 'creator' })}>
  <Text>Apply as Creator</Text>
</TouchableOpacity>

// Network application
<TouchableOpacity onPress={() => navigation.navigate('Apply', { role: 'network' })}>
  <Text>Apply as Network</Text>
</TouchableOpacity>
```

---

### **4. Environment Variable**

**File:** `.env`

```env
EXPO_PUBLIC_ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/
```

**Update ApplyScreen.tsx:**

```typescript
const ZAPIER_WEBHOOK_URL = process.env.EXPO_PUBLIC_ZAPIER_WEBHOOK_URL || 'PASTE_HERE';
```

---

## Payload Format

The mobile app sends the same payload format as the website:

```json
{
  "type": "apply",
  "sourcePage": "mobile-app",
  "role": "creator",
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Why VERTIKAL? I want to build...",
  "portfolio": "https://portfolio.com/reel",
  "timestamp": "2025-01-03T15:30:00.000Z",
  "extra": {
    "portfolio": "https://portfolio.com/reel"
  }
}
```

---

## Testing

1. Fill out form in mobile app
2. Submit
3. Check Zapier dashboard for incoming webhook
4. Verify data appears in your CRM/spreadsheet

---

**Status:** Ready to implement - Use same Zapier webhook as website


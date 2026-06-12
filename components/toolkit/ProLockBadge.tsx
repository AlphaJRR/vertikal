import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FREE_LAUNCH } from "../../constants/proAccess";
import { brandFonts } from "../../constants/theme";

const PRO_CYAN = "#00BFFF";

interface ProLockBadgeProps {
  compact?: boolean;
}

export function ProLockBadge({ compact = false }: ProLockBadgeProps) {
  if (FREE_LAUNCH) return null;

  return (
    <View style={[styles.badge, compact && styles.badgeCompact]}>
      <Ionicons
        name="lock-closed"
        size={compact ? 10 : 12}
        color={PRO_CYAN}
      />
      <Text style={[styles.label, compact && styles.labelCompact]}>PRO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0, 191, 255, 0.45)",
    backgroundColor: "rgba(0, 191, 255, 0.12)",
  },
  badgeCompact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  label: {
    fontFamily: brandFonts.mono,
    fontSize: 9,
    letterSpacing: 1.2,
    color: PRO_CYAN,
  },
  labelCompact: {
    fontSize: 8,
  },
});

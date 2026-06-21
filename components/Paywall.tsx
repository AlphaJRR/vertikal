import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter, type Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FREE_LAUNCH } from "../constants/proAccess";
import { brandColors, brandFonts } from "../constants/theme";
import { TOOLKIT_LESSON_COUNT } from "../data/toolkitCurriculumTypes";
import { ProLockBadge } from "./toolkit/ProLockBadge";
import type { AvaProStatus } from "../hooks/useAvaPro";

interface PaywallProps {
  /** Locked item name shown above the AVA Pro headline (e.g. lesson title). */
  contextTitle?: string;
  subtitle?: string;
  status: AvaProStatus;
  isSignedIn: boolean;
  onBack?: () => void;
}

const DEFAULT_SUBTITLE = `Full Creators Toolkit — all ${TOOLKIT_LESSON_COUNT} lessons, cheat sheets, invoice builder, production checklists, and pro tools.`;

export function Paywall({
  contextTitle,
  subtitle = DEFAULT_SUBTITLE,
  status,
  isSignedIn,
  onBack,
}: PaywallProps) {
  const router = useRouter();

  if (FREE_LAUNCH) {
    return null;
  }

  if (status === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#00BFFF" size="large" />
        <Text style={styles.loadingText}>Checking access…</Text>
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <ProLockBadge />
      <Ionicons
        name="lock-closed"
        size={40}
        color="#00BFFF"
        style={styles.lockIcon}
      />
      {contextTitle ? (
        <Text style={styles.contextTitle}>{contextTitle}</Text>
      ) : null}
      <Text style={styles.title}>AVA Pro</Text>
      <Text style={styles.body}>{subtitle}</Text>

      <View style={styles.proCard}>
        <Text style={styles.priceHero}>$39.99/year</Text>
        <Text style={styles.priceHeroLabel}>Founding member price</Text>
        <Text style={styles.priceSecondary}>or $9.99/month</Text>
        <Text style={styles.iapNote}>
          AVA Pro is a subscription unlocked through the App Store. Digital
          content is not sold via web checkout in this app.
        </Text>
      </View>

      {!isSignedIn ? (
        <Pressable
          onPress={() => router.push("/sign-in" as Href)}
          style={styles.primaryBtn}
        >
          <Text style={styles.primaryBtnText}>Sign in</Text>
        </Pressable>
      ) : null}

      {onBack ? (
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backLink}>← Back</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    color: brandColors.subtleText,
    marginTop: 12,
  },
  lockIcon: {
    marginTop: 16,
    marginBottom: 12,
  },
  contextTitle: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: brandColors.mutedText,
    marginBottom: 8,
    textAlign: "center",
  },
  title: {
    fontFamily: brandFonts.display,
    fontSize: 28,
    color: brandColors.pureWhite,
    marginBottom: 12,
    textAlign: "center",
    textTransform: "uppercase",
  },
  body: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: brandColors.subtleText,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  proCard: {
    width: "100%",
    maxWidth: 340,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 191, 255, 0.35)",
    backgroundColor: "rgba(0, 191, 255, 0.08)",
    marginBottom: 20,
    alignItems: "center",
  },
  priceHero: {
    fontFamily: brandFonts.display,
    fontSize: 36,
    color: "#00BFFF",
    marginBottom: 4,
  },
  priceHeroLabel: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: brandColors.secondaryText,
    marginBottom: 8,
  },
  priceSecondary: {
    fontFamily: brandFonts.body,
    fontSize: 13,
    color: brandColors.mutedText,
    marginBottom: 12,
  },
  iapNote: {
    fontFamily: brandFonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: brandColors.mutedText,
    textAlign: "center",
  },
  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    backgroundColor: "#00BFFF",
    opacity: 1,
    marginBottom: 12,
  },
  primaryBtnText: {
    fontFamily: brandFonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#000",
    fontWeight: "800",
  },
  backBtn: {
    marginTop: 8,
    padding: 8,
  },
  backLink: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: brandColors.alphaRed,
  },
});

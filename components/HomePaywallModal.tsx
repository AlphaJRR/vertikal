import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FREE_LESSON_COUNT } from "../constants/proAccess";
import { brandColors, brandFonts } from "../constants/theme";
import { TOOLKIT_LESSON_COUNT } from "../data/toolkitCurriculumTypes";
import { presentAvaProPaywall } from "../utils/presentAvaProPaywall";

const PRO_LESSON_COUNT = TOOLKIT_LESSON_COUNT - FREE_LESSON_COUNT;

interface HomePaywallModalProps {
  visible: boolean;
  isSignedIn: boolean;
  onDismiss: () => void;
  onActivated: () => void;
}

export function HomePaywallModal({
  visible,
  isSignedIn,
  onDismiss,
  onActivated,
}: HomePaywallModalProps) {
  const handleUpgrade = () => {
    void presentAvaProPaywall({
      isSignedIn,
      source: "home_modal",
      onActivated,
    });
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.sheetHandle} />

          <Pressable onPress={onDismiss} hitSlop={12} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={brandColors.mutedText} />
          </Pressable>

          <Text style={styles.eyebrow}>AVA Pro</Text>
          <Text style={styles.title}>Unlock the full Creators Toolkit</Text>
          <Text style={styles.body}>
            You have {FREE_LESSON_COUNT} free lessons to explore. Pro unlocks all{" "}
            {TOOLKIT_LESSON_COUNT} lessons, HTML cheat sheets, production checklists,
            and on-set pro tools.
          </Text>

          <View style={styles.benefits}>
            <Text style={styles.benefit}>
              · {PRO_LESSON_COUNT}+ advanced lessons across 6 tracks
            </Text>
            <Text style={styles.benefit}>· Slide-deck cheat sheets on every topic</Text>
            <Text style={styles.benefit}>· Pre-prod, on-set, and post checklists</Text>
            <Text style={styles.benefit}>· Shoot calculator, presets, and shortcuts</Text>
          </View>

          <Pressable onPress={handleUpgrade} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>
              {isSignedIn ? "Upgrade to Pro" : "See plans"}
            </Text>
          </Pressable>

          <Pressable onPress={onDismiss} style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Maybe later</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#111",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 16,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 20,
    zIndex: 1,
  },
  eyebrow: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#00BFFF",
    marginBottom: 8,
  },
  title: {
    fontFamily: brandFonts.display,
    fontSize: 28,
    color: brandColors.pureWhite,
    textTransform: "uppercase",
    marginBottom: 12,
    paddingRight: 28,
  },
  body: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: brandColors.subtleText,
    marginBottom: 16,
  },
  benefits: {
    gap: 6,
    marginBottom: 24,
  },
  benefit: {
    fontFamily: brandFonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: brandColors.secondaryText,
  },
  primaryBtn: {
    backgroundColor: "#00BFFF",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
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
  secondaryBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: brandColors.mutedText,
  },
});

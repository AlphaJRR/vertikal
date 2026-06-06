import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { brandColors, brandFonts } from "../../constants/theme";
import { ProLockBadge } from "./ProLockBadge";
import { creatorTrainingStyles as s } from "./creatorTrainingStyles";
import { StyleSheet } from "react-native";

const CHECKLISTS = {
  "pre-prod": {
    eyebrow: "PRE-PRODUCTION",
    title: "Pre-Prod",
    items: [
      "Script or shot list approved by client",
      "Location scout complete — power, noise, permits",
      "Gear list packed — batteries, cards, lenses, audio",
      "Call sheet sent with times, addresses, contacts",
      "Insurance and releases ready for talent and locations",
      "Backup plan for weather or location fall-through",
    ],
  },
  "on-set": {
    eyebrow: "ON SET",
    title: "On Set",
    items: [
      "Batteries charged (camera, grip, audio)",
      "Cards formatted and labeled",
      "Lens cloth, ND filters, rain cover",
      "Lav + boom + headphones test",
      "White balance and picture profile confirmed",
      "Client brief reviewed on set",
      "Backup audio recorder rolling",
      "Room tone captured (30s)",
    ],
  },
  post: {
    eyebrow: "POST-PRODUCTION",
    title: "Post",
    items: [
      "Footage backed up to two locations before edit",
      "Project settings match delivery spec",
      "Rough cut sent by agreed date",
      "Color and mix on calibrated reference",
      "Captions and graphics within safe zones",
      "Export tested on phone before client delivery",
      "Archive project, media, and licenses folder",
      "Invoice sent with delivery link",
    ],
  },
} as const;

type ChecklistKey = keyof typeof CHECKLISTS;

interface ProductionChecklistsSectionProps {
  isPro: boolean;
  isSignedIn: boolean;
  onLockedPress: () => void;
}

export function ProductionChecklistsSection({
  isPro,
  isSignedIn,
  onLockedPress,
}: ProductionChecklistsSectionProps) {
  const [expanded, setExpanded] = useState<ChecklistKey | null>(isPro ? "on-set" : null);
  const locked = !isPro;

  const toggleSection = (key: ChecklistKey) => {
    if (locked) {
      onLockedPress();
      return;
    }
    setExpanded(expanded === key ? null : key);
  };

  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <View style={localStyles.titleRow}>
          <Text style={s.sectionEyebrow}>Production</Text>
          {locked ? <ProLockBadge compact /> : null}
        </View>
        <Text style={s.sectionTitle}>Checklists</Text>
        {locked ? (
          <Text style={localStyles.lockHint}>
            {isSignedIn
              ? "Upgrade to AVA Pro to unlock pre-prod, on-set, and post checklists."
              : "Sign in and upgrade to AVA Pro to unlock production checklists."}
          </Text>
        ) : null}
      </View>

      {(Object.keys(CHECKLISTS) as ChecklistKey[]).map((key) => {
        const list = CHECKLISTS[key];
        const open = expanded === key;
        return (
          <View
            key={key}
            style={[s.categoryPanel, locked && localStyles.panelLocked]}
          >
            <Pressable
              onPress={() => toggleSection(key)}
              style={s.categoryHeader}
            >
              <View style={s.categoryHeaderLeft}>
                <Text style={s.categoryEyebrow}>{list.eyebrow}</Text>
                <Text style={[s.categoryTitle, { fontSize: 28 }]}>
                  {list.title}
                </Text>
              </View>
              {locked ? (
                <Ionicons name="lock-closed" size={20} color="#00BFFF" />
              ) : (
                <Ionicons
                  name={open ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={brandColors.inactiveTab}
                />
              )}
            </Pressable>
            {open && !locked ? (
              <View style={localStyles.checklistBody}>
                {list.items.map((item) => (
                  <Text key={item} style={localStyles.checkItem}>
                    ☐ {item}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const localStyles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  lockHint: {
    fontFamily: brandFonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: brandColors.subtleText,
    marginTop: 8,
  },
  panelLocked: {
    opacity: 0.78,
    borderWidth: 1,
    borderColor: "rgba(0, 191, 255, 0.2)",
  },
  checklistBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  checkItem: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: brandColors.secondaryText,
    marginBottom: 6,
  },
});

import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { brandColors, brandFonts } from "../../constants/theme";
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

export function ProductionChecklistsSection() {
  const [expanded, setExpanded] = useState<ChecklistKey | null>("on-set");

  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <Text style={s.sectionEyebrow}>Production</Text>
        <Text style={s.sectionTitle}>Checklists</Text>
      </View>

      {(Object.keys(CHECKLISTS) as ChecklistKey[]).map((key) => {
        const list = CHECKLISTS[key];
        const open = expanded === key;
        return (
          <View key={key} style={s.categoryPanel}>
            <Pressable
              onPress={() => setExpanded(open ? null : key)}
              style={s.categoryHeader}
            >
              <View style={s.categoryHeaderLeft}>
                <Text style={s.categoryEyebrow}>{list.eyebrow}</Text>
                <Text style={[s.categoryTitle, { fontSize: 28 }]}>
                  {list.title}
                </Text>
              </View>
              <Ionicons
                name={open ? "chevron-up" : "chevron-down"}
                size={20}
                color={brandColors.inactiveTab}
              />
            </Pressable>
            {open ? (
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

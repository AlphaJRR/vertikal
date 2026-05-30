import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { brandColors, brandFonts } from "../../constants/theme";
import { CreatorTraining } from "../../components/toolkit/CreatorTraining";
import { ProductionChecklistsSection } from "../../components/toolkit/ProductionChecklistsSection";
import { PresetsManager } from "../../components/toolkit/PresetsManager";
import { SonyShootingModes } from "../../components/toolkit/SonyShootingModes";
import { ShootCalculator } from "../../components/toolkit/ShootCalculator";
import { ShortcutsModule } from "../../components/toolkit/ToolkitModules";
import { menuItems, ToolkitMenuId } from "../../components/toolkit/ToolkitNavigator";

const INVOICE_LINES = [
  "Production day — $X / 10hr",
  "Half day — $X / 5hr",
  "Edit / color — $X per minute delivered",
  "Travel — mileage + per diem",
  "Rush fee — +25% under 48hr turnaround",
];

type SubScreen = "main" | ToolkitMenuId;

export type ViewState =
  | { screen: "main" }
  | { screen: "calculator" }
  | { screen: "shortcuts" }
  | { screen: "presets" }
  | { screen: "shooting-modes" }
  | { screen: "slide"; slideId: string };

export default function ToolsScreen() {
  const insets = useSafeAreaInsets();
  const [subScreen, setSubScreen] = useState<SubScreen>("main");

  const goMain = () => setSubScreen("main");

  if (subScreen === "calculator") {
    return <ShootCalculator onBack={goMain} />;
  }
  if (subScreen === "presets") {
    return <PresetsManager onBack={goMain} />;
  }
  if (subScreen === "shooting-modes") {
    return <SonyShootingModes onBack={goMain} />;
  }
  if (subScreen === "shortcuts") {
    return <ShortcutsModule onBack={goMain} />;
  }

  const moreTools = menuItems.filter(
    (item) => !["training", "checklists", "invoice"].includes(item.id),
  );

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{
        paddingTop: 8,
        paddingBottom: insets.bottom + 32,
        paddingHorizontal: 20,
      }}
      showsVerticalScrollIndicator={false}
    >
      <CreatorTraining />

      <View style={styles.section}>
        <Text style={styles.eyebrow}>Invoice Builder</Text>
        <Text style={styles.sectionTitle}>Line Items</Text>
        <Text style={styles.sectionDesc}>
          Standard line items for AVA creators. Export full invoices from the client portal after booking.
        </Text>
        <View style={styles.card}>
          {INVOICE_LINES.map((line) => (
            <Text key={line} style={styles.listItem}>
              {line}
            </Text>
          ))}
        </View>
      </View>

      <ProductionChecklistsSection />

      <View style={styles.section}>
        <Text style={styles.eyebrow}>More Tools</Text>
        <Text style={styles.sectionTitle}>On-Set Utilities</Text>
        {moreTools.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => setSubScreen(item.id)}
            style={styles.moreCard}
          >
            <View style={[styles.moreIcon, { backgroundColor: `${item.color}22` }]}>
              <Ionicons
                name={item.icon as React.ComponentProps<typeof Ionicons>["name"]}
                size={20}
                color={item.color}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.moreTitle}>{item.title}</Text>
              <Text style={styles.moreDesc}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={brandColors.inactiveTab} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: brandColors.avaBlack },
  section: { marginBottom: 32 },
  eyebrow: {
    fontFamily: brandFonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: brandColors.alphaRed,
    marginBottom: 6,
  },
  sectionTitle: {
    fontFamily: brandFonts.display,
    fontSize: 28,
    color: brandColors.pureWhite,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  sectionDesc: {
    fontFamily: brandFonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: brandColors.subtleText,
    marginBottom: 12,
  },
  card: {
    backgroundColor: brandColors.graphite,
    borderWidth: 1,
    borderColor: brandColors.borderGray,
    borderRadius: 12,
    padding: 16,
  },
  listItem: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: brandColors.secondaryText,
    marginBottom: 6,
  },
  moreCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: brandColors.graphite,
    borderWidth: 1,
    borderColor: brandColors.borderGray,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  moreIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  moreTitle: {
    fontFamily: brandFonts.bodySemiBold,
    fontSize: 15,
    color: brandColors.pureWhite,
  },
  moreDesc: {
    fontFamily: brandFonts.body,
    fontSize: 12,
    color: brandColors.subtleText,
    marginTop: 2,
  },
});

export function openToolkitSlide(
  _setViewState: React.Dispatch<React.SetStateAction<ViewState>>,
  _slideId: string,
) {
  // Legacy helper — slide deep links route via app/slide/[id].tsx
}

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  InteractionManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { brandColors, brandFonts } from "../../constants/theme";
import { TOOLKIT_LESSON_COUNT } from "../../data/toolkitCurriculumTypes";
import { ProductionChecklistsSection } from "../../components/toolkit/ProductionChecklistsSection";
import { ToolsErrorFallback } from "../../components/toolkit/ToolsErrorFallback";
import { ToolsSubScreen } from "../../components/toolkit/ToolsSubScreen";
import { menuItems, ToolkitMenuId } from "../../components/toolkit/ToolkitNavigator";

type SubScreen = "main" | ToolkitMenuId;

export type ViewState =
  | { screen: "main" }
  | { screen: "calculator" }
  | { screen: "shortcuts" }
  | { screen: "presets" }
  | { screen: "shooting-modes" }
  | { screen: "slide"; slideId: string };

function DeferredInvoiceBuilder() {
  const [Component, setComponent] = useState<React.ComponentType<{
    showHeader?: boolean;
  }> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const task = InteractionManager.runAfterInteractions(() => {
      import("../../components/toolkit/InvoiceBuilder")
        .then((mod) => {
          if (!cancelled) setComponent(() => mod.InvoiceBuilderSection);
        })
        .catch(() => {
          if (!cancelled) setComponent(null);
        });
    });
    return () => {
      cancelled = true;
      task.cancel();
    };
  }, []);

  if (!Component) {
    return (
      <View style={{ paddingVertical: 24, alignItems: "center" }}>
        <ActivityIndicator color={brandColors.alphaRed} />
      </View>
    );
  }

  return <Component />;
}

export default function ToolsScreen() {
  const insets = useSafeAreaInsets();
  const [subScreen, setSubScreen] = useState<SubScreen>("main");

  const goMain = () => setSubScreen("main");

  if (subScreen !== "main") {
    return (
      <ErrorBoundary FallbackComponent={ToolsErrorFallback}>
        <ToolsSubScreen id={subScreen} onBack={goMain} />
      </ErrorBoundary>
    );
  }

  const moreTools = menuItems.filter(
    (item) =>
      !["training", "checklists", "invoice", "rate-calculator"].includes(item.id),
  );

  return (
    <ErrorBoundary FallbackComponent={ToolsErrorFallback}>
      <ScrollView
        style={styles.root}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Creator Training</Text>
          <Text style={styles.sectionTitle}>Creators Toolkit</Text>
          <Text style={styles.sectionDesc}>
            {TOOLKIT_LESSON_COUNT} lessons across 6 tracks — camera, lighting, editing,
            strategy, and Production 101 with HTML slide decks.
          </Text>
        </View>

        <Pressable
          onPress={() => setSubScreen("training")}
          style={styles.moreCard}
        >
          <View style={[styles.moreIcon, { backgroundColor: "rgba(58,134,255,0.13)" }]}>
            <Ionicons name="school-outline" size={20} color="#3a86ff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.moreTitle}>Open Creator Training</Text>
            <Text style={styles.moreDesc}>
              Browse all {TOOLKIT_LESSON_COUNT} lessons with slide decks
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={brandColors.inactiveTab} />
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.eyebrow}>Rate Calculator</Text>
          <Text style={styles.sectionTitle}>Quote Builder</Text>
          <Text style={styles.sectionDesc}>
            Build a professional quote in 5 steps — skill level baselines, national
            averages, IRS mileage at $0.67/mi, and Pro-gated Send Quote.
          </Text>
          <Pressable
            onPress={() => setSubScreen("rate-calculator")}
            style={styles.moreCard}
          >
            <View style={[styles.moreIcon, { backgroundColor: "rgba(232,0,10,0.13)" }]}>
              <Ionicons name="cash-outline" size={20} color={brandColors.alphaRed} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.moreTitle}>Open Rate Calculator</Text>
              <Text style={styles.moreDesc}>5-step quote builder</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={brandColors.inactiveTab} />
          </Pressable>
        </View>

        <DeferredInvoiceBuilder />

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
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: brandColors.avaBlack },
  hero: { marginBottom: 16 },
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

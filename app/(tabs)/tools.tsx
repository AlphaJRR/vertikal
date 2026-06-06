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
import {
  isChecklistsProLocked,
  isInvoiceBuilderProLocked,
  isToolProLocked,
} from "../../constants/proAccess";
import { TOOLKIT_LESSON_COUNT } from "../../data/toolkitCurriculumTypes";
import { ProductionChecklistsSection } from "../../components/toolkit/ProductionChecklistsSection";
import { ProLockBadge } from "../../components/toolkit/ProLockBadge";
import { ToolsErrorFallback } from "../../components/toolkit/ToolsErrorFallback";
import { ToolsSubScreen } from "../../components/toolkit/ToolsSubScreen";
import { menuItems, ToolkitMenuId } from "../../components/toolkit/ToolkitNavigator";
import { useAvaPro } from "../../hooks/useAvaPro";
import { showProUpgradeAlert } from "../../utils/showProUpgradeAlert";

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

interface ToolCardProps {
  locked: boolean;
  onPress: () => void;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

function ToolCard({
  locked,
  onPress,
  icon,
  iconColor,
  iconBg,
  title,
  description,
}: ToolCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.moreCard, locked && styles.moreCardLocked]}
    >
      <View style={[styles.moreIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.moreTitleRow}>
          <Text style={[styles.moreTitle, locked && styles.moreTitleLocked]}>
            {title}
          </Text>
          {locked ? <ProLockBadge compact /> : null}
        </View>
        <Text style={styles.moreDesc}>{description}</Text>
      </View>
      {locked ? (
        <Ionicons name="lock-closed" size={18} color="#00BFFF" />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={brandColors.inactiveTab} />
      )}
    </Pressable>
  );
}

export default function ToolsScreen() {
  const insets = useSafeAreaInsets();
  const { status, isPro, isSignedIn } = useAvaPro();
  const [subScreen, setSubScreen] = useState<SubScreen>("main");

  const goMain = () => setSubScreen("main");

  const openTool = (id: ToolkitMenuId) => {
    if (status === "loading") return;
    const locked = !isPro && isToolProLocked(id);
    if (locked) {
      showProUpgradeAlert(isSignedIn, "tool");
      return;
    }
    setSubScreen(id);
  };

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

        <ToolCard
          locked={false}
          onPress={() => openTool("training")}
          icon="school-outline"
          iconColor="#3a86ff"
          iconBg="rgba(58,134,255,0.13)"
          title="Open Creator Training"
          description={`Browse all ${TOOLKIT_LESSON_COUNT} lessons with slide decks`}
        />

        <View style={styles.section}>
          <Text style={styles.eyebrow}>Rate Calculator</Text>
          <Text style={styles.sectionTitle}>Quote Builder</Text>
          <Text style={styles.sectionDesc}>
            Build a professional quote in 5 steps — skill level baselines, national
            averages, IRS mileage at $0.67/mi, and Pro-gated Send Quote.
          </Text>
          <ToolCard
            locked={false}
            onPress={() => openTool("rate-calculator")}
            icon="cash-outline"
            iconColor={brandColors.alphaRed}
            iconBg="rgba(232,0,10,0.13)"
            title="Open Rate Calculator"
            description="5-step quote builder"
          />
        </View>

        {!isPro && isInvoiceBuilderProLocked() ? (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.eyebrow}>Invoice Builder</Text>
              <ProLockBadge compact />
            </View>
            <Text style={styles.sectionTitle}>Client Invoices</Text>
            <Text style={styles.sectionDesc}>
              Line items, rates, and export-ready summaries — AVA Pro.
            </Text>
            <ToolCard
              locked
              onPress={() => showProUpgradeAlert(isSignedIn, "tool")}
              icon="document-text-outline"
              iconColor="#fb5607"
              iconBg="rgba(251,86,7,0.13)"
              title="Open Invoice Builder"
              description="Pro-gated invoice templates"
            />
          </View>
        ) : (
          <DeferredInvoiceBuilder />
        )}

        <ProductionChecklistsSection
          isPro={isPro}
          isSignedIn={isSignedIn}
          onLockedPress={() => showProUpgradeAlert(isSignedIn, "tool")}
        />

        <View style={styles.section}>
          <Text style={styles.eyebrow}>More Tools</Text>
          <Text style={styles.sectionTitle}>On-Set Utilities</Text>
          {moreTools.map((item) => {
            const locked = !isPro && isToolProLocked(item.id);
            return (
              <ToolCard
                key={item.id}
                locked={locked}
                onPress={() => openTool(item.id)}
                icon={item.icon as React.ComponentProps<typeof Ionicons>["name"]}
                iconColor={item.color}
                iconBg={`${item.color}22`}
                title={item.title}
                description={item.description}
              />
            );
          })}
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
  moreCardLocked: {
    opacity: 0.78,
    borderColor: "rgba(0, 191, 255, 0.25)",
  },
  moreTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
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
  moreTitleLocked: {
    color: brandColors.mutedText,
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

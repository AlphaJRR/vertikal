import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { brandColors, brandFonts } from "../../constants/theme";
import type { ToolkitLesson } from "../../data/toolkitCurriculumTypes";
import {
  avaDiagramPathForEntry,
  getAvaDiagramByHtmlSlideId,
} from "../../data/avaDiagramManifest";
import { readToolkitSlideHtmlRaw } from "../../data/toolkitSlideAssets";
import { resolveAvaDiagramUri } from "../../data/toolkitDiagramAssets";
import {
  parseToolkitSlideHtml,
  type CheatSheetCard,
} from "../../utils/parseToolkitSlideHtml";
import { toPlainLessonText } from "../../utils/plainLessonText";

interface ToolkitNativeCheatSheetViewProps {
  htmlPath: string;
  htmlSlideId?: string;
  title?: string;
  fallbackLesson?: ToolkitLesson;
  onBack: () => void;
}

function CheatSheetDiagram({ htmlSlideId }: { htmlSlideId?: string }) {
  const entry = htmlSlideId ? getAvaDiagramByHtmlSlideId(htmlSlideId) : undefined;
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    if (!entry) {
      setUri(null);
      return;
    }
    let cancelled = false;
    resolveAvaDiagramUri(avaDiagramPathForEntry(entry))
      .then((resolved) => {
        if (!cancelled) setUri(resolved);
      })
      .catch(() => {
        if (!cancelled) setUri(null);
      });
    return () => {
      cancelled = true;
    };
  }, [entry, htmlSlideId]);

  if (!uri) return null;

  return (
    <View style={styles.diagramWrap}>
      <Image
        source={{ uri }}
        style={styles.diagram}
        contentFit="contain"
        transition={0}
        accessibilityLabel={entry?.subject ?? "Cheat sheet diagram"}
      />
    </View>
  );
}

function CheatSheetCardView({
  card,
  htmlSlideId,
  isFirst,
}: {
  card: CheatSheetCard;
  htmlSlideId?: string;
  isFirst: boolean;
}) {
  return (
    <View style={[styles.card, isFirst && styles.cardFirst]}>
      {card.topic ? <Text style={styles.topic}>{card.topic}</Text> : null}
      {card.heading ? <Text style={styles.cardHeading}>{card.heading}</Text> : null}
      {card.subheading ? (
        <Text style={styles.subheading}>{card.subheading}</Text>
      ) : null}

      {card.hasDiagram ? <CheatSheetDiagram htmlSlideId={htmlSlideId} /> : null}
      {card.caption ? <Text style={styles.caption}>{card.caption}</Text> : null}

      {card.bullets.map((bullet, index) => (
        <View key={`bullet-${index}`} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{bullet}</Text>
        </View>
      ))}

      {card.steps.map((step, index) => (
        <View key={`step-${index}`} style={styles.stepRow}>
          <Text style={styles.stepLabel}>{step.label}</Text>
          <Text style={styles.stepText}>{step.text}</Text>
        </View>
      ))}

      {card.callout ? (
        <View style={styles.callout}>
          <Text style={styles.calloutLabel}>{card.callout.label}</Text>
          <Text style={styles.calloutText}>{card.callout.text}</Text>
        </View>
      ) : null}

      {card.warning ? (
        <View style={styles.warning}>
          <Text style={styles.warningLabel}>{card.warning.label}</Text>
          <Text style={styles.warningText}>{card.warning.text}</Text>
        </View>
      ) : null}
    </View>
  );
}

function LessonFallback({ lesson }: { lesson: ToolkitLesson }) {
  return (
    <>
      {lesson.description ? (
        <>
          <Text style={styles.fallbackEyebrow}>Overview</Text>
          <Text style={styles.fallbackBody}>{toPlainLessonText(lesson.description)}</Text>
        </>
      ) : null}
      {lesson.guide ? (
        <>
          <Text style={styles.fallbackEyebrow}>The Guide</Text>
          <Text style={styles.fallbackBody}>{toPlainLessonText(lesson.guide)}</Text>
        </>
      ) : null}
      {lesson.keyRule ? (
        <View style={styles.keyRule}>
          <Text style={styles.keyRuleLabel}>Key Rule</Text>
          <Text style={styles.keyRuleText}>{toPlainLessonText(lesson.keyRule)}</Text>
        </View>
      ) : null}
      {(lesson.steps?.length ?? 0) > 0 ? (
        <>
          <Text style={styles.fallbackEyebrow}>How To Do It</Text>
          {lesson.steps!.map((step, index) => (
            <View key={`fallback-step-${index}`} style={styles.stepRow}>
              <Text style={styles.stepLabel}>{String(index + 1).padStart(2, "0")}</Text>
              <Text style={styles.stepText}>{toPlainLessonText(step)}</Text>
            </View>
          ))}
        </>
      ) : null}
      {lesson.proTip ? (
        <View style={styles.callout}>
          <Text style={styles.calloutLabel}>Pro Tip</Text>
          <Text style={styles.calloutText}>{toPlainLessonText(lesson.proTip)}</Text>
        </View>
      ) : null}
      {lesson.commonMistake ? (
        <View style={styles.warning}>
          <Text style={styles.warningLabel}>Common Mistake</Text>
          <Text style={styles.warningText}>{toPlainLessonText(lesson.commonMistake)}</Text>
        </View>
      ) : null}
    </>
  );
}

export function ToolkitNativeCheatSheetView({
  htmlPath,
  htmlSlideId,
  title,
  fallbackLesson,
  onBack,
}: ToolkitNativeCheatSheetViewProps) {
  const insets = useSafeAreaInsets();
  const [rawHtml, setRawHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    readToolkitSlideHtmlRaw(htmlPath)
      .then((html) => {
        if (!cancelled) {
          setRawHtml(html);
          setLoadError(html == null);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [htmlPath]);

  const cards = useMemo(
    () => (rawHtml ? parseToolkitSlideHtml(rawHtml) : []),
    [rawHtml],
  );

  const showFallback = loadError || cards.length === 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.toolbar}>
        <Pressable onPress={onBack} hitSlop={8}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        {title ? (
          <Text style={styles.toolbarTitle} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>

      {rawHtml == null && !loadError ? (
        <View style={styles.centered}>
          <ActivityIndicator color={brandColors.alphaRed} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.cheatLabel}>Cheat Sheet</Text>
          {title ? <Text style={styles.title}>{title}</Text> : null}

          {showFallback ? (
            fallbackLesson ? (
              <LessonFallback lesson={fallbackLesson} />
            ) : (
              <Text style={styles.fallbackBody}>
                This cheat sheet could not be loaded.
              </Text>
            )
          ) : (
            cards.map((card, index) => (
              <CheatSheetCardView
                key={`card-${index}-${card.heading ?? card.subheading ?? index}`}
                card={card}
                htmlSlideId={htmlSlideId}
                isFirst={index === 0}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: brandColors.avaBlack,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  back: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: brandColors.alphaRed,
  },
  toolbarTitle: {
    flex: 1,
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: brandColors.pureWhite,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cheatLabel: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: brandColors.alphaRed,
    marginBottom: 8,
  },
  title: {
    fontFamily: brandFonts.display,
    fontSize: 32,
    color: brandColors.pureWhite,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: brandColors.borderGray,
    borderRadius: 12,
    backgroundColor: brandColors.graphite,
    padding: 16,
    marginBottom: 14,
  },
  cardFirst: {
    borderColor: brandColors.alphaRed,
    backgroundColor: "rgba(232, 0, 10, 0.08)",
  },
  topic: {
    fontFamily: brandFonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: brandColors.mutedText,
    marginBottom: 8,
  },
  cardHeading: {
    fontFamily: brandFonts.display,
    fontSize: 24,
    color: brandColors.pureWhite,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  subheading: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 15,
    color: brandColors.secondaryText,
    marginBottom: 12,
  },
  diagramWrap: {
    marginVertical: 12,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#111111",
  },
  diagram: {
    width: "100%",
    height: 220,
  },
  caption: {
    fontFamily: brandFonts.body,
    fontSize: 13,
    color: brandColors.mutedText,
    marginBottom: 8,
    textAlign: "center",
  },
  bulletRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  bulletDot: {
    fontFamily: brandFonts.body,
    fontSize: 15,
    color: brandColors.alphaRed,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontFamily: brandFonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: brandColors.secondaryText,
  },
  stepRow: {
    marginBottom: 10,
  },
  stepLabel: {
    fontFamily: brandFonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: brandColors.alphaRed,
    marginBottom: 4,
  },
  stepText: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: brandColors.secondaryText,
  },
  callout: {
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: brandColors.alphaRed,
    paddingLeft: 12,
  },
  calloutLabel: {
    fontFamily: brandFonts.display,
    fontSize: 16,
    color: brandColors.alphaRed,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  calloutText: {
    fontFamily: brandFonts.bodySemiBold,
    fontSize: 14,
    lineHeight: 21,
    color: brandColors.pureWhite,
  },
  warning: {
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#888888",
    paddingLeft: 12,
  },
  warningLabel: {
    fontFamily: brandFonts.display,
    fontSize: 16,
    color: brandColors.mutedText,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  warningText: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: brandColors.mutedText,
  },
  fallbackEyebrow: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: brandColors.alphaRed,
    marginBottom: 8,
    marginTop: 8,
  },
  fallbackBody: {
    fontFamily: brandFonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: brandColors.secondaryText,
    marginBottom: 16,
  },
  keyRule: {
    borderLeftWidth: 3,
    borderLeftColor: brandColors.alphaRed,
    backgroundColor: brandColors.graphite,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  keyRuleLabel: {
    fontFamily: brandFonts.display,
    fontSize: 18,
    color: brandColors.alphaRed,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  keyRuleText: {
    fontFamily: brandFonts.bodySemiBold,
    fontSize: 15,
    lineHeight: 22,
    color: brandColors.pureWhite,
  },
});

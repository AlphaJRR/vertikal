import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  ToolkitSlide,
  getCategoryById,
  toolkitContent,
} from "../../data/toolkitContent";
import { toolkitStyles as s } from "./toolkitStyles";

interface ToolkitSlideViewProps {
  slide: ToolkitSlide;
  onBack: () => void;
}

function SectionBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={s.card}>
      <Text style={s.sectionTitle}>{label}</Text>
      {children}
    </View>
  );
}

export function ToolkitSlideView({ slide, onBack }: ToolkitSlideViewProps) {
  const insets = useSafeAreaInsets();
  const category = getCategoryById(slide.categoryId);
  const accent = category?.color ?? toolkitContent.brand.primary;

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={[
        s.content,
        { paddingTop: 8, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={onBack}>
        <Text style={s.backTxt}>← Back</Text>
      </Pressable>

      <View style={s.header}>
        {slide.num ? (
          <View
            style={{
              width: 48,
              height: 48,
              backgroundColor: toolkitContent.brand.accent,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>
              {slide.num}
            </Text>
          </View>
        ) : null}
        <Text style={{ color: accent, fontSize: 10, fontWeight: "700", letterSpacing: 2, marginBottom: 6 }}>
          {slide.category.toUpperCase()}
        </Text>
        <Text style={s.title}>{slide.title}</Text>
        <Text style={s.subtitle}>{slide.tip}</Text>
      </View>

      <View style={[s.card, { borderColor: `${accent}44` }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Ionicons name="bulb-outline" size={18} color={accent} />
          <Text style={s.cardTitle}>The Guide</Text>
        </View>
        <Text style={s.cardBody}>{slide.summary}</Text>
        {slide.highlight ? (
          <Text style={[s.tag, { marginTop: 10, alignSelf: "flex-start" }]}>
            {slide.highlight}
          </Text>
        ) : null}
      </View>

      {slide.steps?.length ? (
        <SectionBlock label="Steps">
          {slide.steps.map((step, i) => (
            <Text key={step} style={s.listItem}>
              {i + 1}. {step}
            </Text>
          ))}
        </SectionBlock>
      ) : null}

      {slide.useCases?.length ? (
        <SectionBlock label="Use Cases">
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {slide.useCases.map((uc) => (
              <Text key={uc} style={s.tag}>
                {uc}
              </Text>
            ))}
          </View>
          {slide.mood ? (
            <Text style={[s.cardBody, { marginTop: 10 }]}>{slide.mood}</Text>
          ) : null}
        </SectionBlock>
      ) : null}

      {slide.setup ? (
        <SectionBlock label="Setup">
          <Text style={s.cardBody}>{slide.setup}</Text>
        </SectionBlock>
      ) : null}

      {slide.panels?.length ? (
        <SectionBlock label="Panels">
          {slide.panels.map((panel) => (
            <View key={panel.label} style={{ marginBottom: 12 }}>
              <Text style={{ color: accent, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 4 }}>
                {panel.label}
              </Text>
              <Text style={s.cardBody}>{panel.description}</Text>
            </View>
          ))}
        </SectionBlock>
      ) : null}

      <View style={{ marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.06)" }}>
        <Text style={{ color: accent, fontSize: 12, fontWeight: "700", letterSpacing: 1.5 }}>
          {toolkitContent.brand.tagline}
        </Text>
        <Text style={{ color: "#555", fontSize: 11, marginTop: 4, letterSpacing: 0.5 }}>
          {toolkitContent.brand.phrase}
        </Text>
      </View>
    </ScrollView>
  );
}

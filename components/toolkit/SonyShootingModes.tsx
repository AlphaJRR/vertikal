import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SONY_SHOOTING_MODES, SHOOTING_SCENARIOS } from "../../data/presetsData";
import { toolkitStyles as s } from "./toolkitStyles";

interface SonyShootingModesProps {
  onBack: () => void;
}

export function SonyShootingModes({ onBack }: SonyShootingModesProps) {
  const insets = useSafeAreaInsets();
  const [expandedId, setExpandedId] = useState<string | null>(
    SONY_SHOOTING_MODES[0]?.id ?? null
  );
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const scenario = SHOOTING_SCENARIOS.find((sc) => sc.id === scenarioId);

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={[
        s.content,
        { paddingTop: 8, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <Pressable onPress={onBack}>
        <Text style={s.backTxt}>← Toolkit</Text>
      </Pressable>
      <View style={s.header}>
        <Text style={s.title}>Sony Shooting Modes</Text>
        <Text style={s.subtitle}>AUTO · P · S · A · M · MOVIE</Text>
      </View>

      <Text style={s.sectionTitle}>Mode reference</Text>
      {SONY_SHOOTING_MODES.map((mode) => {
        const open = expandedId === mode.id;
        return (
          <View key={mode.id} style={s.card}>
            <Pressable onPress={() => setExpandedId(open ? null : mode.id)}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
                    {mode.shortName}
                  </Text>
                  <Text style={s.cardBody}>{mode.name}</Text>
                </View>
                <Text style={{ color: "#ff006e", fontWeight: "700", fontSize: 20 }}>
                  {open ? "−" : "+"}
                </Text>
              </View>
            </Pressable>
            {open ? (
              <View style={{ marginTop: 12 }}>
                <Text style={s.cardBody}>{mode.summary}</Text>
                <Text style={[s.cardBody, { marginTop: 8 }]}>
                  Dial: <Text style={{ color: "#fff", fontWeight: "600" }}>{mode.dialPosition}</Text>
                </Text>
                <Text style={[s.sectionTitle, { marginTop: 12, fontSize: 12 }]}>Best for</Text>
                {mode.bestFor.map((item) => (
                  <Text key={item} style={s.listItem}>
                    • {item}
                  </Text>
                ))}
                <Text style={[s.sectionTitle, { fontSize: 12 }]}>You control</Text>
                {mode.controls.map((item) => (
                  <Text key={item} style={s.listItem}>
                    • {item}
                  </Text>
                ))}
                {mode.shutterGuide ? (
                  <Text style={s.listItem}>
                    <Text style={{ fontWeight: "700" }}>Shutter:</Text> {mode.shutterGuide}
                  </Text>
                ) : null}
                {mode.apertureGuide ? (
                  <Text style={s.listItem}>
                    <Text style={{ fontWeight: "700" }}>Aperture:</Text> {mode.apertureGuide}
                  </Text>
                ) : null}
                <Text style={s.listItem}>
                  <Text style={{ fontWeight: "700" }}>ISO:</Text> {mode.isoRecommendation}
                </Text>
                <Text style={[s.sectionTitle, { fontSize: 12 }]}>Pro tips</Text>
                {mode.tips.map((tip) => (
                  <Text key={tip} style={s.listItem}>
                    • {tip}
                  </Text>
                ))}
                <Text style={[s.sectionTitle, { fontSize: 12 }]}>Avoid</Text>
                {mode.commonMistakes.map((mistake) => (
                  <Text key={mistake} style={s.listItem}>
                    • {mistake}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}

      <Text style={[s.sectionTitle, { marginTop: 16 }]}>Shooting scenarios</Text>
      {SHOOTING_SCENARIOS.map((sc) => (
        <Pressable key={sc.id} style={s.menuCard} onPress={() => setScenarioId(sc.id)}>
          <View style={{ flex: 1 }}>
            <Text style={s.menuTitle}>{sc.title}</Text>
            <Text style={s.menuDesc}>{sc.environment}</Text>
            <Text style={{ color: "#ff006e", fontSize: 12, marginTop: 6 }}>
              Recommended: {sc.recommendedMode}
            </Text>
          </View>
        </Pressable>
      ))}

      {scenario ? (
        <View style={[s.card, { marginTop: 12 }]}>
          <Text style={s.cardTitle}>{scenario.title}</Text>
          <Text style={s.cardBody}>{scenario.environment}</Text>
          <Text style={[s.listItem, { marginTop: 8 }]}>
            <Text style={{ fontWeight: "700" }}>Mode:</Text> {scenario.recommendedMode}
          </Text>
          {scenario.camera ? (
            <>
              <Text style={[s.sectionTitle, { fontSize: 13 }]}>Camera starting points</Text>
              {Object.entries(scenario.camera).map(([k, v]) => (
                <View key={k} style={s.row}>
                  <Text style={s.rowLabel}>{k}</Text>
                  <Text style={s.rowValue}>{String(v)}</Text>
                </View>
              ))}
            </>
          ) : null}
          <Text style={[s.sectionTitle, { fontSize: 13 }]}>Checklist</Text>
          {scenario.checklist.map((item) => (
            <Text key={item} style={s.listItem}>
              • {item}
            </Text>
          ))}
          <Pressable style={[s.btn, s.btnSecondary]} onPress={() => setScenarioId(null)}>
            <Text style={s.btnTxtSecondary}>Close scenario</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

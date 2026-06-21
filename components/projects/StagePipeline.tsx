import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  CREATOR_STAGES,
  STAGE_COLORS,
  STAGE_LABELS,
  type CreatorProjectStage,
} from "@/types/projects";
import { stageIndex } from "@/lib/projectPipeline";

interface StagePipelineProps {
  stage:      CreatorProjectStage;
  compact?:   boolean;
}

export function StagePipeline({ stage, compact }: StagePipelineProps) {
  const current = stageIndex(stage);

  return (
    <View style={styles.wrap}>
      {CREATOR_STAGES.map((s, idx) => {
        const active = idx === current;
        const done   = idx < current;
        const color  = STAGE_COLORS[s];
        return (
          <View key={s} style={styles.step}>
            <View
              style={[
                styles.dot,
                compact && styles.dotCompact,
                done && { backgroundColor: color },
                active && { backgroundColor: color, borderColor: color },
              ]}
            />
            {!compact ? (
              <Text
                style={[styles.label, active && { color }, done && styles.labelDone]}
                numberOfLines={1}
              >
                {STAGE_LABELS[s]}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 2,
  },
  step: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "transparent",
  },
  dotCompact: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 7,
    color: "rgba(255,255,255,0.35)",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  labelDone: {
    color: "rgba(255,255,255,0.55)",
  },
});

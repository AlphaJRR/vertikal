import React, { useEffect, useState } from "react";
import { ActivityIndicator, InteractionManager, Text, View } from "react-native";
import { brandColors, brandFonts } from "../../constants/theme";

type CreatorTrainingComponent = React.ComponentType;

/**
 * Loads Creator Training after tab transition so the Tools screen does not
 * synchronously parse toolkitCurriculum + slide asset maps on first paint.
 */
export function DeferredCreatorTraining() {
  const [Component, setComponent] = useState<CreatorTrainingComponent | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const task = InteractionManager.runAfterInteractions(() => {
      import("./CreatorTraining")
        .then((mod) => {
          if (!cancelled) setComponent(() => mod.CreatorTraining);
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    });

    return () => {
      cancelled = true;
      task.cancel();
    };
  }, []);

  if (failed) {
    return (
      <View style={{ paddingVertical: 24 }}>
        <Text style={{ fontFamily: brandFonts.body, color: brandColors.subtleText }}>
          Creator Training could not load. Force-quit and reopen the app.
        </Text>
      </View>
    );
  }

  if (!Component) {
    return (
      <View style={{ paddingVertical: 32, alignItems: "center" }}>
        <ActivityIndicator color={brandColors.alphaRed} />
      </View>
    );
  }

  return <Component />;
}

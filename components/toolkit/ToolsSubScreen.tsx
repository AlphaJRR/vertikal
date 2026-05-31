import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { brandColors } from "../../constants/theme";
import type { ToolkitMenuId } from "./ToolkitNavigator";

interface ToolsSubScreenProps {
  id: ToolkitMenuId;
  onBack: () => void;
}

type SubScreenComponent = React.ComponentType<{ onBack: () => void }>;

type LazySubScreenId =
  | "calculator"
  | "rate-calculator"
  | "presets"
  | "shooting-modes"
  | "shortcuts"
  | "training";

const LOADERS: Record<
  LazySubScreenId,
  () => Promise<{ default: SubScreenComponent }>
> = {
  calculator: () =>
    import("./ShootCalculator").then((m) => ({ default: m.ShootCalculator })),
  "rate-calculator": () =>
    import("./RateCalculator").then((m) => ({ default: m.RateCalculator })),
  presets: () =>
    import("./PresetsManager").then((m) => ({ default: m.PresetsManager })),
  "shooting-modes": () =>
    import("./SonyShootingModes").then((m) => ({ default: m.SonyShootingModes })),
  shortcuts: () =>
    import("./ToolkitModules").then((m) => ({ default: m.ShortcutsModule })),
  training: () =>
    import("./ToolkitModules").then((m) => ({ default: m.TrainingModule })),
};

export function ToolsSubScreen({ id, onBack }: ToolsSubScreenProps) {
  const [Screen, setScreen] = useState<SubScreenComponent | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = LOADERS[id as LazySubScreenId];
    if (!loader) {
      onBack();
      return;
    }

    loader()
      .then((mod) => {
        if (!cancelled) setScreen(() => mod.default);
      })
      .catch(() => {
        if (!cancelled) onBack();
      });

    return () => {
      cancelled = true;
    };
  }, [id, onBack]);

  if (!Screen) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={brandColors.alphaRed} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Screen onBack={onBack} />
    </View>
  );
}

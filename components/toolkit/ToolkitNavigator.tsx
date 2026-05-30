import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { toolkitStyles as s } from "./toolkitStyles";

export type ToolkitMenuId =
  | "calculator"
  | "training"
  | "checklists"
  | "shortcuts"
  | "invoice"
  | "presets"
  | "shooting-modes";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export interface ToolkitMenuItem {
  id: ToolkitMenuId;
  title: string;
  description: string;
  icon: IconName;
  color: string;
}

export const menuItems: ToolkitMenuItem[] = [
  {
    id: "calculator",
    title: "Shoot Calculator",
    description: "Aspect ratios and storage estimates",
    icon: "calculator-outline",
    color: "#00d4ff",
  },
  {
    id: "presets",
    title: "Equipment Presets",
    description: "Save camera + audio configurations",
    icon: "save-outline",
    color: "#8338ec",
  },
  {
    id: "shooting-modes",
    title: "Sony Shooting Modes",
    description: "Master manual, aperture, shutter modes",
    icon: "camera-outline",
    color: "#ff006e",
  },
  {
    id: "training",
    title: "Creator Training",
    description: "Workflows, client communication, on-set fundamentals",
    icon: "school-outline",
    color: "#3a86ff",
  },
  {
    id: "checklists",
    title: "Production Checklists",
    description: "Pre-shoot, on-set, and delivery checklists",
    icon: "checkbox-outline",
    color: "#06d6a0",
  },
  {
    id: "shortcuts",
    title: "Camera Shortcuts",
    description: "Sony custom buttons and menu quick reference",
    icon: "flash-outline",
    color: "#ffbe0b",
  },
  {
    id: "invoice",
    title: "Invoice Builder",
    description: "Line items, rates, and export-ready summaries",
    icon: "document-text-outline",
    color: "#fb5607",
  },
];

interface ToolkitNavigatorProps {
  onSelect: (id: ToolkitMenuId) => void;
}

export function ToolkitNavigator({ onSelect }: ToolkitNavigatorProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={[
        s.content,
        { paddingTop: 8, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.header}>
        <Text style={{ color: "#00d4ff", fontSize: 11, fontWeight: "700", letterSpacing: 2 }}>
          CREATOR TOOLS
        </Text>
        <Text style={s.title}>Alpha Creators Toolkit</Text>
        <Text style={s.subtitle}>On-set tools for AVA creators</Text>
      </View>

      {menuItems.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => onSelect(item.id)}
          style={s.menuCard}
        >
          <View style={[s.menuIcon, { backgroundColor: `${item.color}22` }]}>
            <Ionicons name={item.icon} size={22} color={item.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.menuTitle}>{item.title}</Text>
            <Text style={s.menuDesc}>{item.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#737373" />
        </Pressable>
      ))}
    </ScrollView>
  );
}

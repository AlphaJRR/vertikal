import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  ToolkitSlide,
  getSlidesByCategory,
  toolkitCategories,
} from "../../data/toolkitContent";
import { ToolkitSlideView } from "./ToolkitSlideView";
import { InvoiceBuilderSection } from "./InvoiceBuilder";
import { toolkitStyles as s } from "./toolkitStyles";

interface ModuleProps {
  onBack: () => void;
}

function ToolkitModuleShell({
  title,
  subtitle,
  onBack,
  children,
}: ModuleProps & { title: string; subtitle?: string; children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
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
        <Text style={s.title}>{title}</Text>
        {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </ScrollView>
  );
}

type TrainingView =
  | { mode: "categories" }
  | { mode: "category"; categoryId: string }
  | { mode: "slide"; slide: ToolkitSlide };

export function TrainingModule({ onBack }: ModuleProps) {
  const [view, setView] = useState<TrainingView>({ mode: "categories" });

  if (view.mode === "slide") {
    return (
      <ToolkitSlideView
        slide={view.slide}
        onBack={() =>
          setView({ mode: "category", categoryId: view.slide.categoryId })
        }
      />
    );
  }

  if (view.mode === "category") {
    const category = toolkitCategories.find((c) => c.id === view.categoryId);
    const slides = getSlidesByCategory(view.categoryId);
    return (
      <ToolkitModuleShell
        title={category?.name ?? "Category"}
        subtitle={`${slides.length} lessons`}
        onBack={() => setView({ mode: "categories" })}
      >
        {slides.map((slide) => (
          <Pressable
            key={slide.id}
            onPress={() => setView({ mode: "slide", slide })}
            style={s.menuCard}
          >
            <View style={[s.menuIcon, { backgroundColor: `${category?.color ?? "#00d4ff"}22` }]}>
              <Text style={{ color: category?.color ?? "#00d4ff", fontWeight: "800", fontSize: 12 }}>
                {slide.num || "•"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.menuTitle}>{slide.title}</Text>
              <Text style={s.menuDesc} numberOfLines={2}>
                {slide.summary}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#737373" />
          </Pressable>
        ))}
      </ToolkitModuleShell>
    );
  }

  return (
    <ToolkitModuleShell
      title="Creator Training"
      subtitle="37 lessons from the AVA Creators Toolkit"
      onBack={onBack}
    >
      {toolkitCategories.map((cat) => (
        <Pressable
          key={cat.id}
          onPress={() => setView({ mode: "category", categoryId: cat.id })}
          style={s.menuCard}
        >
          <View style={[s.menuIcon, { backgroundColor: `${cat.color}22` }]}>
            <Ionicons
              name={cat.icon as React.ComponentProps<typeof Ionicons>["name"]}
              size={22}
              color={cat.color}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.menuTitle}>{cat.name}</Text>
            <Text style={s.menuDesc}>{cat.slideCount} slides · tap to browse</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#737373" />
        </Pressable>
      ))}
    </ToolkitModuleShell>
  );
}

const CHECKLIST = [
  "Batteries charged (camera, grip, audio)",
  "Cards formatted & labeled",
  "Lens cloth, ND filters, rain cover",
  "Lav + boom + headphones test",
  "White balance + picture profile confirmed",
  "Client brief reviewed on set",
  "Backup audio recorder rolling",
  "Room tone captured (30s)",
];

export function ChecklistsModule({ onBack }: ModuleProps) {
  return (
    <ToolkitModuleShell title="Production Checklists" onBack={onBack}>
      {CHECKLIST.map((item) => (
        <Text key={item} style={s.listItem}>
          ☐ {item}
        </Text>
      ))}
    </ToolkitModuleShell>
  );
}

export function ShortcutsModule({ onBack }: ModuleProps) {
  const rows = [
    ["C1", "AF/MF toggle"],
    ["C2", "Focus peaking on/off"],
    ["C3", "Zebra display toggle"],
    ["C4", "S&Q / slow motion quick"],
    ["Fn", "White balance picker"],
  ];
  return (
    <ToolkitModuleShell title="Camera Shortcuts" onBack={onBack}>
      <View style={s.card}>
        <Text style={s.cardTitle}>Suggested custom buttons (Sony)</Text>
        {rows.map(([label, value]) => (
          <View key={label} style={s.row}>
            <Text style={s.rowLabel}>{label}</Text>
            <Text style={s.rowValue}>{value}</Text>
          </View>
        ))}
      </View>
    </ToolkitModuleShell>
  );
}

export function InvoiceModule({ onBack }: ModuleProps) {
  return (
    <ToolkitModuleShell title="Invoice Builder" onBack={onBack}>
      <InvoiceBuilderSection showHeader={false} />
    </ToolkitModuleShell>
  );
}

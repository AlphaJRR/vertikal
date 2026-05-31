import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DeferredCreatorTraining } from "./DeferredCreatorTraining";
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

export function TrainingModule({ onBack }: ModuleProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.screen, { flex: 1, paddingTop: 8, paddingBottom: insets.bottom }]}>
      <Pressable onPress={onBack} style={{ paddingHorizontal: 20, marginBottom: 4 }}>
        <Text style={s.backTxt}>← Toolkit</Text>
      </Pressable>
      <DeferredCreatorTraining />
    </View>
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

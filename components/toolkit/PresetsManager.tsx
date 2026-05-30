import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEFAULT_PRESETS,
  PRESET_STORAGE_KEY,
  PresetConfig,
  createEmptyPreset,
  duplicatePreset,
} from "../../data/presetsData";
import { toolkitStyles as s } from "./toolkitStyles";

interface PresetsManagerProps {
  onBack: () => void;
}

async function loadPresets(): Promise<PresetConfig[]> {
  try {
    const raw = await AsyncStorage.getItem(PRESET_STORAGE_KEY);
    if (!raw) return [...DEFAULT_PRESETS];
    const parsed = JSON.parse(raw) as PresetConfig[];
    return parsed.length ? parsed : [...DEFAULT_PRESETS];
  } catch {
    return [...DEFAULT_PRESETS];
  }
}

async function savePresets(presets: PresetConfig[]) {
  await AsyncStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));
}

export function PresetsManager({ onBack }: PresetsManagerProps) {
  const insets = useSafeAreaInsets();
  const [presets, setPresets] = useState<PresetConfig[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<PresetConfig | null>(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    loadPresets().then(setPresets);
  }, []);

  const persist = useCallback(async (next: PresetConfig[]) => {
    setPresets(next);
    await savePresets(next);
  }, []);

  const selected = presets.find((p) => p.id === selectedId) ?? null;

  const handleCreate = async () => {
    const name = newName.trim() || "New Preset";
    const preset = createEmptyPreset(name);
    await persist([preset, ...presets]);
    setNewName("");
    setSelectedId(preset.id);
    setEditing(preset);
  };

  const handleDuplicate = async (preset: PresetConfig) => {
    const copy = duplicatePreset(preset);
    await persist([copy, ...presets]);
    setSelectedId(copy.id);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete preset", "Delete this preset?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const next = presets.filter((p) => p.id !== id);
          await persist(next.length ? next : [...DEFAULT_PRESETS]);
          if (selectedId === id) {
            setSelectedId(null);
            setEditing(null);
          }
        },
      },
    ]);
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    const next = presets.map((p) =>
      p.id === editing.id ? { ...editing, updatedAt: new Date().toISOString() } : p
    );
    await persist(next);
    setEditing(null);
  };

  const updateEditing = (field: keyof PresetConfig, value: string) => {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  };

  const updateCamera = (field: keyof PresetConfig["camera"], value: string) => {
    if (!editing) return;
    setEditing({ ...editing, camera: { ...editing.camera, [field]: value } });
  };

  const updateAudio = (field: keyof PresetConfig["audio"], value: string | boolean) => {
    if (!editing) return;
    setEditing({ ...editing, audio: { ...editing.audio, [field]: value } });
  };

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
        <Text style={s.title}>Equipment Presets</Text>
        <Text style={s.subtitle}>Camera + audio configurations</Text>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>New preset</Text>
        <TextInput
          style={s.input}
          placeholder="Preset name"
          placeholderTextColor="#555"
          value={newName}
          onChangeText={setNewName}
        />
        <Pressable style={[s.btn, s.btnPrimary]} onPress={handleCreate}>
          <Text style={s.btnTxtPrimary}>Create preset</Text>
        </Pressable>
      </View>

      {editing ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Edit — {editing.name}</Text>
          <TextInput
            style={s.input}
            value={editing.name}
            onChangeText={(v) => updateEditing("name", v)}
          />
          <TextInput
            style={s.textarea}
            value={editing.description}
            onChangeText={(v) => updateEditing("description", v)}
            placeholder="Description"
            placeholderTextColor="#555"
            multiline
          />
          <Text style={s.cardBody}>Category: {editing.category}</Text>

          <Text style={[s.sectionTitle, { marginTop: 12 }]}>Camera</Text>
          {(Object.keys(editing.camera) as Array<keyof PresetConfig["camera"]>).map(
            (key) => (
              <TextInput
                key={key}
                style={s.input}
                placeholder={key}
                placeholderTextColor="#555"
                value={editing.camera[key]}
                onChangeText={(v) => updateCamera(key, v)}
              />
            )
          )}

          <Text style={s.sectionTitle}>Audio</Text>
          <TextInput
            style={s.input}
            placeholder="Input level"
            placeholderTextColor="#555"
            value={editing.audio.inputLevel}
            onChangeText={(v) => updateAudio("inputLevel", v)}
          />
          <TextInput
            style={s.input}
            placeholder="Mic type"
            placeholderTextColor="#555"
            value={editing.audio.micType}
            onChangeText={(v) => updateAudio("micType", v)}
          />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Text style={s.cardBody}>Wind cut</Text>
            <Switch
              value={editing.audio.windCut}
              onValueChange={(v) => updateAudio("windCut", v)}
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Text style={s.cardBody}>Limiter on</Text>
            <Switch
              value={editing.audio.limiter}
              onValueChange={(v) => updateAudio("limiter", v)}
            />
          </View>
          <TextInput
            style={s.textarea}
            value={editing.notes}
            onChangeText={(v) => updateEditing("notes", v)}
            placeholder="Notes"
            placeholderTextColor="#555"
            multiline
          />
          <View style={s.actionsRow}>
            <Pressable style={[s.btn, s.btnPrimary, { flex: 1 }]} onPress={handleSaveEdit}>
              <Text style={s.btnTxtPrimary}>Save changes</Text>
            </Pressable>
            <Pressable style={[s.btn, s.btnSecondary, { flex: 1 }]} onPress={() => setEditing(null)}>
              <Text style={s.btnTxtSecondary}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View style={s.section}>
        <Text style={s.sectionTitle}>Saved presets ({presets.length})</Text>
        {presets.map((preset) => (
          <View key={preset.id} style={s.card}>
            <Text style={s.cardTitle}>{preset.name}</Text>
            <Text style={s.cardBody}>{preset.description || "No description"}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
              <Text style={s.tag}>{preset.category}</Text>
              {preset.tags.map((tag) => (
                <Text key={tag} style={s.tag}>
                  {tag}
                </Text>
              ))}
            </View>

            {selectedId === preset.id && selected ? (
              <View style={{ marginTop: 10 }}>
                <View style={s.row}>
                  <Text style={s.rowLabel}>Mode</Text>
                  <Text style={s.rowValue}>{selected.camera.mode}</Text>
                </View>
                <View style={s.row}>
                  <Text style={s.rowLabel}>Shutter</Text>
                  <Text style={s.rowValue}>{selected.camera.shutter}</Text>
                </View>
                <View style={s.row}>
                  <Text style={s.rowLabel}>Aperture</Text>
                  <Text style={s.rowValue}>{selected.camera.aperture}</Text>
                </View>
                <View style={s.row}>
                  <Text style={s.rowLabel}>ISO</Text>
                  <Text style={s.rowValue}>{selected.camera.iso}</Text>
                </View>
                <View style={s.row}>
                  <Text style={s.rowLabel}>Audio</Text>
                  <Text style={s.rowValue}>{selected.audio.micType}</Text>
                </View>
              </View>
            ) : null}

            <View style={s.actionsRow}>
              <Pressable
                style={[s.btn, s.btnSecondary]}
                onPress={() => setSelectedId(selectedId === preset.id ? null : preset.id)}
              >
                <Text style={s.btnTxtSecondary}>
                  {selectedId === preset.id ? "Hide" : "View"}
                </Text>
              </Pressable>
              <Pressable style={[s.btn, s.btnSecondary]} onPress={() => setEditing(preset)}>
                <Text style={s.btnTxtSecondary}>Edit</Text>
              </Pressable>
              <Pressable style={[s.btn, s.btnSecondary]} onPress={() => handleDuplicate(preset)}>
                <Text style={s.btnTxtSecondary}>Duplicate</Text>
              </Pressable>
              <Pressable style={[s.btn, s.btnDanger]} onPress={() => handleDelete(preset.id)}>
                <Text style={s.btnTxtDanger}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

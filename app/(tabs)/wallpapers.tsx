import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system/legacy";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { brandColors, brandFonts, typography } from "../../constants/brand";
import { getWallpapers, type WallpaperEntry } from "../../constants/wallpapers";
import { WALLPAPER_COUNT } from "../../data/wallpaperManifest";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_GAP = 10;
const GRID_PADDING = 16;
const NUM_COLUMNS = 2;
const TILE_SIZE =
  (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

export default function WallpapersScreen() {
  const insets = useSafeAreaInsets();
  const wallpapers = useMemo(() => getWallpapers(), []);
  const [preview, setPreview] = useState<WallpaperEntry | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const closePreview = useCallback(() => setPreview(null), []);

  const saveToPhotos = useCallback(async (entry: WallpaperEntry) => {
    setSavingId(entry.id);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Allow AVA to save images to your photo library to download wallpapers.",
        );
        return;
      }

      const safeName = entry.filename.replace(/[/\\?%*:|"<>]/g, "_");
      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) {
        throw new Error("Cache directory unavailable");
      }

      const localUri = `${cacheDir}ava-wallpaper-${entry.id}-${safeName}`;
      const download = await FileSystem.downloadAsync(entry.publicUrl, localUri);
      if (download.status !== 200) {
        throw new Error(`Download failed with status ${download.status}`);
      }

      await MediaLibrary.saveToLibraryAsync(download.uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
      Alert.alert("Saved", "Wallpaper added to your Photos library.");
    } catch (error) {
      console.error("[WallpapersScreen] saveToPhotos failed:", error);
      Alert.alert(
        "Download failed",
        "Could not save this wallpaper. Check your connection and that images are hosted on the CDN.",
      );
    } finally {
      setSavingId(null);
    }
  }, []);

  const renderTile = useCallback(
    ({ item }: { item: WallpaperEntry }) => (
      <Pressable
        style={styles.tile}
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          setPreview(item);
        }}
        accessibilityRole="button"
        accessibilityLabel={`Preview wallpaper ${item.id}`}
      >
        <Image
          source={{ uri: item.publicUrl }}
          style={styles.tileImage}
          contentFit="cover"
          transition={200}
          recyclingKey={item.id}
        />
      </Pressable>
    ),
    [],
  );

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: 8 }]}>
        <Text style={styles.eyebrow}>AVA — Creator assets</Text>
        <Text style={styles.h1}>
          Wallpapers
          {"\n"}
          <Text style={styles.cyan}>for your lock screen.</Text>
        </Text>
        <Text style={styles.sub}>
          {WALLPAPER_COUNT} high-res frames from the ALPHA archive. Tap to preview,
          then save to Photos.
        </Text>
      </View>

      <FlatList
        data={wallpapers}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Math.max(insets.bottom, 24) + 16 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={renderTile}
      />

      <Modal
        visible={preview !== null}
        animationType="fade"
        transparent
        onRequestClose={closePreview}
      >
        {preview ? (
          <View style={styles.modalRoot}>
            <Pressable style={styles.modalBackdrop} onPress={closePreview} />
            <View style={[styles.modalChrome, { paddingTop: insets.top + 8 }]}>
              <Pressable
                onPress={closePreview}
                style={styles.modalClose}
                accessibilityLabel="Close preview"
              >
                <Ionicons name="close" size={28} color={brandColors.pureWhite} />
              </Pressable>
              <Pressable
                onPress={() => saveToPhotos(preview)}
                style={styles.modalSave}
                disabled={savingId === preview.id}
                accessibilityLabel="Save wallpaper to Photos"
              >
                {savingId === preview.id ? (
                  <ActivityIndicator color="#0a0a0a" />
                ) : (
                  <>
                    <Ionicons name="download-outline" size={20} color="#0a0a0a" />
                    <Text style={styles.modalSaveTxt}>Save to Photos</Text>
                  </>
                )}
              </Pressable>
            </View>
            <Image
              source={{ uri: preview.publicUrl }}
              style={styles.previewImage}
              contentFit="contain"
              transition={300}
            />
            <Text style={styles.previewMeta} numberOfLines={1}>
              {preview.filename}
            </Text>
          </View>
        ) : null}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },
  header: { paddingHorizontal: GRID_PADDING, paddingBottom: 12 },
  eyebrow: { ...typography.meta, color: "#666", marginBottom: 8 },
  h1: {
    fontFamily: brandFonts.display,
    fontSize: 32,
    color: brandColors.pureWhite,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    lineHeight: 36,
  },
  cyan: { color: "#00d4ff" },
  sub: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    color: brandColors.mutedText,
    lineHeight: 20,
    marginTop: 10,
  },
  list: { paddingHorizontal: GRID_PADDING, paddingTop: 4 },
  row: { gap: GRID_GAP, marginBottom: GRID_GAP },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE * 1.45,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: brandColors.graphite,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  tileImage: { width: "100%", height: "100%" },
  modalRoot: { flex: 1, backgroundColor: "rgba(0,0,0,0.92)" },
  modalBackdrop: { ...StyleSheet.absoluteFillObject },
  modalChrome: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 2,
  },
  modalClose: { padding: 8 },
  modalSave: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#00d4ff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 140,
    justifyContent: "center",
  },
  modalSaveTxt: {
    fontFamily: brandFonts.bodySemiBold,
    fontSize: 14,
    color: "#0a0a0a",
    fontWeight: "600",
  },
  previewImage: {
    flex: 1,
    width: "100%",
    marginTop: 8,
  },
  previewMeta: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});

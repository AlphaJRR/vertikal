import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { brandColors, brandFonts } from "../../constants/theme";
import {
  DEFAULT_INVOICE_LOGO_OPTION,
  INVOICE_LOGO_OPTIONS,
  InvoiceLogoOption,
  MAX_INVOICE_LOGO_BYTES,
} from "../../types/invoiceLogo";
import {
  deleteInvoiceLogoFromSupabase,
  getInvoiceLogoUserId,
  loadInvoiceLogoSettings,
  saveInvoiceLogoSettings,
  uploadInvoiceLogoToSupabase,
} from "../../utils/invoiceLogo";
import { creatorTrainingStyles as sectionStyles } from "./creatorTrainingStyles";
import { InvoicePreview } from "./InvoicePreview";

const LINE_ITEMS = [
  "Production day — $X / 10hr",
  "Half day — $X / 5hr",
  "Edit / color — $X per minute delivered",
  "Travel — mileage + per diem",
  "Rush fee — +25% under 48hr turnaround",
];

export function InvoiceBuilderSection({ showHeader = true }: { showHeader?: boolean }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [logoOption, setLogoOption] = useState<InvoiceLogoOption>(DEFAULT_INVOICE_LOGO_OPTION);
  const [creatorLogoUri, setCreatorLogoUri] = useState<string | null>(null);
  const [localPreviewUri, setLocalPreviewUri] = useState<string | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const previewUri = localPreviewUri ?? creatorLogoUri;

  const persistSettings = useCallback(
    async (option: InvoiceLogoOption, logoUrl: string | null) => {
      if (!userId) return;
      setSaving(true);
      await saveInvoiceLogoSettings(userId, {
        logoOption: option,
        creatorLogoUrl: logoUrl,
      });
      setSaving(false);
    },
    [userId],
  );

  const applyLogoOption = useCallback(
    (option: InvoiceLogoOption) => {
      if (option === "creator" && !previewUri) return;
      setLogoOption(option);
      void persistSettings(option, creatorLogoUri);
    },
    [previewUri, creatorLogoUri, persistSettings],
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      const id = await getInvoiceLogoUserId();
      if (!mounted) return;
      setUserId(id);

      if (id) {
        const settings = await loadInvoiceLogoSettings(id);
        if (!mounted) return;
        setLogoOption(settings.logoOption);
        setCreatorLogoUri(settings.creatorLogoUrl);
      }

      setLoadingSettings(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const pickLogo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Allow photo library access to upload your logo.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled || !result.assets[0]) return;

      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > MAX_INVOICE_LOGO_BYTES) {
        Alert.alert("File Too Large", "Logo must be 2MB or smaller. Use a PNG, JPG, or SVG.");
        return;
      }

      setLocalPreviewUri(asset.uri);
      setUploading(true);

      if (userId) {
        const publicUrl = await uploadInvoiceLogoToSupabase(asset.uri, userId);
        if (publicUrl) {
          setCreatorLogoUri(publicUrl);
          setLocalPreviewUri(null);
          setLogoOption("creator");
          await persistSettings("creator", publicUrl);
        } else {
          Alert.alert("Upload Failed", "Could not save logo. Check your connection and try again.");
          setLocalPreviewUri(null);
        }
      } else {
        setLogoOption("creator");
      }

      setUploading(false);
    } catch {
      setUploading(false);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const removeLogo = async () => {
    Alert.alert("Remove Logo", "Delete your uploaded logo and revert to AVA branding?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          if (userId) {
            await deleteInvoiceLogoFromSupabase(userId, creatorLogoUri);
            await persistSettings(DEFAULT_INVOICE_LOGO_OPTION, null);
          }
          setCreatorLogoUri(null);
          setLocalPreviewUri(null);
          setLogoOption(DEFAULT_INVOICE_LOGO_OPTION);
        },
      },
    ]);
  };

  return (
    <View style={sectionStyles.section}>
      {showHeader ? (
        <View style={sectionStyles.sectionHeader}>
          <Text style={sectionStyles.sectionEyebrow}>Invoice Builder</Text>
          <Text style={sectionStyles.sectionTitle}>Line Items</Text>
          <Text style={styles.sectionDesc}>
            Standard line items for AVA creators. Export full invoices from the client portal after
            booking.
          </Text>
        </View>
      ) : null}

      <View style={styles.card}>
        {LINE_ITEMS.map((line) => (
          <Text key={line} style={styles.listItem}>
            {line}
          </Text>
        ))}
      </View>

      <View style={styles.logoSection}>
        <Text style={styles.logoEyebrow}>Your Logo</Text>
        <Text style={styles.logoSubLabel}>
          Upload your logo to replace or remove the AVA watermark
        </Text>

        {previewUri ? (
          <View style={styles.thumbnailRow}>
            <Image source={{ uri: previewUri }} style={styles.thumbnail} resizeMode="contain" />
            <Pressable onPress={removeLogo} style={styles.removeBtn} hitSlop={8}>
              <Ionicons name="close" size={18} color={brandColors.pureWhite} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={pickLogo}
            disabled={uploading}
            style={({ pressed }) => [styles.uploadBox, pressed && styles.uploadBoxPressed]}
          >
            {uploading ? (
              <ActivityIndicator color={brandColors.pureWhite} />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={24} color={brandColors.pureWhite} />
                <Text style={styles.uploadText}>Drag & Drop or Click to Upload</Text>
                <Text style={styles.uploadHint}>
                  PNG, SVG, JPG · Max 2MB · Recommended: transparent PNG
                </Text>
              </>
            )}
          </Pressable>
        )}

        <View style={styles.pillRow}>
          {INVOICE_LOGO_OPTIONS.map((opt) => {
            const disabled = opt.value === "creator" && !previewUri;
            const active = logoOption === opt.value;
            return (
              <Pressable
                key={opt.value}
                disabled={disabled}
                onPress={() => applyLogoOption(opt.value)}
                style={[
                  styles.pill,
                  active && styles.pillActive,
                  disabled && styles.pillDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    active && styles.pillTextActive,
                    disabled && styles.pillTextDisabled,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {loadingSettings || saving ? (
          <Text style={styles.syncNote}>
            {loadingSettings ? "Loading logo settings…" : "Saving…"}
          </Text>
        ) : null}

        {!userId ? (
          <Text style={styles.syncNote}>Sign in to persist logo settings to your profile.</Text>
        ) : null}
      </View>

      <InvoicePreview
        logoOption={logoOption}
        creatorLogoUri={previewUri}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionDesc: {
    fontFamily: brandFonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: brandColors.subtleText,
    marginTop: 8,
  },
  card: {
    backgroundColor: brandColors.graphite,
    borderWidth: 1,
    borderColor: brandColors.borderGray,
    borderRadius: 0,
    padding: 16,
    marginBottom: 20,
  },
  listItem: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: brandColors.secondaryText,
    marginBottom: 6,
  },
  logoSection: {
    marginBottom: 8,
  },
  logoEyebrow: {
    fontFamily: brandFonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: brandColors.alphaRed,
    marginBottom: 6,
  },
  logoSubLabel: {
    fontFamily: brandFonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: brandColors.inactiveTab,
    marginBottom: 12,
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: brandColors.borderGray,
    backgroundColor: brandColors.graphite,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  uploadBoxPressed: {
    opacity: 0.85,
  },
  uploadText: {
    fontFamily: brandFonts.mono,
    fontSize: 9,
    letterSpacing: 1.35,
    textTransform: "uppercase",
    color: brandColors.inactiveTab,
    marginTop: 10,
    textAlign: "center",
  },
  uploadHint: {
    fontFamily: brandFonts.mono,
    fontSize: 9,
    color: "#333333",
    marginTop: 6,
    textAlign: "center",
  },
  thumbnailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  thumbnail: {
    width: 120,
    height: 60,
    backgroundColor: brandColors.graphite,
    borderWidth: 1,
    borderColor: brandColors.borderGray,
  },
  removeBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: brandColors.borderGray,
  },
  pillRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  pill: {
    flex: 1,
    minWidth: 90,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: brandColors.graphite,
    borderWidth: 1,
    borderColor: brandColors.borderGray,
    alignItems: "center",
  },
  pillActive: {
    backgroundColor: brandColors.alphaRed,
    borderColor: brandColors.alphaRed,
  },
  pillDisabled: {
    opacity: 0.4,
  },
  pillText: {
    fontFamily: brandFonts.mono,
    fontSize: 9,
    letterSpacing: 1.35,
    textTransform: "uppercase",
    color: brandColors.inactiveTab,
  },
  pillTextActive: {
    fontFamily: brandFonts.display,
    color: brandColors.pureWhite,
  },
  pillTextDisabled: {
    color: brandColors.inactiveTab,
  },
  syncNote: {
    fontFamily: brandFonts.mono,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: brandColors.inactiveTab,
    marginTop: 10,
  },
});

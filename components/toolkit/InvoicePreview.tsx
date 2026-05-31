import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { brandColors, brandFonts } from "../../constants/theme";
import type { InvoiceLogoOption } from "../../types/invoiceLogo";

const AVA_LOGO = require("../../assets/images/ava-logo-transparent.png");

const DEFAULT_LINES = [
  { label: "Production day", amount: "$X / 10hr" },
  { label: "Half day", amount: "$X / 5hr" },
  { label: "Edit / color", amount: "$X per minute delivered" },
  { label: "Travel", amount: "Mileage + per diem" },
  { label: "Rush fee", amount: "+25% under 48hr turnaround" },
];

export interface InvoicePreviewProps {
  logoOption: InvoiceLogoOption;
  creatorLogoUri: string | null;
  businessName?: string;
}

export function InvoicePreview({
  logoOption,
  creatorLogoUri,
  businessName = "Your Business Name",
}: InvoicePreviewProps) {
  const showAvaLogo = logoOption === "ava";
  const showCreatorLogo = logoOption === "creator" && !!creatorLogoUri;
  const showNoLogo = logoOption === "none";

  return (
    <View style={styles.previewCard}>
      <Text style={styles.previewLabel}>Live Preview</Text>

      <View style={styles.invoicePaper}>
        <View style={[styles.header, showNoLogo && styles.headerNoLogo]}>
          {showAvaLogo ? (
            <Image source={AVA_LOGO} style={styles.avaLogo} resizeMode="contain" />
          ) : null}
          {showCreatorLogo ? (
            <Image
              source={{ uri: creatorLogoUri }}
              style={styles.creatorLogo}
              resizeMode="contain"
            />
          ) : null}
          {showNoLogo ? (
            <Text style={styles.businessName}>{businessName}</Text>
          ) : null}
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Invoice #</Text>
          <Text style={styles.metaValue}>AVA-2026-001</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Date</Text>
          <Text style={styles.metaValue}>
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.lineHeader}>Line Items</Text>
        {DEFAULT_LINES.map((line) => (
          <View key={line.label} style={styles.lineRow}>
            <Text style={styles.lineLabel}>{line.label}</Text>
            <Text style={styles.lineAmount}>{line.amount}</Text>
          </View>
        ))}

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            Export full invoices from the client portal after booking.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  previewCard: {
    backgroundColor: brandColors.graphite,
    borderWidth: 1,
    borderColor: brandColors.borderGray,
    borderRadius: 0,
    padding: 16,
    marginTop: 16,
  },
  previewLabel: {
    fontFamily: brandFonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: brandColors.alphaRed,
    marginBottom: 12,
  },
  invoicePaper: {
    backgroundColor: brandColors.deepBlack,
    borderWidth: 1,
    borderColor: brandColors.borderGray,
    padding: 16,
  },
  header: {
    minHeight: 60,
    justifyContent: "center",
    marginBottom: 16,
  },
  headerNoLogo: {
    minHeight: 0,
    marginBottom: 12,
  },
  avaLogo: {
    width: 140,
    height: 48,
  },
  creatorLogo: {
    maxWidth: 120,
    height: 60,
  },
  businessName: {
    fontFamily: brandFonts.display,
    fontSize: 28,
    color: brandColors.pureWhite,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  metaLabel: {
    fontFamily: brandFonts.mono,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: brandColors.inactiveTab,
  },
  metaValue: {
    fontFamily: brandFonts.body,
    fontSize: 12,
    color: brandColors.secondaryText,
  },
  divider: {
    height: 1,
    backgroundColor: brandColors.borderGray,
    marginVertical: 12,
  },
  lineHeader: {
    fontFamily: brandFonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: brandColors.alphaRed,
    marginBottom: 10,
  },
  lineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: brandColors.borderGray,
  },
  lineLabel: {
    fontFamily: brandFonts.body,
    fontSize: 13,
    color: brandColors.secondaryText,
    flex: 1,
  },
  lineAmount: {
    fontFamily: brandFonts.bodySemiBold,
    fontSize: 13,
    color: brandColors.pureWhite,
  },
  footerNote: {
    marginTop: 14,
  },
  footerText: {
    fontFamily: brandFonts.body,
    fontSize: 11,
    lineHeight: 16,
    color: brandColors.inactiveTab,
  },
});

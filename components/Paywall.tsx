import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter, type Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { PurchasesPackage } from "react-native-purchases";
import { FREE_LAUNCH } from "../constants/proAccess";
import { brandColors, brandFonts } from "../constants/theme";
import { TOOLKIT_LESSON_COUNT } from "../data/toolkitCurriculumTypes";
import { useAvaPro, type AvaProStatus } from "../hooks/useAvaPro";
import {
  formatPackagePrice,
  getFoundingPackages,
  getOfferings,
  hasProEntitlement,
  isUserCancelledPurchase,
  purchasePackage,
  restorePurchases,
} from "../lib/purchases";
import { ProLockBadge } from "./toolkit/ProLockBadge";

interface PaywallProps {
  /** Locked item name shown above the AVA Pro headline (e.g. lesson title). */
  contextTitle?: string;
  subtitle?: string;
  status: AvaProStatus;
  isSignedIn: boolean;
  onBack?: () => void;
}

const DEFAULT_SUBTITLE = `Full Creators Toolkit — all ${TOOLKIT_LESSON_COUNT} lessons, cheat sheets, invoice builder, production checklists, and pro tools.`;

const TERMS_URL = "https://alphavisualartists.com/terms";
const PRIVACY_URL = "https://alphavisualartists.com/privacy";

const AUTO_RENEWAL_DISCLOSURE =
  "Payment will be charged to your Apple ID account at confirmation of purchase. " +
  "Subscription automatically renews unless canceled at least 24 hours before the end of the current period. " +
  "Your account will be charged for renewal within 24 hours prior to the end of the current period. " +
  "Manage and cancel subscriptions in your App Store account settings.";

export function Paywall({
  contextTitle,
  subtitle = DEFAULT_SUBTITLE,
  status,
  isSignedIn,
  onBack,
}: PaywallProps) {
  const router = useRouter();
  const { refresh } = useAvaPro();
  const [monthlyPkg, setMonthlyPkg] = useState<PurchasesPackage | null>(null);
  const [annualPkg, setAnnualPkg] = useState<PurchasesPackage | null>(null);
  const [offeringsLoading, setOfferingsLoading] = useState(true);
  const [offeringsError, setOfferingsError] = useState<string | null>(null);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  const loadOfferings = useCallback(async () => {
    setOfferingsLoading(true);
    setOfferingsError(null);
    try {
      const offerings = await getOfferings();
      if (!offerings?.current) {
        setOfferingsError("Subscriptions are not available right now. Try again later.");
        setMonthlyPkg(null);
        setAnnualPkg(null);
        return;
      }
      const founding = getFoundingPackages(offerings);
      setMonthlyPkg(founding.monthly);
      setAnnualPkg(founding.annual);
      if (!founding.monthly && !founding.annual) {
        setOfferingsError("AVA Pro plans are not configured yet.");
      }
    } catch (error) {
      console.error("[Paywall] loadOfferings failed:", error);
      setOfferingsError("Could not load subscription options.");
    } finally {
      setOfferingsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (FREE_LAUNCH) return;
    void loadOfferings();
  }, [loadOfferings]);

  const handlePurchase = async (pkg: PurchasesPackage) => {
    if (!isSignedIn) {
      router.push("/sign-in" as Href);
      return;
    }

    setPurchasingId(pkg.identifier);
    try {
      const info = await purchasePackage(pkg);
      if (hasProEntitlement(info)) {
        refresh();
        Alert.alert("Welcome to AVA Pro", "Your subscription is active.");
      } else {
        Alert.alert(
          "Purchase received",
          "Your purchase is processing. Pro access may take a moment to activate.",
        );
        refresh();
      }
    } catch (error) {
      if (isUserCancelledPurchase(error)) return;
      console.error("[Paywall] purchase failed:", error);
      Alert.alert(
        "Purchase failed",
        "We could not complete your purchase. Please try again.",
      );
    } finally {
      setPurchasingId(null);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const info = await restorePurchases();
      refresh();
      if (hasProEntitlement(info)) {
        Alert.alert("Restored", "Your AVA Pro subscription has been restored.");
      } else {
        Alert.alert(
          "No subscription found",
          "We could not find an active AVA Pro subscription for this Apple ID.",
        );
      }
    } catch (error) {
      console.error("[Paywall] restore failed:", error);
      Alert.alert(
        "Restore failed",
        "We could not restore purchases. Please try again.",
      );
    } finally {
      setRestoring(false);
    }
  };

  const openUrl = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("[Paywall] openUrl failed:", err),
    );
  };

  if (FREE_LAUNCH) {
    return null;
  }

  if (status === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#00BFFF" size="large" />
        <Text style={styles.loadingText}>Checking access…</Text>
      </View>
    );
  }

  const monthlyPrice =
    formatPackagePrice(monthlyPkg) ?? "$9.99/month";
  const annualPrice =
    formatPackagePrice(annualPkg) ?? "$39.99/year";
  const busy = purchasingId != null || restoring;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.centered}>
        <ProLockBadge />
        <Ionicons
          name="lock-closed"
          size={40}
          color="#00BFFF"
          style={styles.lockIcon}
        />
        {contextTitle ? (
          <Text style={styles.contextTitle}>{contextTitle}</Text>
        ) : null}
        <Text style={styles.title}>AVA Pro</Text>
        <Text style={styles.body}>{subtitle}</Text>

        <View style={styles.proCard}>
          <Text style={styles.priceHero}>{annualPrice}</Text>
          <Text style={styles.priceHeroLabel}>Founding member price</Text>
          <Text style={styles.priceSecondary}>or {monthlyPrice}</Text>
          <Text style={styles.iapNote}>
            AVA Pro is a subscription unlocked through the App Store. Digital
            content is not sold via web checkout in this app.
          </Text>
        </View>

        {offeringsLoading ? (
          <ActivityIndicator color="#00BFFF" style={styles.offeringsLoader} />
        ) : null}

        {offeringsError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{offeringsError}</Text>
            <Pressable onPress={() => void loadOfferings()} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {!offeringsLoading && isSignedIn ? (
          <View style={styles.actions}>
            {annualPkg ? (
              <Pressable
                onPress={() => void handlePurchase(annualPkg)}
                disabled={busy}
                style={[styles.primaryBtn, busy && styles.btnDisabled]}
              >
                {purchasingId === annualPkg.identifier ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.primaryBtnText}>
                    Subscribe — {annualPrice}
                  </Text>
                )}
              </Pressable>
            ) : null}

            {monthlyPkg ? (
              <Pressable
                onPress={() => void handlePurchase(monthlyPkg)}
                disabled={busy}
                style={[styles.secondaryBtn, busy && styles.btnDisabled]}
              >
                {purchasingId === monthlyPkg.identifier ? (
                  <ActivityIndicator color="#00BFFF" />
                ) : (
                  <Text style={styles.secondaryBtnText}>
                    Subscribe — {monthlyPrice}
                  </Text>
                )}
              </Pressable>
            ) : null}

            <Pressable
              onPress={() => void handleRestore()}
              disabled={busy}
              style={styles.restoreBtn}
            >
              {restoring ? (
                <ActivityIndicator color={brandColors.mutedText} />
              ) : (
                <Text style={styles.restoreText}>Restore Purchases</Text>
              )}
            </Pressable>
          </View>
        ) : null}

        {!isSignedIn ? (
          <Pressable
            onPress={() => router.push("/sign-in" as Href)}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>Sign in to subscribe</Text>
          </Pressable>
        ) : null}

        <Text style={styles.disclosure}>{AUTO_RENEWAL_DISCLOSURE}</Text>

        <View style={styles.legalRow}>
          <Pressable onPress={() => openUrl(TERMS_URL)}>
            <Text style={styles.legalLink}>Terms of Use</Text>
          </Pressable>
          <Text style={styles.legalSep}>·</Text>
          <Pressable onPress={() => openUrl(PRIVACY_URL)}>
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </Pressable>
        </View>

        {onBack ? (
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backLink}>← Back</Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    color: brandColors.subtleText,
    marginTop: 12,
  },
  lockIcon: {
    marginTop: 16,
    marginBottom: 12,
  },
  contextTitle: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: brandColors.mutedText,
    marginBottom: 8,
    textAlign: "center",
  },
  title: {
    fontFamily: brandFonts.display,
    fontSize: 28,
    color: brandColors.pureWhite,
    marginBottom: 12,
    textAlign: "center",
    textTransform: "uppercase",
  },
  body: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: brandColors.subtleText,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  proCard: {
    width: "100%",
    maxWidth: 340,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 191, 255, 0.35)",
    backgroundColor: "rgba(0, 191, 255, 0.08)",
    marginBottom: 20,
    alignItems: "center",
  },
  priceHero: {
    fontFamily: brandFonts.display,
    fontSize: 36,
    color: "#00BFFF",
    marginBottom: 4,
  },
  priceHeroLabel: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: brandColors.secondaryText,
    marginBottom: 8,
  },
  priceSecondary: {
    fontFamily: brandFonts.body,
    fontSize: 13,
    color: brandColors.mutedText,
    marginBottom: 12,
  },
  iapNote: {
    fontFamily: brandFonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: brandColors.mutedText,
    textAlign: "center",
  },
  offeringsLoader: {
    marginBottom: 16,
  },
  errorBox: {
    width: "100%",
    maxWidth: 340,
    marginBottom: 16,
    alignItems: "center",
  },
  errorText: {
    fontFamily: brandFonts.body,
    fontSize: 13,
    color: brandColors.alphaRed,
    textAlign: "center",
    marginBottom: 8,
  },
  retryBtn: {
    padding: 8,
  },
  retryText: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: "#00BFFF",
  },
  actions: {
    width: "100%",
    maxWidth: 340,
    marginBottom: 16,
  },
  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    backgroundColor: "#00BFFF",
    opacity: 1,
    marginBottom: 12,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
  },
  primaryBtnText: {
    fontFamily: brandFonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#000",
    fontWeight: "800",
  },
  secondaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 191, 255, 0.5)",
    marginBottom: 12,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
  },
  secondaryBtnText: {
    fontFamily: brandFonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#00BFFF",
    fontWeight: "700",
  },
  btnDisabled: {
    opacity: 0.6,
  },
  restoreBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  restoreText: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: brandColors.mutedText,
    textDecorationLine: "underline",
  },
  disclosure: {
    fontFamily: brandFonts.body,
    fontSize: 11,
    lineHeight: 16,
    color: brandColors.mutedText,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
    maxWidth: 340,
  },
  legalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  legalLink: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 13,
    color: "#00BFFF",
    textDecorationLine: "underline",
  },
  legalSep: {
    fontFamily: brandFonts.body,
    fontSize: 13,
    color: brandColors.mutedText,
  },
  backBtn: {
    marginTop: 8,
    padding: 8,
  },
  backLink: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: brandColors.alphaRed,
  },
});

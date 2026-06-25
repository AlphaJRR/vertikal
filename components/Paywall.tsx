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
import type { PurchasesPackage, PurchasesStoreProduct } from "react-native-purchases";
import { FREE_LAUNCH } from "../constants/proAccess";
import { brandColors, brandFonts } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { TOOLKIT_LESSON_COUNT } from "../data/toolkitCurriculumTypes";
import { useAvaPro, type AvaProStatus } from "../hooks/useAvaPro";
import type { PaywallPlanError } from "../lib/purchases";
import { ProLockBadge } from "./toolkit/ProLockBadge";
import { UpdateDebugLine } from "./UpdateDebugLine";

type PurchasesApi = typeof import("../lib/purchases");

async function loadPurchasesApi(): Promise<PurchasesApi> {
  return import("../lib/purchases");
}

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

const OFFERINGS_RETRY_COUNT = 2;
const OFFERINGS_RETRY_DELAY_MS = 1200;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

type PurchaseTarget =
  | { kind: "package"; pkg: PurchasesPackage }
  | { kind: "product"; product: PurchasesStoreProduct };

export function Paywall({
  contextTitle,
  subtitle = DEFAULT_SUBTITLE,
  status,
  isSignedIn,
  onBack,
}: PaywallProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { refresh } = useAvaPro();
  const [monthlyPkg, setMonthlyPkg] = useState<PurchasesPackage | null>(null);
  const [annualPkg, setAnnualPkg] = useState<PurchasesPackage | null>(null);
  const [monthlyProduct, setMonthlyProduct] =
    useState<PurchasesStoreProduct | null>(null);
  const [annualProduct, setAnnualProduct] =
    useState<PurchasesStoreProduct | null>(null);
  const [offeringsLoading, setOfferingsLoading] = useState(true);
  const [offeringsError, setOfferingsError] = useState<PaywallPlanError | null>(
    null,
  );
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  const loadOfferings = useCallback(async () => {
    setOfferingsLoading(true);
    setOfferingsError(null);
    try {
      const purchases = await loadPurchasesApi();
      await purchases.initPurchases(user?.id ?? null);

      let lastResult: Awaited<ReturnType<typeof purchases.loadPaywallPlans>> | null =
        null;

      for (let attempt = 0; attempt <= OFFERINGS_RETRY_COUNT; attempt += 1) {
        lastResult = await purchases.loadPaywallPlans();
        const hasPlans =
          lastResult.monthlyPkg ||
          lastResult.annualPkg ||
          lastResult.monthlyProduct ||
          lastResult.annualProduct;
        if (hasPlans) break;
        if (!lastResult.error) break;
        if (attempt < OFFERINGS_RETRY_COUNT) {
          await sleep(OFFERINGS_RETRY_DELAY_MS);
        }
      }

      if (!lastResult) return;

      setMonthlyPkg(lastResult.monthlyPkg);
      setAnnualPkg(lastResult.annualPkg);
      setMonthlyProduct(lastResult.monthlyProduct);
      setAnnualProduct(lastResult.annualProduct);
      setOfferingsError(lastResult.error);
    } catch (error) {
      console.error("[Paywall] loadOfferings failed:", error);
      setOfferingsError({
        code: "offerings_fetch_failed",
        message: "Could not load subscription options.",
        detail: error instanceof Error ? error.message : String(error),
      });
      setMonthlyPkg(null);
      setAnnualPkg(null);
      setMonthlyProduct(null);
      setAnnualProduct(null);
    } finally {
      setOfferingsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (FREE_LAUNCH) return;
    void loadOfferings();
  }, [loadOfferings]);

  const handlePurchase = async (target: PurchaseTarget) => {
    if (!isSignedIn) {
      router.push("/sign-in" as Href);
      return;
    }

    const purchaseId =
      target.kind === "package"
        ? target.pkg.identifier
        : target.product.identifier;
    setPurchasingId(purchaseId);
    const purchases = await loadPurchasesApi();
    try {
      await purchases.initPurchases(user?.id ?? null);
      const info =
        target.kind === "package"
          ? await purchases.purchasePackage(target.pkg)
          : await purchases.purchaseStoreProduct(target.product);
      if (purchases.hasProEntitlement(info)) {
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
      if (purchases.isUserCancelledPurchase(error)) return;
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
      const purchases = await loadPurchasesApi();
      const info = await purchases.restorePurchases();
      refresh();
      if (purchases.hasProEntitlement(info)) {
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
    monthlyPkg?.product.priceString ??
    monthlyProduct?.priceString ??
    "$9.99/month";
  const annualPrice =
    annualPkg?.product.priceString ??
    annualProduct?.priceString ??
    "$79.99/year";
  const busy = purchasingId != null || restoring;
  const annualTarget: PurchaseTarget | null = annualPkg
    ? { kind: "package", pkg: annualPkg }
    : annualProduct
      ? { kind: "product", product: annualProduct }
      : null;
  const monthlyTarget: PurchaseTarget | null = monthlyPkg
    ? { kind: "package", pkg: monthlyPkg }
    : monthlyProduct
      ? { kind: "product", product: monthlyProduct }
      : null;
  const hasPurchasablePlans = annualTarget != null || monthlyTarget != null;

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
          <Text style={styles.priceHeroLabel}>Annual plan — best value</Text>
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
            <Text style={styles.errorText}>{offeringsError.message}</Text>
            <Text style={styles.errorCode}>{offeringsError.code}</Text>
            {offeringsError.detail ? (
              <Text style={styles.errorDetail} selectable>
                {offeringsError.detail}
              </Text>
            ) : null}
            <Pressable onPress={() => void loadOfferings()} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {!offeringsLoading && isSignedIn && hasPurchasablePlans ? (
          <View style={styles.actions}>
            {annualTarget ? (
              <Pressable
                onPress={() => void handlePurchase(annualTarget)}
                disabled={busy}
                style={[styles.primaryBtn, busy && styles.btnDisabled]}
              >
                {purchasingId ===
                (annualTarget.kind === "package"
                  ? annualTarget.pkg.identifier
                  : annualTarget.product.identifier) ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.primaryBtnText}>
                    Subscribe — {annualPrice}
                  </Text>
                )}
              </Pressable>
            ) : null}

            {monthlyTarget ? (
              <Pressable
                onPress={() => void handlePurchase(monthlyTarget)}
                disabled={busy}
                style={[styles.secondaryBtn, busy && styles.btnDisabled]}
              >
                {purchasingId ===
                (monthlyTarget.kind === "package"
                  ? monthlyTarget.pkg.identifier
                  : monthlyTarget.product.identifier) ? (
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

        {!offeringsLoading && isSignedIn && !hasPurchasablePlans ? (
          <View style={styles.actions}>
            <Pressable
              onPress={() => void loadOfferings()}
              disabled={busy}
              style={[styles.primaryBtn, busy && styles.btnDisabled]}
            >
              <Text style={styles.primaryBtnText}>
                Subscribe — {annualPrice}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => void loadOfferings()}
              disabled={busy}
              style={[styles.secondaryBtn, busy && styles.btnDisabled]}
            >
              <Text style={styles.secondaryBtnText}>
                Subscribe — {monthlyPrice}
              </Text>
            </Pressable>
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

        <UpdateDebugLine />
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
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  rcPaywallBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 191, 255, 0.45)",
  },
  rcPaywallBtnText: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#00BFFF",
    fontWeight: "700",
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
    marginBottom: 4,
  },
  errorCode: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: brandColors.mutedText,
    textAlign: "center",
    marginBottom: 4,
  },
  errorDetail: {
    fontFamily: brandFonts.body,
    fontSize: 10,
    lineHeight: 14,
    color: brandColors.mutedText,
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

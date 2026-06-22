/**
 * Sign-in screen — email authentication for Alpha Creators.
 *
 * Account creation:  OTP only (6-digit code sent to email).
 * Sign-in:  password OR OTP (user's choice).
 *
 * App Review demo credentials are in App Store Connect review notes only — no in-app panel.
 */

import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import * as ExpoLinking from "expo-linking";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { brandColors, brandFonts } from "../constants/theme";
import { needsAccountConsentScreen } from "../lib/accountConsent";
import { supabase } from "../lib/supabase";
import { normalizeRedeemCode, stashRedeemCode } from "../lib/redeemDeepLink";
import { seedDemoReviewDataIfNeeded } from "../utils/demoReviewSeed";

// ── Screen states ──────────────────────────────────────────────────────────────
// "create"  → OTP create-account flow
// "signIn"  → password sign-in (default)
// "otpIn"   → OTP sign-in
type Screen = "create" | "signIn" | "otpIn";

// ─────────────────────────────────────────────────────────────────────────────

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { redirectTo, code: redirectCode } = useLocalSearchParams<{
    redirectTo?: string;
    code?: string | string[];
  }>();

  const postRedeem = redirectTo === "/redeem";
  const pendingRedeemCode = normalizeRedeemCode(redirectCode);

  const [screen, setScreen] = useState<Screen>("signIn");
  const [codeSent, setCodeSent] = useState(false);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [otp,      setOtp]      = useState("");

  const [busy,  setBusy]  = useState(false);
  const [pendingAction, setPendingAction] = useState<"send" | "verify" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info,  setInfo]  = useState<string | null>(null);

  const normalizedEmail = email.trim().toLowerCase();

  const reset = (toScreen: Screen) => {
    setScreen(toScreen);
    setCodeSent(false);
    setPassword("");
    setOtp("");
    setError(null);
    setInfo(null);
  };

  // ── Routing after a successful auth ─────────────────────────────────────────
  const finishAuth = async (isNew = false) => {
    await seedDemoReviewDataIfNeeded(normalizedEmail);

    if (pendingRedeemCode) {
      await stashRedeemCode(pendingRedeemCode);
    }

    const consentParams = postRedeem ? { redirectTo: "/redeem" } : undefined;

    if (isNew) {
      router.replace({
        pathname: "/consent",
        params: consentParams,
      } as Href);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && (isNew || (await needsAccountConsentScreen(user)))) {
        router.replace({
          pathname: "/consent",
          params: consentParams,
        } as Href);
        return;
      }
    } catch { /* non-blocking — proceed on error */ }

    if (postRedeem) {
      router.replace({
        pathname: "/redeem",
        params: pendingRedeemCode ? { code: pendingRedeemCode } : undefined,
      } as Href);
      return;
    }

    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)" as Href);
  };

  // ── Password sign-in (returning users only) ──────────────────────────────────
  const handlePasswordSignIn = async () => {
    if (!normalizedEmail) { setError("Enter your email address."); return; }
    if (!password)        { setError("Enter your password."); return; }

    setBusy(true);
    setError(null);
    try {
      const { error: e } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      if (e) {
        const msg = e.message.toLowerCase();
        if (msg.includes("invalid login") || msg.includes("credentials")) {
          setError("Email or password is incorrect.");
        } else {
          setError(e.message);
        }
        return;
      }
      await finishAuth();
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  // ── OTP: send email with BOTH a 6-digit code AND a magic link ────────────────
  // emailRedirectTo tells Supabase where to redirect after the user taps the
  // magic link. The app catches that deep link in _layout.tsx and sets the
  // session automatically — so BOTH flows (tap link OR type code) work.
  const handleSendCode = async () => {
    if (!normalizedEmail) { setError("Enter your email address."); return; }

    setBusy(true);
    setPendingAction("send");
    setError(null);
    try {
      // Always use the custom scheme on native to ensure the link opens the app
      // directly. ExpoLinking.createURL produces https:// universal links in
      // production builds which 404 if the website doesn't have that route.
      const redirectTo = Platform.OS === 'web'
        ? ExpoLinking.createURL('auth/callback')
        : 'ava://auth/callback';

      const { error: e } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectTo,
        },
      });
      if (e) { setError(e.message); return; }
      setCodeSent(true);
      setInfo(`Code sent to ${normalizedEmail}. Enter the 6-digit code below, or tap the link in the email.`);
    } catch {
      setError("Could not send code. Please try again.");
    } finally {
      setBusy(false);
      setPendingAction(null);
    }
  };

  // ── OTP: verify the 6-digit code ─────────────────────────────────────────────
  const handleVerifyCode = async () => {
    const token = otp.trim();
    if (token.length < 6) { setError("Enter the 6-digit code from your email."); return; }

    setBusy(true);
    setPendingAction("verify");
    setError(null);
    try {
      const { data, error: e } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token,
        type: "email",
      });
      if (e) {
        if (e.message.toLowerCase().includes("expired") || e.message.toLowerCase().includes("invalid")) {
          setError("Code is incorrect or expired. Tap back and request a new one.");
        } else {
          setError(e.message);
        }
        return;
      }

      // Detect whether this is a brand-new account by checking if the profile
      // has ever had tos_accepted_at set (new accounts will not have it).
      const userId = data.user?.id;
      let isNew = false;
      if (userId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("tos_accepted_at")
          .eq("id", userId)
          .maybeSingle();
        isNew = !profile?.tos_accepted_at;
      }

      await finishAuth(isNew);
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setBusy(false);
      setPendingAction(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  const isOtpFlow = screen === "create" || screen === "otpIn";

  const title = screen === "create" ? "Create account" : "Sign in";

  const subtitle =
    screen === "create"
      ? "Enter your email, tap Send code, then type the 6-digit code from your inbox."
      : screen === "otpIn"
        ? "Enter your email, tap Send code, then type the 6-digit code from your inbox."
        : "Sign in with your email and password.";

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.inner,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
          <Ionicons name="chevron-back" size={22} color={brandColors.alphaRed} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>ALPHA VISUAL ARTISTS</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {info  ? <Text style={styles.info}>{info}</Text>  : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* ── Password sign-in ─────────────────────────────────────────── */}
        {screen === "signIn" && (
          <>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@studio.com"
              placeholderTextColor={brandColors.mutedText}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              style={styles.input}
              editable={!busy}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              placeholderTextColor={brandColors.mutedText}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              style={styles.input}
              editable={!busy}
              onSubmitEditing={() => void handlePasswordSignIn()}
            />

            <Pressable
              onPress={() => void handlePasswordSignIn()}
              disabled={busy}
              style={[styles.primaryBtn, busy && styles.btnDisabled]}
            >
              {busy ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.primaryBtnText}>Sign in</Text>
              )}
            </Pressable>

            {/* Switch to create account → OTP only */}
            <Pressable
              onPress={() => reset("create")}
              disabled={busy}
              style={styles.intentToggle}
            >
              <Text style={styles.intentToggleText}>
                New here? Create a free account
              </Text>
            </Pressable>

            {/* Switch to OTP sign-in */}
            <Pressable onPress={() => reset("otpIn")} style={styles.secondaryBtn} disabled={busy}>
              <Text style={styles.secondaryBtnText}>Sign in with email code instead</Text>
            </Pressable>
          </>
        )}

        {/* ── OTP flow (create account OR OTP sign-in) — email + code on one screen ─ */}
        {isOtpFlow && (
          <>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@studio.com"
              placeholderTextColor={brandColors.mutedText}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              style={styles.input}
              editable={!busy}
              autoFocus
            />

            <Text style={styles.label}>6-digit code</Text>
            <Text style={styles.hint}>
              {codeSent
                ? `Check ${normalizedEmail || "your inbox"} for the code, or tap the sign-in link in that email.`
                : "Tap Send code first — the field below is where you type the code from your email."}
            </Text>
            <TextInput
              value={otp}
              onChangeText={t => setOtp(t.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              placeholderTextColor={brandColors.mutedText}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              maxLength={6}
              style={[styles.input, styles.otpInput]}
              editable={!busy}
            />

            <Pressable
              onPress={() => void handleSendCode()}
              disabled={busy || !normalizedEmail}
              style={[styles.primaryBtn, (busy || !normalizedEmail) && styles.btnDisabled]}
            >
              {pendingAction === "send" ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.primaryBtnText}>
                  {codeSent ? "Resend code" : screen === "create" ? "Send code to create account" : "Send code"}
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => void handleVerifyCode()}
              disabled={busy || otp.trim().length < 6}
              style={[styles.verifyBtn, (busy || otp.trim().length < 6) && styles.btnDisabled]}
            >
              {pendingAction === "verify" ? (
                <ActivityIndicator color="#00d4ff" />
              ) : (
                <Text style={styles.verifyBtnText}>
                  {screen === "create" ? "Verify & create account" : "Verify & sign in"}
                </Text>
              )}
            </Pressable>

            <Pressable onPress={() => reset("signIn")} style={styles.intentToggle} disabled={busy}>
              <Text style={styles.intentToggleText}>
                {screen === "create"
                  ? "Already have an account? Sign in with password"
                  : "Use password instead"}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  inner: {
    paddingHorizontal: 24,
    gap: 0,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 24,
  },
  backText: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 15,
    color: brandColors.alphaRed,
  },
  header: {
    marginBottom: 28,
  },
  brand: {
    color: "#00d4ff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontFamily: brandFonts.display,
    fontSize: 32,
    color: "#fff",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: brandColors.subtleText,
  },
  label: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: brandColors.mutedText,
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    fontFamily: brandFonts.body,
    fontSize: 16,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  otpInput: {
    letterSpacing: 8,
    textAlign: "center",
    fontSize: 22,
  },
  hint: {
    fontFamily: brandFonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: brandColors.mutedText,
    marginBottom: 8,
    marginTop: -8,
  },
  verifyBtn: {
    borderWidth: 1,
    borderColor: "rgba(0,212,255,0.45)",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    marginTop: 12,
  },
  verifyBtnText: {
    color: "#00d4ff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  primaryBtn: {
    backgroundColor: "#00d4ff",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    marginTop: 4,
  },
  btnDisabled: {
    opacity: 0.85,
  },
  primaryBtnText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  secondaryBtn: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: "#00d4ff",
  },
  intentToggle: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  intentToggleText: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    lineHeight: 20,
  },
  info: {
    fontFamily: brandFonts.body,
    fontSize: 13,
    color: "#00d4ff",
    marginBottom: 16,
    lineHeight: 18,
  },
  error: {
    fontFamily: brandFonts.body,
    fontSize: 13,
    color: brandColors.alphaRed,
    marginBottom: 16,
    lineHeight: 18,
  },
});

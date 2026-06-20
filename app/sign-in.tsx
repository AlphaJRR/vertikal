/**
 * Sign-in screen — email authentication for Alpha Creators.
 *
 * Account creation:  OTP only (6-digit code sent to email).
 *   — No confirmation-link email. No dependency on Supabase "Site URL".
 *   — Works correctly on first install with no Supabase URL config changes.
 *
 * Sign-in:  password OR OTP (user's choice).
 *
 * "Continue as Reviewer" button stays for the App Review demo mode (Creator Toolkit).
 * For full event-photo-delivery review, use the demo credentials panel at the bottom.
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
import { useRouter, type Href } from "expo-router";
import * as ExpoLinking from "expo-linking";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { brandColors, brandFonts } from "../constants/theme";
import { enableDemoMode } from "../lib/demoMode";
import { supabase } from "../lib/supabase";
import { seedDemoReviewDataIfNeeded } from "../utils/demoReviewSeed";

// ── Screen states ──────────────────────────────────────────────────────────────
// "create"  → OTP create-account flow (step 1: email, step 2: 6-digit code)
// "signIn"  → password sign-in (default)
// "otpIn"   → OTP sign-in (step 1: email, step 2: 6-digit code)
type Screen = "create" | "signIn" | "otpIn";
type OtpStep = "email" | "code";

const MIN_PW = 8;

// ── App Review demo accounts ───────────────────────────────────────────────────
const DEMO_ACCOUNTS = [
  {
    role:  "Operator (photographer)",
    email: "reviewer@alphavisualartists.com",
    note:  "Creates events, uploads photos, assigns galleries.",
  },
  {
    role:  "Standard user (attendee)",
    email: "reviewer.attendee@alphavisualartists.com",
    note:  "Redeem code: DEMO01 → opens pre-assigned gallery.",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [screen,  setScreen]  = useState<Screen>("signIn");
  const [otpStep, setOtpStep] = useState<OtpStep>("email");

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [otp,      setOtp]      = useState("");

  const [busy,  setBusy]  = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info,  setInfo]  = useState<string | null>(null);

  const [showDemo, setShowDemo] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();

  const reset = (toScreen: Screen) => {
    setScreen(toScreen);
    setOtpStep("email");
    setPassword("");
    setOtp("");
    setError(null);
    setInfo(null);
  };

  // ── Routing after a successful auth ─────────────────────────────────────────
  const finishAuth = async (isNew = false) => {
    await seedDemoReviewDataIfNeeded(normalizedEmail);

    if (isNew) {
      router.replace("/consent" as Href);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("tos_accepted_at")
          .eq("id", user.id)
          .maybeSingle();
        if (!profile?.tos_accepted_at) {
          router.replace("/consent" as Href);
          return;
        }
      }
    } catch { /* non-blocking — proceed on error */ }

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
      setOtpStep("code");
    } catch {
      setError("Could not send code. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  // ── OTP: verify the 6-digit code ─────────────────────────────────────────────
  const handleVerifyCode = async () => {
    const token = otp.trim();
    if (token.length < 6) { setError("Enter the 6-digit code from your email."); return; }

    setBusy(true);
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
    }
  };

  // ── Reviewer demo mode ────────────────────────────────────────────────────────
  const handleReviewerDemo = async () => {
    setBusy(true);
    setError(null);
    try {
      await enableDemoMode();
      router.replace("/(tabs)" as Href);
    } catch {
      setError("Could not start demo mode. Try again.");
    } finally {
      setBusy(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  const isOtpFlow = screen === "create" || screen === "otpIn";

  const title = screen === "create" ? "Create account" : "Sign in";

  const subtitle =
    screen === "create"
      ? otpStep === "email"
        ? "We'll email you a 6-digit code. No password needed — works instantly."
        : `Email sent to ${normalizedEmail}. Enter the 6-digit code below — or just tap the link in the email. Both work.`
      : screen === "otpIn"
        ? otpStep === "email"
          ? "We'll email you a one-time code."
          : `Code sent to ${normalizedEmail}`
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
              <Text style={styles.secondaryBtnText}>Sign in with a code instead</Text>
            </Pressable>

            {/* Reviewer demo mode */}
            <Pressable
              onPress={() => void handleReviewerDemo()}
              disabled={busy}
              style={[styles.reviewerBtn, busy && styles.btnDisabled]}
            >
              <Text style={styles.reviewerBtnText}>Continue as Reviewer</Text>
            </Pressable>
          </>
        )}

        {/* ── OTP flow (create account OR OTP sign-in) ─────────────────── */}
        {isOtpFlow && otpStep === "email" && (
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

            <Pressable
              onPress={() => void handleSendCode()}
              disabled={busy}
              style={[styles.primaryBtn, busy && styles.btnDisabled]}
            >
              {busy ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.primaryBtnText}>
                  {screen === "create" ? "Send code to create account" : "Send code"}
                </Text>
              )}
            </Pressable>

            <Pressable onPress={() => reset("signIn")} style={styles.intentToggle} disabled={busy}>
              <Text style={styles.intentToggleText}>
                {screen === "create"
                  ? "Already have an account? Sign in"
                  : "Use password instead"}
              </Text>
            </Pressable>
          </>
        )}

        {/* ── OTP: enter code ──────────────────────────────────────────── */}
        {isOtpFlow && otpStep === "code" && (
          <>
            <Text style={styles.label}>6-digit code</Text>
            <TextInput
              value={otp}
              onChangeText={t => setOtp(t.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              placeholderTextColor={brandColors.mutedText}
              keyboardType="number-pad"
              maxLength={6}
              style={[styles.input, styles.otpInput]}
              editable={!busy}
              autoFocus
            />

            <Pressable
              onPress={() => void handleVerifyCode()}
              disabled={busy}
              style={[styles.primaryBtn, busy && styles.btnDisabled]}
            >
              {busy ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.primaryBtnText}>
                  {screen === "create" ? "Verify & create account" : "Verify & sign in"}
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => { setOtpStep("email"); setOtp(""); setError(null); }}
              style={styles.secondaryBtn}
              disabled={busy}
            >
              <Text style={styles.secondaryBtnText}>Resend to a different email</Text>
            </Pressable>
          </>
        )}

        {/* ── App Review demo panel ─────────────────────────────────────── */}
        <Pressable
          onPress={() => setShowDemo(v => !v)}
          style={demoStyles.toggle}
          hitSlop={10}
        >
          <Ionicons name="information-circle-outline" size={15} color={brandColors.mutedText} />
          <Text style={demoStyles.toggleText}>App Review demo accounts</Text>
          <Ionicons
            name={showDemo ? "chevron-up" : "chevron-down"}
            size={13}
            color={brandColors.mutedText}
          />
        </Pressable>

        {showDemo && (
          <View style={demoStyles.panel}>
            <Text style={demoStyles.panelTitle}>App Review — Demo Credentials</Text>
            <Text style={demoStyles.panelSub}>
              Password for both accounts: see App Review Information in App Store Connect.
            </Text>

            {DEMO_ACCOUNTS.map(account => (
              <Pressable
                key={account.email}
                style={demoStyles.accountRow}
                onPress={() => {
                  setEmail(account.email);
                  setScreen("signIn");
                  setOtpStep("email");
                  setShowDemo(false);
                  setError(null);
                }}
                disabled={busy}
              >
                <View style={demoStyles.accountInfo}>
                  <Text style={demoStyles.accountRole}>{account.role}</Text>
                  <Text style={demoStyles.accountEmail}>{account.email}</Text>
                  <Text style={demoStyles.accountNote}>{account.note}</Text>
                </View>
                <View style={demoStyles.prefillBtn}>
                  <Text style={demoStyles.prefillBtnText}>Pre-fill</Text>
                </View>
              </Pressable>
            ))}

            <View style={demoStyles.codeRow}>
              <Ionicons name="key-outline" size={14} color="#00BFFF" />
              <Text style={demoStyles.codeText}>
                Attendee gallery code:{" "}
                <Text style={demoStyles.codeBold}>DEMO01</Text>
                {"\n"}Enter this on the "Enter my code" screen after signing in as the attendee.
              </Text>
            </View>
          </View>
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
  reviewerBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(232,0,10,0.5)",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  reviewerBtnText: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: "#E8000A",
    letterSpacing: 0.3,
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

const demoStyles = StyleSheet.create({
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 32,
    paddingVertical: 8,
    opacity: 0.55,
  },
  toggleText: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: brandColors.mutedText,
    flex: 1,
  },
  panel: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 4,
  },
  panelTitle: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 13,
    color: "#fff",
  },
  panelSub: {
    fontFamily: brandFonts.body,
    fontSize: 11,
    lineHeight: 16,
    color: brandColors.mutedText,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 8,
    padding: 12,
  },
  accountInfo: { flex: 1, gap: 2 },
  accountRole: {
    fontFamily: brandFonts.mono,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#00BFFF",
  },
  accountEmail: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 13,
    color: "#fff",
  },
  accountNote: {
    fontFamily: brandFonts.body,
    fontSize: 11,
    color: brandColors.mutedText,
    lineHeight: 15,
  },
  prefillBtn: {
    backgroundColor: "rgba(0,191,255,0.15)",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  prefillBtnText: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 0.5,
    color: "#00BFFF",
    textTransform: "uppercase",
  },
  codeRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    backgroundColor: "rgba(0,191,255,0.06)",
    borderRadius: 8,
    padding: 10,
  },
  codeText: {
    fontFamily: brandFonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: brandColors.subtleText,
    flex: 1,
  },
  codeBold: {
    fontFamily: brandFonts.mono,
    fontSize: 13,
    color: "#00BFFF",
    letterSpacing: 2,
  },
});

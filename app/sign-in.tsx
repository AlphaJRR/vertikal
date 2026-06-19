import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { brandColors, brandFonts } from "../constants/theme";
import { enableDemoMode } from "../lib/demoMode";
import { supabase } from "../lib/supabase";
import { seedDemoReviewDataIfNeeded } from "../utils/demoReviewSeed";

type AuthMode = "password" | "otp";
type OtpStep = "email" | "code";
type ScreenIntent = "signIn" | "signUp";

const MIN_PASSWORD_LENGTH = 8;

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [intent, setIntent] = useState<ScreenIntent>("signIn");
  const [mode, setMode] = useState<AuthMode>("password");
  const [otpStep, setOtpStep] = useState<OtpStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const normalizedEmail = email.trim().toLowerCase();

  const clearMessages = () => {
    setErrorMessage(null);
    setInfoMessage(null);
  };

  const switchIntent = (next: ScreenIntent) => {
    setIntent(next);
    setPassword("");
    setOtp("");
    setOtpStep("email");
    clearMessages();
  };

  const finishSignIn = async () => {
    await seedDemoReviewDataIfNeeded(normalizedEmail);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)" as Href);
    }
  };

  const signInWithPassword = async () => {
    if (!normalizedEmail) {
      setErrorMessage("Enter your email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Enter your password.");
      return;
    }

    setBusy(true);
    clearMessages();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      if (error) {
        console.error("[sign-in] signInWithPassword failed:", error);
        setErrorMessage(error.message);
        return;
      }
      await finishSignIn();
    } catch (error) {
      console.error("[sign-in] signInWithPassword failed:", error);
      setErrorMessage("Sign in failed. Check your email and password.");
    } finally {
      setBusy(false);
    }
  };

  const signUpWithPassword = async () => {
    if (!normalizedEmail) {
      setErrorMessage("Enter your email address.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(`Choose a password with at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setBusy(true);
    clearMessages();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
      });
      if (error) {
        console.error("[sign-in] signUp failed:", error);
        const msg = error.message.toLowerCase();
        if (msg.includes("already registered") || msg.includes("already exists")) {
          setErrorMessage("This email already has an account. Sign in instead.");
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      if (data.session) {
        await finishSignIn();
        return;
      }

      setInfoMessage(
        "Account created. Check your email to confirm your address, then sign in here.",
      );
      setIntent("signIn");
      setPassword("");
    } catch (error) {
      console.error("[sign-in] signUp failed:", error);
      setErrorMessage("Could not create account. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const sendCode = async () => {
    if (!normalizedEmail) {
      setErrorMessage("Enter your email address.");
      return;
    }
    setBusy(true);
    clearMessages();
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: { shouldCreateUser: true },
      });
      if (error) {
        console.error("[sign-in] signInWithOtp failed:", error);
        setErrorMessage(error.message);
        return;
      }
      setOtpStep("code");
    } catch (error) {
      console.error("[sign-in] sendCode failed:", error);
      setErrorMessage("Could not send code. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async () => {
    const token = otp.trim();
    if (token.length < 6) {
      setErrorMessage("Enter the 6-digit code from your email.");
      return;
    }
    setBusy(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token,
        type: "email",
      });
      if (error) {
        console.error("[sign-in] verifyOtp failed:", error);
        setErrorMessage(error.message);
        return;
      }
      await finishSignIn();
    } catch (error) {
      console.error("[sign-in] verifyCode failed:", error);
      setErrorMessage("Verification failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const switchToPassword = () => {
    setMode("password");
    setOtpStep("email");
    setOtp("");
    clearMessages();
  };

  const switchToOtp = () => {
    setMode("otp");
    setOtpStep("email");
    setPassword("");
    clearMessages();
  };

  const startAppReviewDemo = async () => {
    setBusy(true);
    setErrorMessage(null);
    try {
      await enableDemoMode();
      router.replace("/(tabs)" as Href);
    } catch (error) {
      console.error("[sign-in] startAppReviewDemo failed:", error);
      setErrorMessage("Could not start demo mode. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const subtitle =
    intent === "signUp"
      ? mode === "password"
        ? "Create a free account with email and password. No payment required."
        : otpStep === "email"
          ? "New or returning — we'll email you a code and create your account if you're new."
          : `Code sent to ${normalizedEmail}`
      : mode === "password"
        ? "Sign in with your email and password."
        : otpStep === "email"
          ? "We will email you a one-time code."
          : `Code sent to ${normalizedEmail}`;

  const screenTitle = intent === "signUp" ? "Create account" : "Sign in";
  const primaryPasswordAction =
    intent === "signUp" ? signUpWithPassword : signInWithPassword;
  const primaryPasswordLabel =
    intent === "signUp" ? "Create account" : "Sign in";

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
        <Ionicons name="chevron-back" size={22} color={brandColors.alphaRed} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.brand}>ALPHA VISUAL ARTISTS</Text>
        <Text style={styles.title}>{screenTitle}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {infoMessage ? <Text style={styles.info}>{infoMessage}</Text> : null}

      {mode === "password" ? (
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
            placeholder={
              intent === "signUp"
                ? `At least ${MIN_PASSWORD_LENGTH} characters`
                : "Your password"
            }
            placeholderTextColor={brandColors.mutedText}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType={intent === "signUp" ? "newPassword" : "password"}
            style={styles.input}
            editable={!busy}
            onSubmitEditing={() => void primaryPasswordAction()}
          />
          <Pressable
            onPress={() => void primaryPasswordAction()}
            disabled={busy}
            style={[styles.primaryBtn, busy && styles.btnDisabled]}
          >
            {busy ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.primaryBtnText}>{primaryPasswordLabel}</Text>
            )}
          </Pressable>
          <Pressable
            onPress={() => switchIntent(intent === "signUp" ? "signIn" : "signUp")}
            disabled={busy}
            style={styles.intentToggle}
          >
            <Text style={styles.intentToggleText}>
              {intent === "signUp"
                ? "Already have an account? Sign in"
                : "New here? Create a free account"}
            </Text>
          </Pressable>
          {intent === "signIn" ? (
            <Pressable
              onPress={() => void startAppReviewDemo()}
              disabled={busy}
              style={[styles.reviewerBtn, busy && styles.btnDisabled]}
            >
              <Text style={styles.reviewerBtnText}>Continue as Reviewer</Text>
            </Pressable>
          ) : null}
          <Pressable onPress={switchToOtp} style={styles.secondaryBtn} disabled={busy}>
            <Text style={styles.secondaryBtnText}>
              {intent === "signUp" ? "Use email code to sign up" : "Use email code instead"}
            </Text>
          </Pressable>
        </>
      ) : otpStep === "email" ? (
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
          <Pressable
            onPress={() => void sendCode()}
            disabled={busy}
            style={[styles.primaryBtn, busy && styles.btnDisabled]}
          >
            {busy ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.primaryBtnText}>Send code</Text>
            )}
          </Pressable>
          <Pressable onPress={switchToPassword} style={styles.secondaryBtn} disabled={busy}>
            <Text style={styles.secondaryBtnText}>Use password instead</Text>
          </Pressable>
          <Pressable
            onPress={() => switchIntent(intent === "signUp" ? "signIn" : "signUp")}
            disabled={busy}
            style={styles.intentToggle}
          >
            <Text style={styles.intentToggleText}>
              {intent === "signUp"
                ? "Already have an account? Sign in"
                : "New here? Create a free account"}
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.label}>6-digit code</Text>
          <TextInput
            value={otp}
            onChangeText={(t) => setOtp(t.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            placeholderTextColor={brandColors.mutedText}
            keyboardType="number-pad"
            maxLength={6}
            style={[styles.input, styles.otpInput]}
            editable={!busy}
          />
          <Pressable
            onPress={() => void verifyCode()}
            disabled={busy}
            style={[styles.primaryBtn, busy && styles.btnDisabled]}
          >
            {busy ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.primaryBtnText}>Verify & sign in</Text>
            )}
          </Pressable>
          <Pressable
            onPress={() => {
              setOtpStep("email");
              setOtp("");
              clearMessages();
            }}
            style={styles.secondaryBtn}
            disabled={busy}
          >
            <Text style={styles.secondaryBtnText}>Use a different email</Text>
          </Pressable>
          <Pressable onPress={switchToPassword} style={styles.secondaryBtn} disabled={busy}>
            <Text style={styles.secondaryBtnText}>Use password instead</Text>
          </Pressable>
        </>
      )}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingHorizontal: 24,
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
    opacity: 1,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
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
    opacity: 1,
  },
  secondaryBtnText: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: "#00d4ff",
  },
  reviewerBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(232,0,10,0.5)",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    opacity: 1,
  },
  reviewerBtnText: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: "#E8000A",
    letterSpacing: 0.3,
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
    marginTop: 16,
    lineHeight: 18,
  },
});

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
import { supabase } from "../lib/supabase";
import { seedDemoReviewDataIfNeeded } from "../utils/demoReviewSeed";

type AuthMode = "password" | "otp";
type OtpStep = "email" | "code";

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<AuthMode>("password");
  const [otpStep, setOtpStep] = useState<OtpStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const normalizedEmail = email.trim().toLowerCase();

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
    setErrorMessage(null);
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

  const sendCode = async () => {
    if (!normalizedEmail) {
      setErrorMessage("Enter your email address.");
      return;
    }
    setBusy(true);
    setErrorMessage(null);
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
    setErrorMessage(null);
  };

  const switchToOtp = () => {
    setMode("otp");
    setOtpStep("email");
    setPassword("");
    setErrorMessage(null);
  };

  const subtitle =
    mode === "password"
      ? "Sign in with your email and password."
      : otpStep === "email"
        ? "We will email you a one-time code."
        : `Code sent to ${normalizedEmail}`;

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
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

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
            placeholder="Your password"
            placeholderTextColor={brandColors.mutedText}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            style={styles.input}
            editable={!busy}
            onSubmitEditing={() => void signInWithPassword()}
          />
          <Pressable
            onPress={() => void signInWithPassword()}
            disabled={busy}
            style={[styles.primaryBtn, busy && styles.btnDisabled]}
          >
            {busy ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.primaryBtnText}>Sign in</Text>
            )}
          </Pressable>
          <Pressable onPress={switchToOtp} style={styles.secondaryBtn} disabled={busy}>
            <Text style={styles.secondaryBtnText}>Use email code instead</Text>
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
              setErrorMessage(null);
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
  error: {
    fontFamily: brandFonts.body,
    fontSize: 13,
    color: brandColors.alphaRed,
    marginTop: 16,
    lineHeight: 18,
  },
});

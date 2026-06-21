import React from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../hooks/useProjects";

// TODO: Google + SIWA require native build — implement in next version
// Needs: expo-apple-authentication, @react-native-google-signin/google-signin
// JR to enable Apple Sign-In capability in Xcode + create Google OAuth client

const FREE_LAUNCH = true;

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#060606",
  card: "#141414",
  cell: "#171717",
  hairline: "rgba(255,255,255,0.07)",
  text: "#fff",
  muted: "rgba(255,255,255,0.5)",
  dim: "rgba(255,255,255,0.32)",
  accent: "#E8000A",
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts[0].length > 0) return parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "??";
}

function formatSyncStatus(status: string, lastSyncedAt: Date | null): string {
  if (status === "not_signed_in") return "Sign in to sync";
  if (status === "syncing") return "Syncing…";
  if (status === "offline") return "Offline";
  if (lastSyncedAt) {
    const diff = Date.now() - lastSyncedAt.getTime();
    if (diff < 60_000) return "Synced just now";
    const mins = Math.floor(diff / 60_000);
    return `Synced ${mins}m ago`;
  }
  return "Synced";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ label }: { label: string }) {
  return (
    <Text style={s.sectionTitle}>{label}</Text>
  );
}

function Pill({ label, dim }: { label: string; dim?: boolean }) {
  return (
    <View style={[s.pill, dim && s.pillDim]}>
      <Text style={[s.pillText, dim && s.pillTextDim]}>{label}</Text>
    </View>
  );
}

interface RowProps {
  label: string;
  labelStyle?: object;
  onPress?: () => void;
  right?: React.ReactNode;
  showChevron?: boolean;
  showHairline?: boolean;
}

function Row({ label, labelStyle, onPress, right, showChevron = true, showHairline = true }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.row, pressed && s.rowPressed]}
      accessible={Boolean(onPress)}
    >
      {showHairline && <View style={s.hairline} />}
      <Text style={[s.rowLabel, labelStyle]}>{label}</Text>
      <View style={s.rowRight}>
        {right}
        {showChevron && onPress && (
          <Ionicons name="chevron-forward" size={16} color={C.dim} />
        )}
      </View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { projects, syncStatus, lastSyncedAt } = useProjects();

  const displayName = user?.user_metadata?.full_name as string | undefined;
  const email = user?.email ?? null;
  const initials = getInitials(displayName, email);
  const syncLabel = formatSyncStatus(syncStatus, lastSyncedAt);

  const openUrl = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("[MoreScreen] openUrl failed:", err),
    );
  };

  const restorePurchases = () => {
    if (Platform.OS === "ios") {
      // Stub — requires native IAP module (expo-in-app-purchases or RevenueCat)
      console.log("[MoreScreen] restorePurchases: native IAP not yet installed");
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <ScrollView
        style={[s.root, { paddingTop: insets.top }]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.pageTitle}>MORE</Text>

        {/* ── ACCOUNT ────────────────────────────────────────────────── */}
        <SectionTitle label="ACCOUNT" />
        <View style={s.card}>
          <Pressable
            onPress={() => router.push("/sign-in")}
            style={s.accountRow}
          >
            {/* Avatar with spectrum ring */}
            <View style={s.avatarRing}>
              <View style={s.avatarInner}>
                <Text style={s.avatarInitials}>{initials}</Text>
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.accountName} numberOfLines={1}>
                {displayName ?? "AVA Member"}
              </Text>
              <Text style={s.accountEmail} numberOfLines={1}>
                {email ?? "Sign in to your account"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.dim} />
          </Pressable>
        </View>

        {/* ── PLAN (hidden during free launch / App Review) ─────────── */}
        {!FREE_LAUNCH ? (
          <>
            <SectionTitle label="PLAN" />
            <View style={s.card}>
              <Row
                label="Current Plan"
                right={<Pill label="FREE" />}
                showChevron={false}
                showHairline={false}
              />
              <Row
                label="AVA Pro"
                right={<Pill label="Subscribe in app" />}
                showChevron={false}
              />
              <Row
                label="Restore Purchases"
                onPress={restorePurchases}
              />
            </View>
          </>
        ) : null}

        {/* ── PROJECTS & SYNC ────────────────────────────────────────── */}
        <SectionTitle label="PROJECTS & SYNC" />
        <View style={s.card}>
          <Row
            label="Your Projects"
            right={
              <Text style={s.countBadge}>{projects.length}</Text>
            }
            onPress={() => router.push("/projects" as Href)}
            showHairline={false}
          />
          <Row
            label="Cloud Sync"
            right={
              <Text style={s.mutedValue}>{syncLabel}</Text>
            }
            showChevron={false}
          />
          <Row
            label="Connected Account"
            right={
              <Text style={s.mutedValue}>Email</Text>
            }
            showChevron={false}
          />
          {/* TODO: Google + SIWA require native build — implement in next version */}
        </View>

        {/* ── CREATORS ───────────────────────────────────────────────── */}
        <SectionTitle label="CREATORS" />
        <View style={s.card}>
          <Row
            label="How To"
            onPress={() => router.push("/how-to" as Href)}
            showHairline={false}
          />
          <Row
            label="Tutorial"
            right={<Pill label="Videos soon" dim />}
            onPress={() => router.push("/tutorial" as Href)}
          />
          <Row
            label="Instagram"
            onPress={() => openUrl("https://www.instagram.com/alphavisualartists")}
          />
        </View>

        {/* ── SUPPORT ────────────────────────────────────────────────── */}
        <SectionTitle label="SUPPORT" />
        <View style={s.card}>
          <Row
            label="FAQ"
            onPress={() => router.push("/faq" as Href)}
            showHairline={false}
          />
          <Row
            label="Settings"
            onPress={() => router.push("/settings")}
          />
          <Row
            label="Privacy Policy"
            onPress={() => openUrl("https://alphavisualartists.com/privacy")}
          />
          <Row
            label="Delete Account"
            labelStyle={{ color: C.accent }}
            onPress={() => router.push("/settings")}
          />
        </View>
      </ScrollView>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  pageTitle: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 36,
    color: C.text,
    textAlign: "center",
    letterSpacing: 4,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: "DMMono_400Regular",
    fontSize: 10,
    color: C.dim,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 28,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: C.card,
    borderRadius: 16,
    overflow: "hidden",
  },

  // Account row
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    padding: 2,
    // Spectrum gradient border approximated with a solid accent color
    borderWidth: 2,
    borderColor: "#E8000A",
  },
  avatarInner: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 20,
    color: C.text,
    letterSpacing: 1,
  },
  accountName: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 15,
    color: C.text,
    marginBottom: 2,
  },
  accountEmail: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 12,
    color: C.muted,
  },

  // Generic rows
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.cell,
    paddingHorizontal: 16,
    paddingVertical: 15,
    minHeight: 52,
  },
  rowPressed: {
    opacity: 0.65,
  },
  hairline: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.hairline,
  },
  rowLabel: {
    flex: 1,
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 15,
    color: C.text,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  // Pill
  pill: {
    backgroundColor: "#222",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillDim: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  pillText: {
    fontFamily: "DMMono_400Regular",
    fontSize: 10,
    color: C.text,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  pillTextDim: {
    color: C.muted,
  },

  // Misc
  countBadge: {
    fontFamily: "DMMono_400Regular",
    fontSize: 13,
    color: C.muted,
    marginRight: 2,
  },
  mutedValue: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 13,
    color: C.muted,
  },
});

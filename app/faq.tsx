import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const C = {
  bg: "#060606",
  card: "#141414",
  hairline: "rgba(255,255,255,0.07)",
  text: "#fff",
  muted: "rgba(255,255,255,0.5)",
  dim: "rgba(255,255,255,0.32)",
  accent: "#E8000A",
} as const;

// ─── FAQ content (JR fills or updates) ───────────────────────────────────────
const FAQS: { q: string; a: string }[] = [
  {
    q: "What is Alpha Visual Artists (AVA)?",
    a:
      "Alpha Visual Artists is a Chicago-based cinematic production company. " +
      "The AVA app is your mobile toolkit — shoot checklists, rate calculators, " +
      "event photo delivery, and more, all in one place.",
  },
  {
    q: "How do I use the Events feature?",
    a:
      "The Events tab lets operators manage photo delivery for live events. " +
      "Create an event, upload photos, and share a redeem code with attendees. " +
      "Attendees scan or enter their code to access their personal gallery.",
  },
  {
    q: "Is my data backed up?",
    a:
      "Yes — when you're signed in, your projects and checklists sync to the cloud via Supabase. " +
      "You can access them on any device. Sign in with your email from the Home tab.",
  },
  {
    q: "How do I delete my account?",
    a:
      "Go to More → Settings → Delete Account. " +
      "This permanently removes your account and all associated data. " +
      "This action cannot be undone.",
  },
];

function AccordionItem({
  q,
  a,
  index,
}: {
  q: string;
  a: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };

  return (
    <View style={[s.item, index > 0 && s.itemBorder]}>
      <Pressable
        style={({ pressed }) => [s.itemHeader, pressed && { opacity: 0.7 }]}
        onPress={toggle}
      >
        <Text style={s.question}>{q}</Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color={C.dim}
        />
      </Pressable>
      {open && <Text style={s.answer}>{a}</Text>}
    </View>
  );
}

export default function FaqScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="light" />
      <ScrollView
        style={[s.root, { paddingTop: insets.top }]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </Pressable>
          <Text style={s.title}>FAQ</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={s.card}>
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} index={i} q={faq.q} a={faq.a} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 30,
    color: C.text,
    letterSpacing: 3,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: C.card,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.hairline,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  itemBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.hairline,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  question: {
    flex: 1,
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 14,
    color: C.text,
    lineHeight: 20,
  },
  answer: {
    marginTop: 10,
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 13,
    color: C.muted,
    lineHeight: 21,
  },
});

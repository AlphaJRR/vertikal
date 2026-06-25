import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import { useFocusEffect, useRouter, type Href } from "expo-router";
import { SectionErrorBoundary } from "../../components/SectionErrorBoundary";
import { BioSlideshow } from "../../components/home/BioSlideshow";
import { JRInterviewVideos } from "../../components/home/JRInterviewVideos";
import { MamaConnieVideo } from "../../components/home/MamaConnieVideo";
import { ReelVideoCover } from "../../components/ReelVideoCover";
import { VideoModal } from "../../components/VideoModal";
import { ProductionTipsList } from "../../components/toolkit/ProductionTipsList";
import { featuredTips } from "../../data/toolkitContent";
import { HomePaywallModal } from "../../components/HomePaywallModal";
import { HOME_PAYWALL_DELAY_MS } from "../../constants/paywall";
import { useAuth } from "../../contexts/AuthContext";
import { useAvaPro } from "../../hooks/useAvaPro";
import { exitDemoMode, useDemoMode } from "../../lib/demoMode";
import { FREE_LAUNCH } from "../../constants/proAccess";
import {
  isHomePaywallInCooldown,
  markHomePaywallDismissed,
  markHomePaywallShownThisSession,
  wasHomePaywallShownThisSession,
} from "../../utils/homePaywallPrefs";

const SITE_URL = "https://alphavisualartists.com";

type Reel = {
  id: string;
  title: string;
  tag: string;
  cover: ImageSourcePropType;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  video?: any;
};

const CLOUDFLARE_STREAM_CUSTOMER = "customer-fyh68ijrcuys7ag8.cloudflarestream.com";
const cloudflareHls = (uid: string) => ({
  uri: `https://${CLOUDFLARE_STREAM_CUSTOMER}/${uid}/manifest/video.m3u8`,
});

type Photo = {
  id: string;
  src: ImageSourcePropType;
  caption: string;
};

/**
 * Featured Cloudflare reels — UID must match clip content (verified device Jun 2026).
 */
const FEATURED_REELS: Reel[] = [
  {
    // Featured Reel #3 — Argueably The Best 'Burgers' (UID 9d3d0efe; joshuaArgueVideoSeed + alphavisualartists.com)
    id: "cf-9d3d0efed36b71e5f75c7b5e218809d7",
    title: "Argueably The Best 'Burgers'",
    tag: "Joshua Argue · Featured",
    cover: require("../../assets/images/director-monitor.jpg"),
    url: `${SITE_URL}/work`,
    video: cloudflareHls("9d3d0efed36b71e5f75c7b5e218809d7"),
  },
  {
    // DHC Live Featuring Kirk Franklin — UID 29424a48 (was wrongly on Winter Nights slot)
    id: "cf-29424a48ea60434f3feb6e6cfd12fff4",
    title: "DHC Live Featuring Kirk Franklin",
    tag: "Featured · Live",
    cover: require("../../assets/images/creator-court.jpg"),
    url: `${SITE_URL}/work`,
    video: cloudflareHls("29424a48ea60434f3feb6e6cfd12fff4"),
  },
  {
    // CCHS Ground Breaking Ceremony — UID c861d85f (was wrongly on DHC slot)
    id: "cf-c861d85f92202939bb33ebb87bb3a089",
    title: "CCHS Ground Breaking Ceremony",
    tag: "Featured · Ceremony",
    cover: require("../../assets/images/portrait-dada.jpg"),
    url: `${SITE_URL}/work`,
    video: cloudflareHls("c861d85f92202939bb33ebb87bb3a089"),
  },
  {
    // Cadance Apartments & Condominiums — UID 793c5fad (was wrongly on CCHS slot)
    id: "cf-793c5fad3fa152369bdaacf731049663",
    title: "Cadance Apartments & Condominiums",
    tag: "Featured · Real Estate",
    cover: require("../../assets/images/peace-suit.jpg"),
    url: `${SITE_URL}/work`,
    video: cloudflareHls("793c5fad3fa152369bdaacf731049663"),
  },
  {
    // Winter Nights Chicago Lights — UID 25d31f0e (was wrongly on Cadance slot)
    id: "cf-25d31f0e020a4759d7e1c2fa0d1945d3",
    title: "Winter Nights Chicago Lights",
    tag: "Featured · Chicago",
    cover: require("../../assets/images/kids-plaid.jpg"),
    url: `${SITE_URL}/work`,
    video: cloudflareHls("25d31f0e020a4759d7e1c2fa0d1945d3"),
  },
];

const PHOTO_REELS: Reel[] = [
  {
    id: "r1",
    title: "Dwyane Wade",
    tag: "Waymaker Chicago",
    cover: require("../../assets/images/event-wade.jpg"),
    url: `${SITE_URL}/work`,
  },
  {
    id: "r2",
    title: "Nick Cannon",
    tag: "Waymaker Chicago",
    cover: require("../../assets/images/event-cannon.jpg"),
    url: `${SITE_URL}/work`,
  },
  {
    id: "r3",
    title: "Louis Carr",
    tag: "Waymaker Chicago",
    cover: require("../../assets/images/event-jayellis.jpg"),
    url: `${SITE_URL}/work`,
  },
  {
    id: "rdrose",
    title: "Derrick Rose",
    tag: "Waymaker Kid's Summit",
    cover: require("../../assets/images/event-drose.jpg"),
    url: `${SITE_URL}/work`,
  },
  {
    id: "rkids",
    title: "Cozy Plaid — Kids Editorial",
    tag: "Editorial · Family",
    cover: require("../../assets/images/kids-plaid.jpg"),
    url: `${SITE_URL}/work`,
  },
  {
    id: "r4",
    title: "Live From The Stage",
    tag: "Music · Performance",
    cover: require("../../assets/images/live-singer.jpg"),
    url: `${SITE_URL}/work`,
  },
  {
    id: "rconcert1",
    title: "Festival Headliner",
    tag: "Concert · Live",
    cover: require("../../assets/images/stage-performer.jpg"),
    url: `${SITE_URL}/work`,
  },
  {
    id: "rconcert2",
    title: "Red Lights, Big Stage",
    tag: "Concert · Live",
    cover: require("../../assets/images/red-stage-mic.jpg"),
    url: `${SITE_URL}/work`,
  },
  {
    id: "rlegends",
    title: "Rap Legends",
    tag: "Music · Tour",
    cover: require("../../assets/images/rap-legends.jpg"),
    url: `${SITE_URL}/work`,
  },
  {
    id: "r5",
    title: "Lakefront Engagement",
    tag: "Couples · Chicago",
    cover: require("../../assets/images/couple-skyline.jpg"),
    url: `${SITE_URL}/work`,
  },
  {
    id: "r6",
    title: "Garden Editorial",
    tag: "B&W · Lookbook",
    cover: require("../../assets/images/editorial-flowers.jpg"),
    url: `${SITE_URL}/work`,
  },
  {
    id: "r7",
    title: "Red Room Series",
    tag: "Studio · Portrait",
    cover: require("../../assets/images/portrait-dada.jpg"),
    url: `${SITE_URL}/work`,
  },
  {
    id: "r8",
    title: "Peace & Tailoring",
    tag: "Editorial · Studio",
    cover: require("../../assets/images/peace-suit.jpg"),
    url: `${SITE_URL}/work`,
  },
  {
    id: "r9",
    title: "Nail Tech Campaign",
    tag: "Beauty · Brand",
    cover: require("../../assets/images/nail-tech.jpg"),
    url: `${SITE_URL}/work`,
  },
];

const PHOTOS: Photo[] = [
  { id: "p1", src: require("../../assets/images/cinema-cam.jpg"), caption: "Cinema package" },
  { id: "p2", src: require("../../assets/images/director-monitor.jpg"), caption: "Director's eye" },
  { id: "p3", src: require("../../assets/images/clapper.jpg"), caption: "Roll sound" },
  { id: "p4", src: require("../../assets/images/lens-lineup.jpg"), caption: "Glass selection" },
  { id: "p5", src: require("../../assets/images/creator-court.jpg"), caption: "On location" },
  { id: "p6", src: require("../../assets/images/dzo-lenses.jpg"), caption: "Prime time" },
  { id: "p7", src: require("../../assets/images/marriage-clapper.jpg"), caption: "Action!" },
  { id: "p8", src: require("../../assets/images/chicago-sunset.jpg"), caption: "Chicago golden hour" },
  { id: "p9", src: require("../../assets/images/chicago-highway.jpg"), caption: "Sears tower commute" },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { isPro, refresh } = useAvaPro();
  const isDemoMode = useDemoMode();
  const isSignedIn = Boolean(user);
  const userEmail = user?.email ?? null;
  const [homePaywallVisible, setHomePaywallVisible] = useState(false);
  const paywallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const schedulePaywall = async () => {
        if (isPro || isDemoMode || wasHomePaywallShownThisSession()) return;
        if (await isHomePaywallInCooldown()) return;

        paywallTimerRef.current = setTimeout(() => {
          if (cancelled || isPro || wasHomePaywallShownThisSession()) return;
          markHomePaywallShownThisSession();
          setHomePaywallVisible(true);
        }, HOME_PAYWALL_DELAY_MS);
      };

      void schedulePaywall();

      return () => {
        cancelled = true;
        if (paywallTimerRef.current) {
          clearTimeout(paywallTimerRef.current);
          paywallTimerRef.current = null;
        }
      };
    }, [isPro, isDemoMode]),
  );

  const dismissHomePaywall = () => {
    setHomePaywallVisible(false);
    void markHomePaywallDismissed();
  };

  const handleExitDemoMode = () => {
    exitDemoMode().catch((error) => {
      console.error("[HomeScreen] exitDemoMode failed:", error);
    });
  };

  const handleSignOut = () => {
    const tasks: Promise<void>[] = [signOut()];
    if (isDemoMode) {
      tasks.push(exitDemoMode());
    }
    Promise.all(tasks).catch((error) => {
      console.error("[HomeScreen] signOut failed:", error);
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeVideo, setActiveVideo] = useState<any | null>(null);

  // NEW: Track which reel IDs are currently visible
  const [visibleReelIds, setVisibleReelIds] = useState<Set<string>>(new Set());

  const open = (url: string) => {
    Haptics.selectionAsync().catch(() => {});
    WebBrowser.openBrowserAsync(url, {
      toolbarColor: "#0a0a0a",
      controlsColor: "#00d4ff",
    }).catch(() => {});
  };

  const handleReel = (r: Reel) => {
    Haptics.selectionAsync().catch(() => {});
    if (r.video) {
      setActiveVideo(r.video);
    } else {
      open(r.url);
    }
  };

  // NEW: Callback for FlatList viewability changes
  const handleViewableItemsChanged = (info: { viewableItems: ViewToken[] }) => {
    const visibleIds = new Set(
      info.viewableItems.map((item) => item.key as string)
    );
    setVisibleReelIds(visibleIds);
  };

  // Reel card component (extracted for clarity)
  const renderReelCard = ({ item: r }: { item: Reel }) => (
    <Pressable
      onPress={() => handleReel(r)}
      style={styles.reelCard}
      key={r.id}
    >
      {r.video ? (
        <>
          <ReelVideoCover
            source={r.video}
            isVisible={visibleReelIds.has(r.id)} // NEW: gate playback
          />
          <View style={styles.reelOverlay}>
            <View style={[styles.playBadge, styles.playBadgeVideo]}>
              <Ionicons name="play" size={24} color="#00d4ff" />
            </View>
          </View>
          <View style={styles.videoBadge}>
            <Text style={styles.videoBadgeTxt}>VIDEO</Text>
          </View>
        </>
      ) : (
        <>
          <Image source={r.cover} style={styles.reelCover} />
          <View style={styles.reelOverlay}>
            <View style={styles.playBadge}>
              <Ionicons name="arrow-forward" size={24} color="#000" />
            </View>
          </View>
        </>
      )}
      <View style={styles.reelMeta}>
        <Text style={styles.reelTag}>{r.tag}</Text>
        <Text style={styles.reelTitle}>{r.title}</Text>
      </View>
    </Pressable>
  );

  return (
    <>
      <StatusBar style="light" />
      <ScrollView
        style={styles.root}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {isDemoMode ? (
          <View style={styles.demoBanner}>
            <Text style={styles.demoBannerText}>
              Reviewer mode — all features unlocked. Exit reviewer mode to see
              subscription options.
            </Text>
            <Pressable onPress={handleExitDemoMode} style={styles.demoExitBtn}>
              <Text style={styles.demoExitBtnText}>Exit Reviewer Mode</Text>
            </Pressable>
          </View>
        ) : null}

        {/* HERO */}
        <View style={[styles.hero, { paddingTop: 12 }]}>
          <Text style={styles.brand}>ALPHA VISUAL ARTISTS</Text>
          <Text style={styles.tag}>Chicago · Cinematic · Stop The Scroll</Text>
          {isSignedIn && userEmail ? (
            <Text style={styles.signedInEmail} numberOfLines={1}>
              Signed in · {userEmail}
            </Text>
          ) : null}

          <View style={styles.heroBtnRow}>
            {isSignedIn ? (
              <Pressable onPress={handleSignOut} style={styles.secondaryBtn}>
                <Ionicons name="log-out-outline" size={16} color="#00d4ff" />
                <Text style={styles.secondaryBtnTxt}>Sign out</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => router.push("/sign-in" as Href)}
                style={styles.primaryBtn}
              >
                <Ionicons name="log-in-outline" size={16} color="#000" />
                <Text style={styles.primaryBtnTxt}>Sign in / Join</Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => open(SITE_URL)}
              style={styles.secondaryBtn}
            >
              <Text style={styles.secondaryBtnTxt}>Visit Site</Text>
              <Ionicons name="arrow-forward" size={14} color="#00d4ff" />
            </Pressable>
          </View>
        </View>

        <SectionErrorBoundary name="Mama Connie">
          <SectionHeader eyebrow="Featured Film" title="Mama Connie" />
          <MamaConnieVideo />
        </SectionErrorBoundary>

        <SectionErrorBoundary name="Bio">
          <SectionHeader eyebrow="About JR" title="Bio" />
          <BioSlideshow />
        </SectionErrorBoundary>

        <SectionErrorBoundary name="JR Interviews">
          <JRInterviewVideos />
        </SectionErrorBoundary>

        <SectionErrorBoundary name="Recent Work">
          <SectionHeader
            eyebrow="Latest"
            title="Recent Work"
            action="See All"
            onAction={() => open(`${SITE_URL}/work`)}
          />
          <FlatList
            data={FEATURED_REELS}
            horizontal
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.reelRow}
            renderItem={renderReelCard}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
            }}
            scrollEventThrottle={16}
            decelerationRate="fast"
          />
          <FlatList
            data={PHOTO_REELS}
            horizontal
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.reelRow, styles.photoReelRow]}
            renderItem={renderReelCard}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
            }}
            scrollEventThrottle={16}
            decelerationRate="fast"
          />
        </SectionErrorBoundary>

        <SectionErrorBoundary name="Behind The Lens">
          <SectionHeader eyebrow="Craft" title="Behind The Lens" />
          <View style={styles.grid}>
            {PHOTOS.map((p) => (
              <View key={p.id} style={styles.gridItem}>
                <Image source={p.src} style={styles.gridImg} />
                <View style={styles.gridGradient} />
                <Text style={styles.gridCaption}>{p.caption}</Text>
              </View>
            ))}
          </View>
        </SectionErrorBoundary>

        <SectionErrorBoundary name="Production Tips">
          <SectionHeader eyebrow="Knowledge" title="Production Tips" />
          <ProductionTipsList
            tips={featuredTips}
            styles={styles}
            onTipPress={(tip) => {
              Haptics.selectionAsync().catch(() => {});
              router.push(`/slide/${tip.slideId}` as Href);
            }}
          />
        </SectionErrorBoundary>

        {/* FOOTER CTA */}
        <View style={styles.footerCta}>
          <Text style={styles.footerEyebrow}>Ready To Create</Text>
          <Text style={styles.footerH}>Let's Make Magic</Text>
          <Pressable
            onPress={() => open(`${SITE_URL}/contact`)}
            style={styles.bigBtn}
          >
            <Text style={styles.bigBtnTxt}>Get In Touch</Text>
            <Ionicons name="arrow-forward" size={16} color="#000" />
          </Pressable>
        </View>
      </ScrollView>

      <VideoModal
        source={activeVideo}
        onClose={() => setActiveVideo(null)}
      />

      <HomePaywallModal
        visible={homePaywallVisible}
        isSignedIn={isSignedIn}
        onDismiss={dismissHomePaywall}
        onActivated={refresh}
      />
    </>
  );
}

function SectionHeader({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow: string;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHead}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action && (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={styles.sectionAction}>{action} →</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },

  demoBanner: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,212,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(0,212,255,0.35)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  demoBannerText: {
    flex: 1,
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  demoExitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(232,0,10,0.5)",
  },
  demoExitBtnText: {
    color: "#E8000A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // HERO
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  brand: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 3,
    textAlign: "center",
  },
  tag: {
    color: "#00d4ff",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 6,
    marginBottom: 20,
  },
  signedInEmail: {
    color: "#888888",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
  heroBtnRow: { flexDirection: "row", gap: 10 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#00d4ff",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  primaryBtnTxt: {
    color: "#000",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0,212,255,0.4)",
  },
  secondaryBtnTxt: {
    color: "#00d4ff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // SECTION HEADERS
  sectionHead: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 14,
  },
  sectionEyebrow: {
    color: "#00d4ff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  sectionAction: {
    color: "#00d4ff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // REELS
  reelRow: { paddingHorizontal: 20, gap: 12 },
  photoReelRow: { paddingTop: 4, paddingBottom: 4 },
  reelCard: {
    width: 220,
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  reelCover: { width: "100%", height: 280, backgroundColor: "#111" },
  reelOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    height: 280,
  },
  playBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#00d4ff",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 4,
    shadowColor: "#00d4ff",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  playBadgeVideo: {
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 2,
    borderColor: "#00d4ff",
  },
  videoBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#00d4ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoBadgeTxt: {
    color: "#000",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  reelMeta: { padding: 12 },

  reelTag: {
    color: "#00d4ff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  reelTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },

  // GRID
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
  },
  gridItem: {
    width: "48.5%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  gridImg: { width: "100%", height: "100%" },
  gridGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  gridCaption: {
    position: "absolute",
    left: 10,
    bottom: 8,
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // TIPS
  tipsList: { paddingHorizontal: 20, gap: 12 },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  tipCover: { width: 100, height: 130, backgroundColor: "#111" },
  tipBody: { flex: 1, padding: 14 },
  tipTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6,
  },
  tipText: { color: "#aaa", fontSize: 12, lineHeight: 18 },

  // FOOTER CTA
  footerCta: {
    margin: 20,
    marginTop: 32,
    padding: 24,
    backgroundColor: "rgba(0,212,255,0.08)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,212,255,0.25)",
    alignItems: "center",
  },
  footerEyebrow: {
    color: "#00d4ff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  footerH: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 18,
  },
  bigBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#00d4ff",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
  },
  bigBtnTxt: {
    color: "#000",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
